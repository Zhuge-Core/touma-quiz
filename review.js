(() => {
    'use strict';

    // 审题页不存任何内容，全部现读 questions.js，题库一改这里就跟着变
    const { checked, sources, levels, questions, roleNames } = window.TM_QUIZ;

    const LAMP_LABELS = { green: '绿灯', yellow: '黄灯', red: '红灯', none: '还不用亮灯' };
    const TYPE_LABELS = { choice: '选择题', light: '亮灯题', order: '排序题' };

    const make = (tag, className, text) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    };
    const withAlias = (text) => (roleNames[text] ? `${text}（${roleNames[text]}）` : text);

    const field = (label, body, className) => {
        const row = make('div', `field ${className || ''}`.trim());
        row.append(make('span', 'field-label', label));
        if (typeof body === 'string') row.append(make('p', 'field-body', body));
        else row.append(body);
        return row;
    };

    const sourceList = (keys) => {
        const list = make('ul', 'sources');
        keys.forEach((key) => {
            const source = sources[key];
            const item = make('li');
            if (!source) {
                item.textContent = `出处 ${key} 不存在`;
                item.className = 'is-missing';
            } else {
                const link = make('a', '', source.name);
                link.href = source.url;
                link.target = '_blank';
                link.rel = 'noopener';
                // 打印出来的纸上点不了链接，所以网址要印成字
                item.append(link, make('span', 'source-url', source.url));
            }
            list.append(item);
        });
        return list;
    };

    const optionList = (items, className) => {
        const list = make('ul', `options ${className}`);
        items.forEach((text) => list.append(make('li', '', text)));
        return list;
    };

    const answerParts = (question) => {
        if (question.type === 'light') {
            const wrong = Object.keys(LAMP_LABELS).filter((key) => key !== question.answer);
            return {
                stem: `你是比赛计时员。${question.contest}，选手讲到 ${question.clock}，该亮什么灯？`,
                right: [LAMP_LABELS[question.answer]],
                wrong: wrong.map((key) => LAMP_LABELS[key]),
            };
        }
        if (question.type === 'order') {
            const labels = question.slots || question.items.map((item, index) => `${index + 1}`);
            return {
                stem: question.q,
                right: question.items.map((item, index) => `${labels[index]}：${item}`),
                wrong: [],
            };
        }
        const [right, ...wrong] = question.options;
        return { stem: question.q, right: [withAlias(right)], wrong: wrong.map(withAlias) };
    };

    const questionCard = (question, number) => {
        const card = make('article', 'item');
        const head = make('header', 'item-head');
        const tags = [TYPE_LABELS[question.type] || question.type];
        if (question.core) tags.push('考这一级的真实要求');
        if (question.must) tags.push('每局必出');
        head.append(
            make('span', 'item-number', `${number}`),
            make('code', 'item-id', question.id),
            make('span', 'item-tags', tags.join('，')),
        );
        const parts = answerParts(question);
        card.append(head);
        if (question.quote) card.append(make('blockquote', 'item-quote', question.quote));
        card.append(
            make('h3', 'item-stem', parts.stem),
            field('正确答案', optionList(parts.right, 'is-right')),
        );
        if (parts.wrong.length > 0) card.append(field('错误选项', optionList(parts.wrong, 'is-wrong')));
        card.append(
            field('摘要', question.explain || '（缺）'),
            field('展开讲讲', question.detail || '（缺）'),
            field('出处', sourceList(question.src || [])),
        );
        return card;
    };

    const levelSection = (level, startNumber) => {
        const pool = questions.filter((item) => item.level === level.id);
        const section = make('section', 'level');
        section.append(
            make('h2', 'level-title', `${level.code}　${level.name}`),
            make('p', 'level-meta', `大意：${level.gloss}。题库 ${pool.length} 道，闯关每局抽 ${level.pick} 道。`),
        );

        const know = make('div', 'know');
        const points = make('ul', 'know-list');
        level.card.forEach((point) => points.append(make('li', '', point)));
        know.append(make('h3', 'know-title', `知识卡：${level.code} 要做什么`), points);
        if (level.note) know.append(make('p', 'know-note', level.note));
        know.append(field('出处', sourceList(level.src || [])));
        section.append(know, make('p', 'level-theme', `这一关另外会考：${level.theme}`));

        pool.forEach((question, index) => {
            section.append(questionCard(question, startNumber + index));
        });
        return section;
    };

    const root = document.getElementById('review-root');
    const intro = make('header', 'top');
    const counts = levels.map((level) => {
        const size = questions.filter((item) => item.level === level.id).length;
        return `${level.code} ${size} 道`;
    });
    const printButton = make('button', 'print-button', '打印这一页');
    printButton.type = 'button';
    printButton.addEventListener('click', () => window.print());
    intro.append(
        make('h1', 'top-title', '头马闯关 · 审题页'),
        make('p', 'top-line', `共 ${questions.length} 道题：${counts.join('，')}。题目核对于 ${checked}。`),
        make('p', 'top-line', '这一页给熟悉头马的会员逐条审题用。发现哪道题有问题，记下它的题号'
            + '（每道题左上角那串英文），告诉俱乐部管理员。规则以 toastmasters.org 当前页面为准。'),
        make('p', 'top-line', '角色英文名后面括号里的中文，是国内俱乐部的常见叫法，不是官方译名。'
            + '非官方学习工具，与 Toastmasters International 无关。'),
        printButton,
    );
    root.append(intro);

    let number = 1;
    levels.forEach((level) => {
        root.append(levelSection(level, number));
        number += questions.filter((item) => item.level === level.id).length;
    });

    const strays = questions.filter((item) => !levels.some((level) => level.id === item.level));
    if (strays.length > 0) {
        const section = make('section', 'level');
        section.append(make('h2', 'level-title', '没有归到任何一关的题（level 写错了）'));
        strays.forEach((question, index) => section.append(questionCard(question, number + index)));
        root.append(section);
    }
})();
