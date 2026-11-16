(() => {
    'use strict';

    const { sources, levels, questions } = window.TM_QUIZ;

    const LIGHTS = [
        { key: 'green', name: '绿牌', left: '还能错 2 次' },
        { key: 'yellow', name: '黄牌', left: '还能错 1 次' },
        { key: 'red', name: '红牌', left: '不能再错了' },
    ];
    const LAMPS = [
        { value: 'green', label: '绿灯' },
        { value: 'yellow', label: '黄灯' },
        { value: 'red', label: '红灯' },
        { value: 'none', label: '还不用亮灯' },
    ];
    const BEST_KEY = 'tm-quiz-best';
    const FLIP_MS = 360;
    const TOTAL = levels.reduce((sum, level) => sum + level.pick, 0);

    const $ = (selector) => document.querySelector(selector);
    const make = (tag, className, text) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    };
    const shuffle = (list) => {
        const copy = [...list];
        for (let i = copy.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    };

    const band = $('#band');
    const stage = $('#stage');
    const dock = $('#dock');
    const dockButton = $('#dock-button');

    let state = null;
    let dockAction = null;

    // 双击打开的 file:// 页面或隐私模式下 localStorage 可能直接抛错，最高分丢了也不该影响游戏
    const readBest = () => {
        try {
            return Number(window.localStorage.getItem(BEST_KEY)) || 0;
        } catch (error) {
            return 0;
        }
    };
    const writeBest = (score) => {
        try {
            window.localStorage.setItem(BEST_KEY, String(score));
        } catch (error) {
            /* 存不了就算了 */
        }
    };

    const drawLevel = (level) => {
        const pool = questions.filter((item) => item.level === level.id);
        const must = pool.filter((item) => item.must);
        const rest = shuffle(pool.filter((item) => !item.must));
        return shuffle([...must, ...rest].slice(0, level.pick));
    };

    const newState = () => ({
        deck: levels.map(drawLevel),
        levelIndex: 0,
        questionIndex: 0,
        light: 0,
        combo: 0,
        maxCombo: 0,
        score: 0,
        correct: 0,
        levelCorrect: 0,
        misses: [],
        out: false,
    });

    const showScreen = (id) => {
        ['start', 'play', 'result'].forEach((name) => {
            $(`#${name}`).hidden = name !== id;
        });
        window.scrollTo(0, 0);
    };

    const setDock = (label, action) => {
        dockAction = action;
        dockButton.textContent = label;
        dock.hidden = false;
    };
    const hideDock = () => {
        dockAction = null;
        dock.hidden = true;
    };

    const renderRoute = (target, currentIndex) => {
        target.replaceChildren(...levels.map((level, index) => {
            const row = make('li', 'route-row');
            if (index < currentIndex) row.classList.add('is-done');
            if (index === currentIndex) row.classList.add('is-current');
            row.append(
                make('span', 'route-code', level.code),
                make('span', 'route-name', level.name),
                make('span', 'route-short', index < currentIndex ? '已过关' : level.short),
            );
            return row;
        }));
    };

    const paintBand = (progress) => {
        const level = levels[state.levelIndex];
        $('#band-code').textContent = level.code;
        $('#band-name').textContent = level.name;
        $('#band-left').textContent = LIGHTS[state.light].left;
        $('#band-progress').textContent = progress;
        $('#band-combo').textContent = state.combo >= 2 ? `连对 ${state.combo} 题` : '';
        $('#band-score').textContent = `${state.score} 分`;
        document.querySelectorAll('#lamps li').forEach((lamp, index) => {
            lamp.classList.toggle('is-on', index === state.light);
        });
    };

    const flipBand = () => {
        const key = LIGHTS[state.light].key;
        band.classList.remove('is-flipping');
        // 读一次布局，让连续两次换牌时动画能重新开始
        void band.offsetWidth;
        band.classList.add('is-flipping');
        // 牌翻到侧面看不见的那一刻换颜色
        window.setTimeout(() => {
            band.dataset.light = key;
        }, FLIP_MS / 2);
    };

    const sourceLink = (key) => {
        const source = sources[key];
        if (!source) return null;
        const link = make('a', 'fb-src', `出处：${source.name}`);
        link.href = source.url;
        link.target = '_blank';
        link.rel = 'noopener';
        return link;
    };

    const nextStep = () => {
        const deck = state.deck[state.levelIndex];
        if (state.out) {
            showResult();
        } else if (state.questionIndex < deck.length - 1) {
            state.questionIndex += 1;
            showQuestion();
        } else {
            finishLevel();
        }
    };

    const settle = (question, isRight, answerText, box) => {
        const deck = state.deck[state.levelIndex];
        const isLastQuestion = state.questionIndex === deck.length - 1;
        const isLastLevel = state.levelIndex === levels.length - 1;
        const feedback = make('div', `fb ${isRight ? 'fb-right' : 'fb-wrong'}`);
        feedback.setAttribute('role', 'status');

        if (isRight) {
            state.combo += 1;
            state.maxCombo = Math.max(state.maxCombo, state.combo);
            state.correct += 1;
            state.levelCorrect += 1;
            const gain = 100 + Math.min(state.combo - 1, 5) * 10;
            state.score += gain;
            const streak = state.combo >= 2 ? `，连对 ${state.combo} 题` : '';
            feedback.append(make('p', 'fb-head', `答对了，+${gain} 分${streak}`));
        } else {
            state.combo = 0;
            state.misses.push({ question, answerText });
            feedback.append(
                make('p', 'fb-head', '答错了'),
                make('p', 'fb-answer', `正确答案：${answerText}`),
            );
        }
        feedback.append(make('p', 'fb-explain', question.explain));

        if (!isRight) {
            if (state.light === LIGHTS.length - 1) {
                state.out = true;
                feedback.append(make('p', 'fb-light', '红牌时又错一题，铃响了，这一局到此为止。'));
            } else {
                state.light += 1;
                flipBand();
                const light = LIGHTS[state.light];
                feedback.append(make('p', 'fb-light', `计时员举起了${light.name}，${light.left}。`));
            }
        }
        const link = sourceLink(question.src);
        if (link) feedback.append(link);

        box.append(feedback);
        paintBand(`第 ${state.questionIndex + 1} / ${deck.length} 题`);

        let label = '下一题';
        if (state.out || (isLastQuestion && isLastLevel)) label = '看结果';
        else if (isLastQuestion) label = '过关';
        setDock(label, nextStep);
        feedback.scrollIntoView({ block: 'nearest' });
    };

    const lock = (box) => {
        box.querySelectorAll('button').forEach((button) => {
            button.disabled = true;
        });
    };

    const renderChoice = (question, box) => {
        const [rightText] = question.options;
        const list = make('div', 'opts');
        shuffle(question.options).forEach((text) => {
            const option = make('button', 'opt');
            option.type = 'button';
            option.append(make('span', 'opt-box'), make('span', 'opt-text', text));
            option.addEventListener('click', () => {
                lock(box);
                list.querySelectorAll('.opt').forEach((other) => {
                    const otherText = other.querySelector('.opt-text').textContent;
                    if (otherText === rightText) other.classList.add('is-right');
                    else if (other === option) other.classList.add('is-wrong');
                    else other.classList.add('is-dim');
                });
                settle(question, text === rightText, rightText, box);
            });
            list.append(option);
        });
        box.append(list);
    };

    const renderLight = (question, box) => {
        const clock = make('div', 'clock');
        clock.append(
            make('span', 'clock-contest', question.contest),
            make('span', 'clock-time', question.clock),
        );
        const list = make('div', 'lamp-opts');
        const rightLamp = LAMPS.find((lamp) => lamp.value === question.answer);
        LAMPS.forEach((lamp) => {
            const option = make('button', 'lamp-opt', lamp.label);
            option.type = 'button';
            option.dataset.value = lamp.value;
            option.addEventListener('click', () => {
                lock(box);
                list.querySelectorAll('.lamp-opt').forEach((other) => {
                    if (other.dataset.value === question.answer) other.classList.add('is-right');
                    else if (other === option) other.classList.add('is-wrong');
                    else other.classList.add('is-dim');
                });
                settle(question, lamp.value === question.answer, rightLamp.label, box);
            });
            list.append(option);
        });
        box.append(clock, make('h2', 'q-text', '你是比赛计时员。选手讲到这个时间，该亮什么灯？'), list);
    };

    const renderOrder = (question, box) => {
        const size = question.items.length;
        const labels = question.slots || question.items.map((item, index) => `${index + 1}`);
        const picked = [];
        const slots = make('ol', 'slots');
        const chips = make('div', 'chips');
        let pool = shuffle(question.items);
        // 抽到的顺序碰巧就是正确答案时，这道题等于白送
        while (size > 1 && pool.every((item, index) => item === question.items[index])) {
            pool = shuffle(question.items);
        }

        const submit = () => {
            lock(box);
            hideDock();
            slots.querySelectorAll('.slot').forEach((slot, index) => {
                const isRight = picked[index] === question.items[index];
                slot.classList.add(isRight ? 'is-right' : 'is-wrong');
            });
            const isRight = picked.every((item, index) => item === question.items[index]);
            settle(question, isRight, question.items.join(' → '), box);
        };

        const paint = () => {
            slots.replaceChildren(...labels.map((label, index) => {
                const slot = make('li', 'slot');
                const fill = make('button', 'slot-fill', picked[index] || '');
                fill.type = 'button';
                fill.disabled = !picked[index];
                fill.addEventListener('click', () => {
                    picked.splice(index, 1);
                    paint();
                });
                slot.append(make('span', 'slot-label', label), fill);
                return slot;
            }));
            chips.replaceChildren(...pool.filter((item) => !picked.includes(item)).map((item) => {
                const chip = make('button', 'chip', item);
                chip.type = 'button';
                chip.addEventListener('click', () => {
                    picked.push(item);
                    paint();
                });
                return chip;
            }));
            if (picked.length === size) setDock('就按这个顺序', submit);
            else hideDock();
        };

        box.append(
            make('h2', 'q-text', question.q),
            make('p', 'q-hint', '按顺序点下面的名称。放错了，点一下已经放好的就能拿回来。'),
            slots,
            chips,
        );
        paint();
    };

    const showQuestion = () => {
        const deck = state.deck[state.levelIndex];
        const question = deck[state.questionIndex];
        const box = make('article', 'question');
        box.dataset.qid = question.id;
        hideDock();
        paintBand(`第 ${state.questionIndex + 1} / ${deck.length} 题`);
        stage.replaceChildren(box);

        if (question.type === 'light') {
            renderLight(question, box);
        } else if (question.type === 'order') {
            renderOrder(question, box);
        } else {
            if (question.quote) box.append(make('blockquote', 'quote', question.quote));
            box.append(make('h2', 'q-text', question.q));
            renderChoice(question, box);
        }
        window.scrollTo(0, 0);
    };

    const showIntro = (summary) => {
        const level = levels[state.levelIndex];
        const intro = make('div', 'intro');
        paintBand(`共 ${level.pick} 题`);

        if (summary) {
            const cleared = make('div', 'cleared');
            cleared.append(make('p', 'cleared-head', `${summary.code} 过关`));
            const notes = [`这一关 ${summary.total} 题答对 ${summary.correct} 题。`];
            if (summary.bonus) notes.push(`全对奖励 +${summary.bonus} 分。`);
            if (summary.recovered) {
                notes.push(`${summary.recovered.from}换回${summary.recovered.to}。`);
            }
            cleared.append(make('p', 'cleared-note', notes.join('')));
            intro.append(cleared);
        }

        const real = make('p', 'intro-fact');
        real.append(make('b', '', `真实的 ${level.code}：`), level.real);
        const theme = make('p', 'intro-fact');
        theme.append(make('b', '', '这一关考：'), level.theme);
        const route = make('ol', 'route');
        renderRoute(route, state.levelIndex);
        intro.append(
            make('h2', 'intro-name', level.name),
            make('p', 'intro-gloss', level.gloss),
            real,
            theme,
            route,
        );

        stage.replaceChildren(intro);
        setDock(`开始 ${level.code}`, showQuestion);
        window.scrollTo(0, 0);
    };

    const finishLevel = () => {
        const level = levels[state.levelIndex];
        const total = state.deck[state.levelIndex].length;
        const summary = { code: level.code, total, correct: state.levelCorrect };

        if (state.levelCorrect === total) {
            summary.bonus = 100;
            state.score += summary.bonus;
        }
        // 过关就回到绿牌：只退一格时，正确率七成的玩家四局里有三局见不到后面几关的题
        if (state.light > 0) {
            summary.recovered = { from: LIGHTS[state.light].name, to: LIGHTS[0].name };
            state.light = 0;
            flipBand();
        }
        state.levelCorrect = 0;
        state.questionIndex = 0;

        if (state.levelIndex === levels.length - 1) {
            showResult();
        } else {
            state.levelIndex += 1;
            showIntro(summary);
        }
    };

    const verdict = () => {
        const level = levels[state.levelIndex];
        if (state.out) {
            return {
                tone: 'out',
                title: '铃响下台',
                sub: `止步 ${level.code}`,
                line: `这次停在 ${level.code}。错题就在下面，看完再来。`,
            };
        }
        const line = '纸上 DTM 到手。真的 DTM，还得把那六项要求一项项做完。';
        const sub = '通关 DTM 终极关';
        if (state.misses.length === 0) return { tone: 'green', title: '一路绿牌', sub, line };
        if (state.misses.length <= 3) return { tone: 'yellow', title: '稳稳通关', sub, line };
        return { tone: 'red', title: '惊险通关', sub, line };
    };

    const today = () => {
        const now = new Date();
        const pad = (value) => String(value).padStart(2, '0');
        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    };

    const showResult = () => {
        const outcome = verdict();
        const best = readBest();
        const isNewBest = state.score > best;
        if (isNewBest) writeBest(state.score);

        $('#rosette').dataset.tone = outcome.tone;
        $('#result-title').textContent = outcome.title;
        $('#result-sub').textContent = outcome.sub;
        $('#result-line').textContent = outcome.line;
        $('#result-foot').textContent = `${today()}　非官方学习工具`;

        const rows = [
            ['答对', `${state.correct} / ${TOTAL} 题`],
            ['最长连对', `${state.maxCombo} 题`],
            ['得分', `${state.score} 分${isNewBest && best > 0 ? '，新纪录' : ''}`],
        ];
        $('#tally').replaceChildren(...rows.map(([label, value]) => {
            const row = make('div', 'tally-row');
            row.append(make('dt', '', label), make('dd', '', value));
            return row;
        }));

        $('#review').hidden = state.misses.length === 0;
        $('#review-list').replaceChildren(...state.misses.map(({ question, answerText }) => {
            const item = make('li', 'review-item');
            const prompt = question.type === 'light'
                ? `${question.contest}，讲到 ${question.clock} 该亮什么灯？`
                : question.q;
            if (question.quote) item.append(make('p', 'review-quote', `“${question.quote}”`));
            item.append(
                make('p', 'review-q', prompt),
                make('p', 'review-a', `正确答案：${answerText}`),
                make('p', 'review-explain', question.explain),
            );
            return item;
        }));

        hideDock();
        showScreen('result');
        // 先摘再别，「再来一局」之后奖花才会重新落下来
        const shot = $('#shot');
        shot.classList.remove('is-stamped');
        void shot.offsetWidth;
        shot.classList.add('is-stamped');
    };

    const showStart = () => {
        const best = readBest();
        $('#best').hidden = best === 0;
        $('#best').textContent = `你的最高分：${best} 分`;
        renderRoute($('#start-route'), -1);
        showScreen('start');
    };

    const startGame = () => {
        state = newState();
        band.classList.remove('is-flipping');
        band.dataset.light = LIGHTS[0].key;
        showScreen('play');
        showIntro(null);
    };

    dockButton.addEventListener('click', () => {
        if (dockAction) dockAction();
    });
    $('#start-button').addEventListener('click', startGame);
    $('#again-button').addEventListener('click', startGame);

    showStart();
})();
