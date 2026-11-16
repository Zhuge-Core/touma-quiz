/*
 * 头马闯关 · 题库（非官方学习工具）
 * 全部题目核对于 2026-11-16，规则以 toastmasters.org 当前页面为准。
 *
 * ── 怎么加一道题 ──────────────────────────────────────────────
 * 在最下面的 questions 数组里加一个 { ... }，一道题一个对象。三种题型：
 *
 * 1) 选择题（最常用）
 *    {
 *        id: 'l1-ice-len',        // 唯一编号，随便起，别和已有的重复
 *        level: 1,                // 放在第几关：1–5 对应 Level 1–5，6 是 DTM 终极关
 *        type: 'choice',
 *        q: '题干',
 *        quote: '一句台词',        // 可选。写了就变成「听台词猜角色」的样子
 *        options: ['正确答案', '错误选项', '错误选项', '错误选项'],
 *                                 // 第一个永远写正确答案，游戏会自动打乱顺序；2–4 个选项都行
 *        explain: '答完后给玩家看的一两句解释',
 *        src: 'faq',              // 出处，填下面 sources 里的某个名字
 *    }
 *
 * 2) 亮灯题（玩家当计时员）
 *    {
 *        id: 'l3-light-tt-yellow', level: 3, type: 'light',
 *        contest: '哪种比赛、规定时长',
 *        clock: '1:40',           // 选手讲到的时间，别取正好换灯的那一秒
 *        answer: 'yellow',        // green / yellow / red / none（none = 还不用亮灯）
 *        explain: '...', src: 'rulebook',
 *    }
 *
 * 3) 排序题
 *    {
 *        id: 'dtm-order-levels', level: 6, type: 'order',
 *        q: '题干',
 *        items: ['第一个', '第二个', '第三个'],   // 按正确顺序写，游戏会自动打乱
 *        slots: ['Level 1', 'Level 2', 'Level 3'], // 可选，每个位置前面的标签
 *        explain: '...', src: 'path',
 *    }
 *
 * 可选字段 must: true 表示这道题每局必出（每关默认随机抽）。
 *
 * ── 加题前请先做这三件事 ───────────────────────────────────────
 * - 到官网找到原文再出题，把出处填进 src（没有合适的就在 sources 里加一条）。
 * - 查不到官方出处的知识点不要出题，记到 README 的「未核实」清单。
 * - 头马专有名词保留英文（Pathways、Level、DTM、Table Topics、Ice Breaker 等）。
 */
window.TM_QUIZ = {
    sources: {
        faq: {
            name: 'Education Programs FAQ',
            url: 'https://www.toastmasters.org/education/education-programs-faq',
        },
        path: {
            name: 'Paths, Levels and Electives（Presentation Mastery）',
            url: 'https://www.toastmasters.org/pathways-overview/'
                + 'pathways-presentation-mastery-path',
        },
        updates: {
            name: 'Pathways Updates and Maintenance Schedule',
            url: 'https://www.toastmasters.org/education/pathways/pathways-updates',
        },
        awards: {
            name: 'Pathways Achievements and Awards',
            url: 'https://www.toastmasters.org/education/pathways/achievements-and-awards',
        },
        dtm: {
            name: 'Distinguished Toastmaster',
            url: 'https://www.toastmasters.org/education/distinguished-toastmaster',
        },
        roles: {
            name: 'Club Meeting Roles',
            url: 'https://www.toastmasters.org/membership/club-meeting-roles',
        },
        rulebook: {
            name: 'Speech Contest Rulebook 2026–2027',
            url: 'https://www.toastmasters.org/resources/2026-2027-speech-contest-rulebook',
        },
        dcp: {
            name: 'Distinguished Club Program 手册（2026-07 生效版）',
            url: 'https://www.toastmasters.org/resources/1111-distinguished-club-program',
        },
        history: {
            name: 'Our History',
            url: 'https://www.toastmasters.org/about/history/our-history',
        },
        icebreaker: {
            name: 'Toastmaster 杂志 2023-08：The Ice Breaker',
            url: 'https://www.toastmasters.org/magazine/magazine-issues/2023/aug/sidebars/'
                + 'the-ice-breaker',
        },
        officers: {
            name: 'Toastmaster 杂志 2019-07：Congratulations, Incoming Club Officers',
            url: 'https://www.toastmasters.org/magazine/magazine-issues/2019/july/'
                + 'congratulations-incoming-club-officers',
        },
        coach: {
            name: 'Toastmaster 杂志 2026-02：The Win-Win of the Club Coach Program',
            url: 'https://www.toastmasters.org/magazine/magazine-issues/2026/february/'
                + 'the-win-win-of-the-club-coach-program',
        },
    },

    /*
     * 六关。name 是官方英文名；gloss 是帮助理解的大意，不是官方中文译名。
     * real 写真实 Pathways 里这一级的结构；theme 是这一关出什么题（游戏自己排的）。
     * pick 是每局从这一关的题里抽几道。
     */
    levels: [
        {
            id: 1,
            code: 'Level 1',
            name: 'Mastering Fundamentals',
            gloss: '打好基本功',
            real: '4 个必修项目：Ice Breaker、Writing a Speech with Purpose、'
                + 'Introduction to Vocal Variety and Body Language、Evaluation and Feedback。',
            theme: '入门常识：Ice Breaker、Table Topics 和例会基础。',
            short: '入门常识',
            pick: 4,
        },
        {
            id: 2,
            code: 'Level 2',
            name: 'Learning Your Style',
            gloss: '认识自己的风格',
            real: '3 个必修项目，了解自己的沟通或领导风格，'
                + '其中一个是 Introduction to Toastmasters Mentoring。',
            theme: '会议角色：听台词，猜是谁在说话。',
            short: '会议角色',
            pick: 4,
        },
        {
            id: 3,
            code: 'Level 3',
            name: 'Increasing Knowledge',
            gloss: '拓展知识',
            real: '1 个必修项目，再从选修项目里自选 2 个。英文 path 从 2025 年 10 月起，'
                + 'Level 3 到 5 还要给俱乐部做 Education Series 分享。',
            theme: '你来当计时员：按官方比赛规则亮灯。俱乐部例会可以有自己的约定。',
            short: '计时亮灯',
            pick: 4,
        },
        {
            id: 4,
            code: 'Level 4',
            name: 'Building Skills',
            gloss: '锻炼技能',
            real: '1 个必修项目，再从选修项目里自选 1 个。',
            theme: '俱乐部怎么运转：干事分工和 Distinguished Club Program。',
            short: '俱乐部与干事',
            pick: 4,
        },
        {
            id: 5,
            code: 'Level 5',
            name: 'Demonstrating Expertise',
            gloss: '展示专长',
            real: '2 个必修项目加 1 个自选项目，最后用 Reflect on Your Path 收尾。',
            theme: 'Pathways 全景：有几条 path、几个 Level、多少个项目。',
            short: 'Pathways 全景',
            pick: 4,
        },
        {
            id: 6,
            code: 'DTM',
            name: 'Distinguished Toastmaster',
            gloss: '头马教育体系里的最高成就',
            real: '完成两条不同的 path 只是六项要求里的第一项。',
            theme: 'DTM 到底要做完哪些事。',
            short: '终极关',
            pick: 5,
        },
    ],

    questions: [
        /* ── 第 1 关 · Level 1 · 入门常识 ───────────────────────── */
        {
            id: 'l1-first-project',
            level: 1,
            type: 'choice',
            q: '目前六条主 path 的 Level 1，第一个项目都是什么？',
            options: ['Ice Breaker', 'Table Topics', 'Reflect on Your Path', 'Persuasive Speaking'],
            explain: 'Ice Breaker 是每条 path 的开场演讲，用来向俱乐部介绍自己。'
                + 'Reflect on Your Path 则是收尾的项目。',
            src: 'path',
        },
        {
            id: 'l1-ice-len',
            level: 1,
            type: 'choice',
            q: 'Ice Breaker 这篇演讲要讲多久？',
            options: ['4 到 6 分钟', '1 到 2 分钟', '5 到 7 分钟', '7 到 10 分钟'],
            explain: '官方建议选一个能讲 4 到 6 分钟的话题。之后常见的备稿演讲多是 5 到 7 分钟。',
            src: 'icebreaker',
        },
        {
            id: 'l1-projects-count',
            level: 1,
            type: 'choice',
            q: '2021 年 10 月更新后，六条主 path 的 Level 1 有几个项目？',
            options: ['4 个', '2 个', '3 个', '5 个'],
            explain: 'Ice Breaker、Writing a Speech with Purpose、Introduction to Vocal Variety '
                + 'and Body Language、Evaluation and Feedback。部分翻译版的 legacy path 仍是旧结构。',
            src: 'faq',
        },
        {
            id: 'l1-not-l1',
            level: 1,
            type: 'choice',
            q: '下面哪个项目不在 Level 1？',
            options: [
                'Introduction to Toastmasters Mentoring',
                'Ice Breaker',
                'Writing a Speech with Purpose',
                'Evaluation and Feedback',
            ],
            explain: 'Introduction to Toastmasters Mentoring 是 Level 2 的项目，其余三个都在 Level 1。',
            src: 'path',
        },
        {
            id: 'l1-tt-len',
            level: 1,
            type: 'choice',
            q: 'Table Topics 即兴发言，官方建议说多久？',
            options: ['1 到 2 分钟', '30 秒以内', '3 到 4 分钟', '5 到 7 分钟'],
            explain: '官方对 Table Topics Speaker 的说明：清楚、简洁地表达想法，时长 1 到 2 分钟。',
            src: 'roles',
        },
        {
            id: 'l1-tt-before-ice',
            level: 1,
            type: 'choice',
            q: '2025 年 10 月英文 path 更新后，做 Ice Breaker 之前要先担任一次什么角色？',
            options: [
                'Table Topics Speaker',
                'Toastmaster of the Day',
                'General Evaluator',
                'Grammarian',
            ],
            explain: '更新后每个 Level 都有必做的会议角色，Level 1 是 Table Topics Speaker、'
                + 'Evaluator、Timer 或 Ah-Counter。翻译版 path 暂未加入这项要求。',
            src: 'faq',
        },
        {
            id: 'l1-ah-counter',
            level: 1,
            type: 'choice',
            q: '例会上谁负责记录大家的口头禅、填充词和过长的停顿？',
            options: ['Ah-Counter', 'Grammarian', 'Timer', 'Topicsmaster'],
            explain: 'Ah-Counter 记下被当成“拐杖”的填充音和口头禅，在评估环节向大家报告。',
            src: 'roles',
        },
        {
            id: 'l1-timer-report',
            level: 1,
            type: 'choice',
            quote: '第一位演讲者，用时 6 分 12 秒。',
            q: '例会快结束时，这句话是谁在报告？',
            options: ['Timer', 'Ah-Counter', 'General Evaluator', 'Toastmaster'],
            explain: 'Timer 负责给每个环节和每位发言者计时，被请到时报告姓名和用时。',
            src: 'roles',
        },
        {
            id: 'l1-basecamp',
            level: 1,
            type: 'choice',
            q: '会员在哪个线上平台学习 Pathways 的项目？',
            options: ['Base Camp', 'Club Central', 'Speechcraft', 'Leader Letter'],
            explain: 'Base Camp 是 Pathways 的线上学习平台。'
                + 'Level 完成申请也在这里提交，由俱乐部的 Base Camp manager 批准。',
            src: 'faq',
        },

        /* ── 第 2 关 · Level 2 · 会议角色 ───────────────────────── */
        {
            id: 'l2-tmd',
            level: 2,
            type: 'choice',
            quote: '接下来有请今晚的第一位演讲者，她的演讲题目是《第一次搬家》。',
            q: '这句台词属于哪个角色？',
            options: ['Toastmaster', 'General Evaluator', 'Topicsmaster', 'Timer'],
            explain: 'Toastmaster（常叫 Toastmaster of the Day）是例会的主持人和总导演，'
                + '负责介绍演讲者、衔接各环节。',
            src: 'roles',
        },
        {
            id: 'l2-ge',
            level: 2,
            type: 'choice',
            quote: '现在进入评估环节。先请各位评估员，再请 Timer、Ah-Counter 和 Grammarian 做报告。',
            q: '这句台词属于哪个角色？',
            options: ['General Evaluator', 'Toastmaster', 'Topicsmaster', 'Evaluator'],
            explain: 'General Evaluator 评估整场例会，并主持评估环节。',
            src: 'roles',
        },
        {
            id: 'l2-topicsmaster',
            level: 2,
            type: 'choice',
            quote: '今晚还没机会上台的朋友，我先请你：如果明天突然放假，你会去哪儿？',
            q: '这句台词属于哪个角色？',
            options: ['Topicsmaster', 'Toastmaster', 'Grammarian', 'Evaluator'],
            explain: 'Topicsmaster 主持 Table Topics 环节，优先把机会给当晚没有发言角色的会员。',
            src: 'roles',
        },
        {
            id: 'l2-grammarian',
            level: 2,
            type: 'choice',
            quote: '今天的 Word of the Day 是 resilient。我会记下谁在发言里用上了它。',
            q: '这句台词属于哪个角色？',
            options: ['Grammarian', 'Ah-Counter', 'Topicsmaster', 'General Evaluator'],
            explain: 'Grammarian 介绍新词，并留意大家的语法和用词。Word of the Day 是可选的做法。',
            src: 'roles',
        },
        {
            id: 'l2-eval-before',
            level: 2,
            type: 'choice',
            q: '演讲开始前，官方建议评估员先做什么？',
            options: [
                '问演讲者这次要讲什么、想达到什么目标',
                '先把演讲稿要来改一遍',
                '提前想好要挑的三个毛病',
                '请计时员提前亮红灯',
            ],
            explain: '先了解演讲者的目标，评估才能对准对方最想进步的地方。',
            src: 'roles',
        },
        {
            id: 'l2-eval-balance',
            level: 2,
            type: 'choice',
            q: '按官方要求，一次评估应该怎么给反馈？',
            options: [
                '既有肯定，也有建设性的改进建议',
                '只讲优点，免得打击信心',
                '只讲问题，节省时间',
                '把演讲内容复述一遍',
            ],
            explain: '官方说法是 offer praise as well as constructive criticism，'
                + '而且口头和书面评估都要给。',
            src: 'roles',
        },
        {
            id: 'l2-ge-team',
            level: 2,
            type: 'choice',
            q: 'General Evaluator 带领的评估团队有哪些人？',
            options: [
                '演讲评估员、Ah-Counter、Grammarian、Timer',
                'President、VPE、Secretary',
                'Topicsmaster 和所有 Table Topics 发言者',
                'Toastmaster 和 Sergeant at Arms',
            ],
            explain: '官方说明里，General Evaluator 负责的评估团队就是这四类角色。',
            src: 'roles',
        },
        {
            id: 'l2-agenda-from',
            level: 2,
            type: 'choice',
            q: '当 Toastmaster 之前，会议议程应该找哪位干事拿？',
            options: [
                'Vice President Education (VPE)',
                'Treasurer',
                'Vice President Public Relations (VPPR)',
                'Sergeant at Arms',
            ],
            explain: '官方角色说明的第一条就是向 VPE 要会议议程。',
            src: 'roles',
        },

        /* ── 第 3 关 · Level 3 · 计时亮灯（全部按比赛规则） ─────── */
        {
            id: 'l3-light-intl-green',
            level: 3,
            type: 'light',
            contest: 'International Speech Contest，演讲 5–7 分钟',
            clock: '5:30',
            answer: 'green',
            explain: '绿灯 5:00 亮，黄灯 6:00，红灯 7:00。5:30 还在绿灯段。',
            src: 'rulebook',
        },
        {
            id: 'l3-light-intl-yellow',
            level: 3,
            type: 'light',
            contest: 'International Speech Contest，演讲 5–7 分钟',
            clock: '6:20',
            answer: 'yellow',
            explain: '6:00 换黄灯，亮满一分钟，7:00 再换红灯。',
            src: 'rulebook',
        },
        {
            id: 'l3-light-intl-red',
            level: 3,
            type: 'light',
            contest: 'International Speech Contest，演讲 5–7 分钟',
            clock: '7:10',
            answer: 'red',
            explain: '7:00 起亮红灯，一直亮到演讲结束。超过 7 分 30 秒会被取消资格。',
            src: 'rulebook',
        },
        {
            id: 'l3-light-tt-yellow',
            level: 3,
            type: 'light',
            contest: 'Table Topics Contest，发言 1–2 分钟',
            clock: '1:40',
            answer: 'yellow',
            explain: 'Table Topics 比赛：绿灯 1:00，黄灯 1:30，红灯 2:00。',
            src: 'rulebook',
        },
        {
            id: 'l3-light-tt-none',
            level: 3,
            type: 'light',
            contest: 'Table Topics Contest，发言 1–2 分钟',
            clock: '0:45',
            answer: 'none',
            explain: '绿灯要到 1:00 才亮。不满 1 分钟就结束，会被取消资格。',
            src: 'rulebook',
        },
        {
            id: 'l3-dq-over',
            level: 3,
            type: 'choice',
            q: 'International Speech Contest 的演讲是 5–7 分钟。讲到多久算超时、取消资格？',
            options: ['超过 7 分 30 秒', '超过 7 分钟', '超过 8 分钟', '超时不取消资格，只扣分'],
            explain: '不满 4 分 30 秒，或者超过 7 分 30 秒，都会被取消资格。',
            src: 'rulebook',
        },
        {
            id: 'l3-tt-window',
            level: 3,
            type: 'choice',
            q: 'Table Topics Contest 里，发言时长落在哪个区间才不会被取消资格？',
            options: [
                '满 1 分钟，不超过 2 分 30 秒',
                '满 30 秒，不超过 2 分钟',
                '满 1 分 30 秒，不超过 3 分钟',
                '满 2 分钟，不超过 3 分 30 秒',
            ],
            explain: '规定时长是 1–2 分钟。下限没有宽限，上限有 30 秒宽限。',
            src: 'rulebook',
        },
        {
            id: 'l3-eval-prep',
            level: 3,
            type: 'choice',
            q: 'Evaluation Contest 里，听完测试演讲后选手有多久准备评估？',
            options: ['5 分钟', '1 分钟', '10 分钟', '不给准备时间'],
            explain: '所有选手有 5 分钟准备，时间一到就不能再写。评估发言本身是 2–3 分钟。',
            src: 'rulebook',
        },
        {
            id: 'l3-timing-start',
            level: 3,
            type: 'choice',
            q: '比赛中，计时从哪一刻开始？',
            options: [
                '选手对观众的第一个明确表达，说话或动作都算',
                '主持人念出选手名字时',
                '选手走到讲台站定时',
                '计时员亮起绿灯时',
            ],
            explain: '规则原文是 definite verbal or nonverbal communication with the audience，'
                + '音效和表演动作也算。开场确认设备的那句 “Thank you, Contest Chair” 不计时。',
            src: 'rulebook',
        },

        /* ── 第 4 关 · Level 4 · 俱乐部与干事 ───────────────────── */
        {
            id: 'l4-vpe',
            level: 4,
            type: 'choice',
            q: '会员的 Level 完成申请，通常由哪位干事在 Base Camp 上批准？',
            options: [
                'Vice President Education (VPE)',
                'Vice President Membership (VPM)',
                'Treasurer',
                'Sergeant at Arms',
            ],
            explain: 'VPE 通常是俱乐部的主要 Base Camp manager。'
                + 'VPE 不方便时，President 和 Secretary 也可以批。',
            src: 'faq',
        },
        {
            id: 'l4-self-approve',
            level: 4,
            type: 'choice',
            q: 'VPE 自己完成了一个 Level，可以在 Base Camp 上给自己批准吗？',
            options: [
                '不可以，要请另一位干事批准',
                '可以，VPE 有这个权限',
                '可以，但要先口头告知 President',
            ],
            explain: '官方规定干事不能批准自己的完成申请，要由俱乐部里另一位干事来批。',
            src: 'faq',
        },
        {
            id: 'l4-not-officer',
            level: 4,
            type: 'choice',
            q: '下面哪个不是俱乐部干事岗位？',
            options: [
                'Area Director',
                'Sergeant at Arms',
                'Vice President Public Relations',
                'Treasurer',
            ],
            explain: 'Area Director 是 District 层面的职位。俱乐部的七个干事是 President、VPE、'
                + 'VPM、VPPR、Secretary、Treasurer、Sergeant at Arms。',
            src: 'dcp',
        },
        {
            id: 'l4-vpm',
            level: 4,
            type: 'choice',
            quote: '欢迎来做客！想了解怎么入会，随时找我。',
            q: '说这句话的最可能是哪位干事？',
            options: [
                'Vice President Membership (VPM)',
                'Vice President Education (VPE)',
                'Secretary',
                'Treasurer',
            ],
            explain: 'VPM 专注于发展会员：解答来宾的问题，策划吸引访客的活动。',
            src: 'officers',
        },
        {
            id: 'l4-vppr',
            level: 4,
            type: 'choice',
            q: '负责俱乐部对外形象，管宣传、网站和社交媒体的干事是？',
            options: [
                'Vice President Public Relations (VPPR)',
                'Vice President Membership (VPM)',
                'Secretary',
                'President',
            ],
            explain: 'VPPR 负责俱乐部的公众形象。VPM 负责的是招新和接待来宾。',
            src: 'officers',
        },
        {
            id: 'l4-dcp-goals',
            level: 4,
            type: 'choice',
            q: '衡量俱乐部质量的 Distinguished Club Program (DCP) 一共有几个目标？',
            options: ['10 个', '5 个', '7 个', '12 个'],
            explain: '10 个目标分四类：教育 6 个、会员 2 个、干事培训 1 个、行政 1 个。'
                + '达成 5 个、并满足会员数等前提，可以评 Distinguished。',
            src: 'dcp',
        },
        {
            id: 'l4-dcp-top',
            level: 4,
            type: 'choice',
            q: '2025–2026 年度起，DCP 新增的最高一档叫什么？',
            options: [
                'Smedley Distinguished',
                'President’s Distinguished',
                'Select Distinguished',
                'Distinguished',
            ],
            explain: '以创始人 Smedley 命名：10 个目标全部达成，且至少 25 名会员。'
                + '四档依次对应 5、7、9、10 个目标。',
            src: 'dcp',
        },
        {
            id: 'l4-coach',
            level: 4,
            type: 'choice',
            q: '俱乐部会员数落在什么范围，才符合申请 club coach 的条件？',
            options: ['3 到 12 人', '13 到 19 人', '20 人以上', '没有人数限制'],
            explain: 'club coach 去帮人数偏少的俱乐部重建。教练要服务满 6 个月、'
                + '并帮俱乐部评上 Distinguished 或更高，才算拿到 credit。',
            src: 'coach',
        },

        /* ── 第 5 关 · Level 5 · Pathways 全景 ──────────────────── */
        {
            id: 'l5-level3-name',
            level: 5,
            type: 'choice',
            q: 'Pathways 的 Level 3 叫什么？',
            options: [
                'Increasing Knowledge',
                'Building Skills',
                'Learning Your Style',
                'Mastering Fundamentals',
            ],
            explain: 'Level 3 是 Increasing Knowledge：1 个必修项目，再从选修里挑 2 个。',
            src: 'path',
        },
        {
            id: 'l5-paths-count',
            level: 5,
            type: 'choice',
            q: '2024 年 10 月新版 Base Camp 上线后，Pathways 的主 path 有几条？',
            options: ['6 条', '11 条', '5 条', '8 条'],
            explain: '从 11 条调整为 6 条：Dynamic Leadership、Engaging Humor、Motivational '
                + 'Strategies、Persuasive Influence、Presentation Mastery、Visionary Communication。'
                + '2026 年另外加了两条 vintage path。',
            src: 'faq',
        },
        {
            id: 'l5-not-path',
            level: 5,
            type: 'choice',
            q: '下面哪条 path 已经停售，不在现在的六条主 path 里？',
            options: [
                'Leadership Development',
                'Presentation Mastery',
                'Dynamic Leadership',
                'Engaging Humor',
            ],
            explain: 'Leadership Development 属于 legacy path，2024-10-23 起不再出售，'
                + '之前买了的会员仍然可以完成。',
            src: 'faq',
        },
        {
            id: 'l5-projects-count',
            level: 5,
            type: 'choice',
            q: '完成一条 path，一共要做多少个项目？',
            options: ['15 个', '10 个', '12 个', '20 个'],
            explain: '五个 Level 合计 15 个项目：11 个必修加 4 个选修。',
            src: 'faq',
        },
        {
            id: 'l5-last-project',
            level: 5,
            type: 'choice',
            q: '每条 path 收尾的最后一个项目是什么？',
            options: [
                'Reflect on Your Path',
                'Ice Breaker',
                'High Performance Leadership',
                'DTM project',
            ],
            explain: '其他项目都完成后，用 Reflect on Your Path 回顾整条 path，再提交 path 完成申请。',
            src: 'faq',
        },
        {
            id: 'l5-proficient',
            level: 5,
            type: 'choice',
            q: '完成一整条 path 后，你会得到哪个称号？',
            options: [
                'Proficient，比如 Presentation Mastery Proficient',
                'Distinguished Toastmaster',
                'Pathways Mentor',
                'World Champion of Public Speaking',
            ],
            explain: '每完成一条 path 得到一个 Proficient 称号。'
                + 'DTM 需要两条 path，外加一系列领导力要求。',
            src: 'awards',
        },
        {
            id: 'l5-founded',
            level: 5,
            type: 'choice',
            q: '第一个长期延续下来的 Toastmasters 俱乐部成立于哪一年？',
            options: ['1924 年', '1905 年', '1932 年', '1950 年'],
            explain: '1924 年 10 月 22 日，Ralph C. Smedley 在美国加州 Santa Ana 的 YMCA 地下室'
                + '开了第一次会。1905 年是他最早的非正式尝试，1932 年是组织注册成立。',
            src: 'history',
        },

        /* ── 终极关 · DTM ───────────────────────────────────────── */
        {
            id: 'dtm-what',
            level: 6,
            type: 'choice',
            must: true,
            q: 'DTM 是什么？',
            options: [
                '头马教育体系里个人能拿到的最高成就',
                'District 里负责培训的干事职位',
                '例会上主持 Table Topics 的角色',
                'International Speech Contest 的冠军头衔',
            ],
            explain: 'DTM 全称 Distinguished Toastmaster，是头马教育体系里的最高成就。',
            src: 'dtm',
        },
        {
            id: 'dtm-order-levels',
            level: 6,
            type: 'order',
            must: true,
            q: '冲 DTM 之前先回顾一下：把五个 Level 的名称按 1 到 5 排好。',
            items: [
                'Mastering Fundamentals',
                'Learning Your Style',
                'Increasing Knowledge',
                'Building Skills',
                'Demonstrating Expertise',
            ],
            slots: ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'],
            explain: '先打基础，再认识自己的风格，然后拓展知识、锻炼技能，最后展示专长。',
            src: 'path',
        },
        {
            id: 'dtm-paths',
            level: 6,
            type: 'choice',
            q: '拿 DTM，需要完成几条 path？',
            options: ['两条不同的 path', '一条', '同一条 path 做两遍', '全部六条'],
            explain: '官方原文是 two unique learning paths，必须是两条不同的 path。',
            src: 'dtm',
        },
        {
            id: 'dtm-only-paths',
            level: 6,
            type: 'choice',
            q: '“做完两条 path 就能拿到 DTM。”这句话对吗？',
            options: [
                '不对，后面还有五项要求',
                '对，两条 path 就是全部要求',
                '对，但两条都要拿满分',
            ],
            explain: '还要：任俱乐部干事、任一年 District leader、当 club mentor 或 coach、'
                + '当 club sponsor 或办 Speechcraft / Youth Leadership、完成 DTM project。',
            src: 'dtm',
        },
        {
            id: 'dtm-club-officer',
            level: 6,
            type: 'choice',
            q: 'DTM 对俱乐部干事任期的要求是？',
            options: [
                '任满 12 个月：一届年任期，或两届半年任期',
                '任满 6 个月就够',
                '必须连任两年',
                '必须当过 President',
            ],
            explain: '任期内还要参与制定 Club Success Plan，并参加 District 举办的干事培训。',
            src: 'dtm',
        },
        {
            id: 'dtm-district',
            level: 6,
            type: 'choice',
            q: 'DTM 在 District 层面的要求是？',
            options: [
                '完整担任一年 District leader',
                '在 District 比赛里拿过名次',
                '参加过一次 District 大会',
                '没有 District 层面的要求',
            ],
            explain: '官方原文：Serve a complete one-year term as a District leader。',
            src: 'dtm',
        },
        {
            id: 'dtm-mentor-coach',
            level: 6,
            type: 'choice',
            q: 'DTM 要求“成功担任”下面哪种角色？',
            options: [
                'club mentor 或 club coach',
                '比赛的 chief judge',
                'World Headquarters 志愿者',
                'Table Topics 比赛冠军',
            ],
            explain: '官方原文：Serve successfully as a club mentor or coach。'
                + 'club coach 是去帮会员数偏少（3 到 12 人）的俱乐部重建。',
            src: 'dtm',
        },
        {
            id: 'dtm-sponsor',
            level: 6,
            type: 'choice',
            q: 'DTM 的一项要求：担任 club sponsor，或者组织一期什么项目？',
            options: [
                'Speechcraft 或 Youth Leadership',
                'Table Topics 马拉松',
                'Base Camp 训练营',
                'Humorous Speech Contest',
            ],
            explain: '官方原文：Serve successfully as a club sponsor or conduct a Speechcraft '
                + 'or Youth Leadership program。',
            src: 'dtm',
        },
        {
            id: 'dtm-project-when',
            level: 6,
            type: 'choice',
            q: '什么时候可以申请在 Base Camp 上开通 DTM project？',
            options: [
                '完成一条 path，加上另一条不同 path 的 Level 1 到 3',
                '入会满一年',
                '完成第一条 path 的 Level 1',
                '两条 path 全部完成之后',
            ],
            explain: 'DTM project 是自己设计并落地执行的一个项目，'
                + '达到条件后发邮件给总部的教育项目团队申请开通。',
            src: 'dtm',
        },
    ],
};
