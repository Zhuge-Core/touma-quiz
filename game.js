(() => {
    'use strict';

    const { sources, levels, questions, roleNames } = window.TM_QUIZ;

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
    const WRONG_KEY = 'tm-quiz-wrong';
    const FLIP_MS = 360;
    // 闯关每关至少抽 2 道考“这一级真实要求”的题，知识卡讲过的内容才考得到
    const CORE_QUOTA = 2;
    // 闯关里答对不会清错题，优先出的错题每关封顶 2 道，免得每局都是同样几道
    const WRONG_QUOTA = 2;
    const TOTAL = levels.reduce((sum, level) => sum + level.pick, 0);
    const WRONG_STAGE = { code: '错题本', name: '只练答错过的题' };

    const $ = (selector) => document.querySelector(selector);
    const make = (tag, className, text) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    };
    const makeButton = (className, text, action) => {
        const button = make('button', className, text);
        button.type = 'button';
        if (action) button.addEventListener('click', action);
        return button;
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

    // 双击打开的 file:// 页面或隐私模式下 localStorage 可能直接抛错，记录丢了也不该影响答题
    const readStore = (key) => {
        try {
            return window.localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    };
    const writeStore = (key, value) => {
        try {
            window.localStorage.setItem(key, value);
        } catch (error) {
            /* 存不了就算了 */
        }
    };
    const readBest = () => Number(readStore(BEST_KEY)) || 0;

    const loadWrong = () => {
        let ids = [];
        try {
            ids = JSON.parse(readStore(WRONG_KEY) || '[]');
        } catch (error) {
            ids = [];
        }
        // 题库改过之后，旧记录里可能有已经删掉的题号
        const known = new Set(questions.map((item) => item.id));
        return new Set((Array.isArray(ids) ? ids : []).filter((id) => known.has(id)));
    };
    const saveWrong = (wrong) => writeStore(WRONG_KEY, JSON.stringify([...wrong]));
    const markWrong = (id) => saveWrong(loadWrong().add(id));
    const clearWrong = (id) => {
        const wrong = loadWrong();
        const had = wrong.delete(id);
        if (had) saveWrong(wrong);
        return had;
    };

    const withAlias = (text) => (roleNames[text] ? `${text}（${roleNames[text]}）` : text);
    const promptOf = (question) => (question.type === 'light'
        ? `${question.contest}，讲到 ${question.clock} 该亮什么灯？`
        : question.q);
    const answerOf = (question) => {
        if (question.type === 'light') {
            return LAMPS.find((lamp) => lamp.value === question.answer).label;
        }
        if (question.type === 'order') return question.items.join(' → ');
        return withAlias(question.options[0]);
    };

    // 答错过的排前面，其余随机
    const missedFirst = (list, wrong) => {
        const mixed = shuffle(list);
        return [
            ...mixed.filter((item) => wrong.has(item.id)),
            ...mixed.filter((item) => !wrong.has(item.id)),
        ];
    };

    const drawLevel = (level, wrong) => {
        const pool = questions.filter((item) => item.level === level.id);
        const picked = pool.filter((item) => item.must);
        let wrongLeft = WRONG_QUOTA;
        const take = (candidates, count) => {
            const free = shuffle(candidates.filter((item) => !picked.includes(item)));
            const missed = free.filter((item) => wrong.has(item.id)).slice(0, wrongLeft);
            const chosen = [...missed, ...free.filter((item) => !missed.includes(item))]
                .slice(0, Math.max(count, 0));
            wrongLeft -= chosen.filter((item) => missed.includes(item)).length;
            picked.push(...chosen);
        };
        const coreCount = Math.min(CORE_QUOTA, level.pick - picked.length);
        take(pool.filter((item) => item.core), coreCount);
        take(pool, level.pick - picked.length);
        return shuffle(picked);
    };

    const newState = (mode, stages) => ({
        mode,
        stages,
        stageIndex: 0,
        questionIndex: 0,
        light: 0,
        combo: 0,
        maxCombo: 0,
        score: 0,
        correct: 0,
        stageCorrect: 0,
        misses: [],
        out: false,
    });
    const isChallenge = () => state.mode === 'challenge';
    const currentStage = () => state.stages[state.stageIndex];

    const showScreen = (id) => {
        ['start', 'pick', 'play', 'result'].forEach((name) => {
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
        const { level } = currentStage();
        const challenge = isChallenge();
        $('#band-code').textContent = level.code;
        $('#band-name').textContent = level.name;
        $('#band-progress').textContent = progress;
        $('#lamps').hidden = !challenge;
        $('#band-left').textContent = challenge ? LIGHTS[state.light].left : '练习，不扣命';
        $('#band-combo').textContent = challenge && state.combo >= 2 ? `连对 ${state.combo} 题` : '';
        $('#band-score').hidden = !challenge;
        $('#band-score').textContent = `${state.score} 分`;
        $('#band-exit').hidden = challenge;
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
            if (isChallenge()) band.dataset.light = key;
        }, FLIP_MS / 2);
    };

    const buildSources = (keys) => {
        const line = make('p', 'src-line', '出处：');
        keys.filter((key) => sources[key]).forEach((key, index) => {
            if (index > 0) line.append('、');
            const link = make('a', '', sources[key].name);
            link.href = sources[key].url;
            link.target = '_blank';
            link.rel = 'noopener';
            line.append(link);
        });
        return line;
    };

    const copyText = (text) => {
        // 老办法兜底：新接口在 file:// 页面、内嵌网页或没有焦点时会拒绝
        const legacy = () => {
            const area = make('textarea', 'copy-area');
            area.value = text;
            area.setAttribute('readonly', '');
            document.body.append(area);
            area.select();
            let copied = false;
            try {
                copied = document.execCommand('copy');
            } catch (error) {
                copied = false;
            }
            area.remove();
            return copied;
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text).then(() => true, legacy);
        }
        return Promise.resolve(legacy());
    };

    const buildReport = (question) => {
        const wrap = make('div', 'report');
        const status = make('p', 'report-status');
        status.setAttribute('role', 'status');
        status.hidden = true;
        const button = makeButton('report-button', '这题有问题', () => {
            const lines = ['头马闯关纠错', `题号：${question.id}`];
            if (question.quote) lines.push(`台词：${question.quote}`);
            lines.push(`题干：${promptOf(question)}`);
            copyText(lines.join('\n')).then((copied) => {
                status.textContent = copied
                    ? '已复制，发给俱乐部管理员。'
                    : `复制不了。请把题号 ${question.id} 抄下来，发给俱乐部管理员。`;
                status.hidden = false;
            });
        });
        wrap.append(button, status);
        return wrap;
    };

    const buildDetail = (question, open) => {
        const detail = make('details', 'detail');
        detail.open = open;
        detail.append(make('summary', '', '展开讲讲'), make('p', 'detail-text', question.detail));
        return detail;
    };

    const buildReviewItem = (question) => {
        const item = make('li', 'review-item');
        if (question.quote) item.append(make('p', 'review-quote', `“${question.quote}”`));
        item.append(
            make('p', 'review-q', promptOf(question)),
            make('p', 'review-a', `正确答案：${answerOf(question)}`),
            make('p', 'review-explain', question.explain),
            make('p', 'review-detail', question.detail),
            buildSources(question.src),
            buildReport(question),
        );
        return item;
    };

    const nextStep = () => {
        const deck = currentStage().questions;
        if (state.out) {
            showResult();
        } else if (state.questionIndex < deck.length - 1) {
            state.questionIndex += 1;
            showQuestion();
        } else {
            finishStage();
        }
    };

    const settle = (question, isRight, box) => {
        const deck = currentStage().questions;
        const challenge = isChallenge();
        const isLastQuestion = state.questionIndex === deck.length - 1;
        const isLastStage = state.stageIndex === state.stages.length - 1;
        const feedback = make('div', `fb ${isRight ? 'fb-right' : 'fb-wrong'}`);
        const notes = [];
        feedback.setAttribute('role', 'status');

        if (isRight) {
            state.combo += 1;
            state.maxCombo = Math.max(state.maxCombo, state.combo);
            state.correct += 1;
            state.stageCorrect += 1;
            let head = '答对了';
            if (challenge) {
                const gain = 100 + Math.min(state.combo - 1, 5) * 10;
                state.score += gain;
                head += `，+${gain} 分${state.combo >= 2 ? `，连对 ${state.combo} 题` : ''}`;
            } else if (clearWrong(question.id)) {
                notes.push(make('p', 'fb-note', '这道题已从错题本里移除。'));
            }
            feedback.append(make('p', 'fb-head', head));
        } else {
            state.combo = 0;
            state.misses.push(question);
            markWrong(question.id);
            feedback.append(
                make('p', 'fb-head', '答错了'),
                make('p', 'fb-answer', `正确答案：${answerOf(question)}`),
            );
            if (!challenge) {
                notes.push(make('p', 'fb-note', '已记入错题本，可以在首页“只练错题”里再练。'));
            } else if (state.light === LIGHTS.length - 1) {
                state.out = true;
                notes.push(make('p', 'fb-light', '红牌时又错一题，铃响了，这一局到此为止。'));
            } else {
                state.light += 1;
                flipBand();
                const light = LIGHTS[state.light];
                notes.push(make('p', 'fb-light', `计时员举起了${light.name}，${light.left}。`));
            }
        }
        feedback.append(
            make('p', 'fb-explain', question.explain),
            ...notes,
            // 练习就是来学的，讲解一直摊开；闯关里答对了先折起来，不打断节奏
            buildDetail(question, !isRight || !challenge),
            buildSources(question.src),
            buildReport(question),
        );

        box.append(feedback);
        paintBand(`第 ${state.questionIndex + 1} / ${deck.length} 题`);

        let label = '下一题';
        if (challenge && (state.out || (isLastQuestion && isLastStage))) label = '看结果';
        else if (challenge && isLastQuestion) label = '过关';
        else if (isLastQuestion) label = '看小结';
        setDock(label, nextStep);
        feedback.scrollIntoView({ block: 'nearest' });
    };

    const lock = (box) => {
        box.querySelectorAll('.opt, .lamp-opt, .chip, .slot-fill').forEach((button) => {
            button.disabled = true;
        });
    };

    const renderChoice = (question, box) => {
        const [rightText] = question.options;
        const list = make('div', 'opts');
        shuffle(question.options).forEach((text) => {
            const option = makeButton('opt');
            // 判定用题库里的原文，显示时才加中文叫法，两者互不影响
            option.dataset.right = text === rightText ? '1' : '0';
            option.append(make('span', 'opt-box'), make('span', 'opt-text', withAlias(text)));
            option.addEventListener('click', () => {
                lock(box);
                list.querySelectorAll('.opt').forEach((other) => {
                    if (other.dataset.right === '1') other.classList.add('is-right');
                    else if (other === option) other.classList.add('is-wrong');
                    else other.classList.add('is-dim');
                });
                settle(question, text === rightText, box);
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
        LAMPS.forEach((lamp) => {
            const option = makeButton('lamp-opt', lamp.label);
            option.dataset.value = lamp.value;
            option.addEventListener('click', () => {
                lock(box);
                list.querySelectorAll('.lamp-opt').forEach((other) => {
                    if (other.dataset.value === question.answer) other.classList.add('is-right');
                    else if (other === option) other.classList.add('is-wrong');
                    else other.classList.add('is-dim');
                });
                settle(question, lamp.value === question.answer, box);
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
            settle(question, picked.every((item, index) => item === question.items[index]), box);
        };

        const paint = () => {
            slots.replaceChildren(...labels.map((label, index) => {
                const slot = make('li', 'slot');
                const fill = makeButton('slot-fill', picked[index] || '', () => {
                    picked.splice(index, 1);
                    paint();
                });
                fill.disabled = !picked[index];
                slot.append(make('span', 'slot-label', label), fill);
                return slot;
            }));
            chips.replaceChildren(...pool.filter((item) => !picked.includes(item)).map((item) => (
                makeButton('chip', item, () => {
                    picked.push(item);
                    paint();
                })
            )));
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
        const deck = currentStage().questions;
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

    const buildKnowCard = (level) => {
        const card = make('section', 'know');
        const list = make('ul', 'know-list');
        level.card.forEach((point) => list.append(make('li', '', point)));
        card.append(make('h3', 'know-title', `${level.code} 要做什么`), list);
        if (level.note) card.append(make('p', 'know-note', level.note));
        card.append(buildSources(level.src));
        return card;
    };

    const showIntro = (summary) => {
        const { level, questions: deck } = currentStage();
        const intro = make('div', 'intro');
        paintBand(`共 ${deck.length} 题`);

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

        const theme = make('p', 'intro-fact');
        theme.append(make('b', '', '这一关还会考：'), level.theme);
        intro.append(
            make('h2', 'intro-name', level.name),
            make('p', 'intro-gloss', level.gloss),
            buildKnowCard(level),
            theme,
        );
        if (isChallenge()) {
            const route = make('ol', 'route');
            renderRoute(route, state.stageIndex);
            intro.append(route);
        }

        stage.replaceChildren(intro);
        setDock(isChallenge() ? `开始 ${level.code}` : `开始练习 ${level.code}`, showQuestion);
        window.scrollTo(0, 0);
    };

    const showPracticeDone = () => {
        const { level, questions: deck } = currentStage();
        const wrong = loadWrong();
        const done = make('div', 'done');
        const missed = state.misses.length;
        const lines = [`${deck.length} 题答对 ${state.correct} 题。`];
        if (state.mode === 'wrong') {
            lines.push(wrong.size > 0 ? `错题本里还剩 ${wrong.size} 道。` : '错题本清空了。');
        } else if (missed > 0) {
            lines.push(`答错的 ${missed} 题记进了错题本。`);
        }
        done.append(
            make('h2', 'done-title', state.mode === 'wrong' ? '错题练完一轮' : `${level.code} 练完了`),
            make('p', 'done-note', lines.join('')),
        );

        const actions = make('div', 'done-actions');
        const levelIndex = levels.indexOf(level);
        if (state.mode === 'practice' && levelIndex < levels.length - 1) {
            const next = levels[levelIndex + 1];
            actions.append(makeButton('primary', `练下一关：${next.code}`, () => {
                startPractice(levelIndex + 1);
            }));
        }
        if (wrong.size > 0) {
            const label = `只练错题（${wrong.size} 道）`;
            const kind = state.mode === 'wrong' ? 'primary' : 'secondary';
            actions.append(makeButton(kind, label, startWrong));
        }
        if (state.mode === 'practice') {
            actions.append(makeButton('secondary', `再练一遍 ${level.code}`, () => {
                startPractice(levelIndex);
            }));
        }
        actions.append(makeButton('secondary', '回首页', showStart));
        done.append(actions);

        if (missed > 0) {
            const list = make('ol', 'review-list');
            list.append(...state.misses.map(buildReviewItem));
            done.append(make('h3', 'review-title', '这一轮答错的题'), list);
        }

        paintBand('练完了');
        hideDock();
        stage.replaceChildren(done);
        window.scrollTo(0, 0);
    };

    const finishStage = () => {
        if (!isChallenge()) {
            showPracticeDone();
            return;
        }
        const { level, questions: deck } = currentStage();
        const summary = { code: level.code, total: deck.length, correct: state.stageCorrect };

        if (state.stageCorrect === deck.length) {
            summary.bonus = 100;
            state.score += summary.bonus;
        }
        // 过关就回到绿牌：只退一格时，正确率七成的玩家四局里有三局见不到后面几关的题
        if (state.light > 0) {
            summary.recovered = { from: LIGHTS[state.light].name, to: LIGHTS[0].name };
            state.light = 0;
            flipBand();
        }
        state.stageCorrect = 0;
        state.questionIndex = 0;

        if (state.stageIndex === state.stages.length - 1) {
            showResult();
        } else {
            state.stageIndex += 1;
            showIntro(summary);
        }
    };

    const verdict = () => {
        const { level } = currentStage();
        if (state.out) {
            return {
                tone: 'out',
                title: '铃响下台',
                sub: `止步 ${level.code}`,
                line: `这次停在 ${level.code}。答错的题和讲解就在下面，看完再来。`,
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
        if (isNewBest) writeStore(BEST_KEY, String(state.score));

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

        const wrong = loadWrong();
        $('#review').hidden = state.misses.length === 0;
        $('#review-list').replaceChildren(...state.misses.map(buildReviewItem));
        $('#result-wrong').hidden = wrong.size === 0;
        $('#result-wrong').textContent = `只练错题（${wrong.size} 道）`;

        hideDock();
        showScreen('result');
        // 先摘再别，“再来一局”之后奖花才会重新落下来
        const shot = $('#shot');
        shot.classList.remove('is-stamped');
        void shot.offsetWidth;
        shot.classList.add('is-stamped');
    };

    const showStart = () => {
        const best = readBest();
        const wrong = loadWrong();
        $('#best').hidden = best === 0;
        $('#best').textContent = `闯关最高分：${best} 分`;
        $('#wrong-button').disabled = wrong.size === 0;
        $('#wrong-button').textContent = wrong.size > 0 ? `只练错题（${wrong.size} 道）` : '只练错题';
        $('#wrong-note').textContent = wrong.size > 0
            ? '答错过的题都记在这台设备上。在这里答对一道，就划掉一道。'
            : '现在还没有错题。闯关或练习时答错的题，会记在这台设备上。';
        renderRoute($('#start-route'), -1);
        showScreen('start');
    };

    const showPick = () => {
        const wrong = loadWrong();
        $('#pick-list').replaceChildren(...levels.map((level, index) => {
            const pool = questions.filter((item) => item.level === level.id);
            const missed = pool.filter((item) => wrong.has(item.id)).length;
            const row = make('li', 'pick-row');
            const button = makeButton('pick-button', undefined, () => startPractice(index));
            const count = make('span', 'pick-count', `${pool.length} 题`);
            if (missed > 0) count.append(make('em', '', `错过 ${missed} 题`));
            const text = make('span', 'pick-text');
            text.append(make('b', '', level.name), make('span', '', level.short));
            button.append(make('span', 'pick-code', level.code), text, count);
            row.append(button);
            return row;
        }));
        showScreen('pick');
    };

    const begin = (mode, stages, withIntro) => {
        state = newState(mode, stages);
        band.classList.remove('is-flipping');
        band.dataset.light = mode === 'challenge' ? LIGHTS[0].key : 'practice';
        showScreen('play');
        if (withIntro) showIntro(null);
        else showQuestion();
    };

    const startChallenge = () => {
        const wrong = loadWrong();
        const stages = levels.map((level) => ({ level, questions: drawLevel(level, wrong) }));
        begin('challenge', stages, true);
    };

    const startPractice = (levelIndex) => {
        const level = levels[levelIndex];
        const pool = questions.filter((item) => item.level === level.id);
        begin('practice', [{ level, questions: missedFirst(pool, loadWrong()) }], true);
    };

    const startWrong = () => {
        const wrong = loadWrong();
        // 按关卡顺序出，同一关的错题挨在一起，复习起来不跳
        const deck = questions.filter((item) => wrong.has(item.id));
        if (deck.length === 0) {
            showStart();
            return;
        }
        begin('wrong', [{ level: WRONG_STAGE, questions: deck }], false);
    };

    dockButton.addEventListener('click', () => {
        if (dockAction) dockAction();
    });
    $('#challenge-button').addEventListener('click', startChallenge);
    $('#practice-button').addEventListener('click', showPick);
    $('#wrong-button').addEventListener('click', startWrong);
    $('#pick-back').addEventListener('click', showStart);
    $('#band-exit').addEventListener('click', showStart);
    $('#again-button').addEventListener('click', startChallenge);
    $('#result-wrong').addEventListener('click', startWrong);
    $('#result-home').addEventListener('click', showStart);

    showStart();
})();
