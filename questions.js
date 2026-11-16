/*
 * 头马闯关 · 题库（非官方学习工具）
 * 全部题目核对于 2026-11-16，规则以 toastmasters.org 当前页面为准。
 * 游戏（index.html）和审题页（review.html）都直接读这个文件，改这里两边一起变。
 *
 * ── 怎么加一道题 ──────────────────────────────────────────────
 * 在最下面的 questions 数组里加一个 { ... }，一道题一个对象。三种题型：
 *
 * 1) 选择题（最常用）
 *    {
 *        id: 'l1-ice-len',        // 题号，唯一，别和已有的重复；纠错时大家报的就是它
 *        level: 1,                // 放在第几关：1–5 对应 Level 1–5，6 是 DTM 终极关
 *        type: 'choice',
 *        q: '题干',               // 只问现行规则，不要把“哪年改版”写进题干
 *        quote: '一句台词',        // 可选。写了就变成“听台词猜角色”的样子
 *        options: ['正确答案', '错误选项', '错误选项', '错误选项'],
 *                                 // 第一个永远写正确答案，页面会自动打乱顺序；2–4 个都行
 *        explain: '一两句摘要：这道题为什么选它',
 *        detail: '展开讲讲：三到五句话，把这道题背后的知识点讲完整。'
 *            + '答错时自动展开，答对时折叠；练习模式和错题回顾里一直显示。',
 *        src: ['faq'],            // 出处，填下面 sources 里的名字，可以填多个
 *    }
 *
 * 2) 亮灯题（玩家当计时员）
 *    {
 *        id: 'l3-light-tt-yellow', level: 3, type: 'light',
 *        contest: '哪种比赛、规定时长',
 *        clock: '1:40',           // 选手讲到的时间，别取正好换灯的那一秒
 *        answer: 'yellow',        // green / yellow / red / none（none = 还不用亮灯）
 *        explain: '...', detail: '...', src: ['rulebook'],
 *    }
 *
 * 3) 排序题
 *    {
 *        id: 'dtm-order-levels', level: 6, type: 'order',
 *        q: '题干',
 *        items: ['第一个', '第二个', '第三个'],   // 按正确顺序写，页面会自动打乱
 *        slots: ['Level 1', 'Level 2', 'Level 3'], // 可选，每个位置前面的标签
 *        explain: '...', detail: '...', src: ['path'],
 *    }
 *
 * 可选标记：
 *   must: true   每局闯关必出这道题。
 *   core: true   这道题直接考“这一级真实要做什么”（对应关卡开头的知识卡）。
 *                闯关时每关至少抽 2 道 core 题，做到先讲后考。
 *
 * ── 会议角色的中文叫法 ─────────────────────────────────────────
 * roleNames 里是“英文角色名 → 国内俱乐部的常见叫法”，不是官方译名。
 * 选项如果正好等于某个英文角色名（例如 'Timer'），页面会自动显示成“Timer（时间官）”，
 * 不用自己写括号，正确答案的判定也不受影响。
 * 题干、摘要、讲解里想带中文叫法，直接写在文字里，例如“Timer（时间官）负责……”。
 *
 * ── 加题前请先做这三件事 ───────────────────────────────────────
 * - 到官网找到原文再出题，把出处填进 src（没有合适的就在 sources 里加一条）。
 * - detail 里每一句都要在出处里找得到；拿不准的句子宁可不写。
 * - 查不到官方出处的知识点不要出题，记到 README 的“未核实”清单。
 *
 * 加完用浏览器打开 review.html，新题会自动出现在对应关卡下面，方便请人审。
 */
window.TM_QUIZ = {
    checked: '2026-11-16',

    // 英文角色名 → 国内俱乐部的常见叫法（不是官方译名）
    roleNames: {
        'Toastmaster': '主持人',
        'Toastmaster of the Day': '主持人',
        'General Evaluator': '总评',
        'Evaluator': '点评员 / 个评',
        'Timer': '时间官',
        'Ah-Counter': '哼哈官',
        'Grammarian': '语法官',
        'Topicsmaster': '即兴主持人',
        'Table Topics Master': '即兴主持人',
    },

    sources: {
        faq: {
            name: 'Education Programs FAQ',
            url: 'https://www.toastmasters.org/education/education-programs-faq',
        },
        path: {
            name: 'Paths, Levels and Electives（六条 path 各有一页）',
            url: 'https://www.toastmasters.org/pathways-overview/pathways-presentation-mastery-pat'
                + 'h',
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
            name: 'Club Meeting Roles（各角色的说明页）',
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
            url: 'https://www.toastmasters.org/magazine/magazine-issues/2023/aug/sidebars/the-ice-'
                + 'breaker',
        },
        time: {
            name: 'Toastmaster 杂志 2025-02：Manage Your Speaking Time',
            url: 'https://www.toastmasters.org/magazine/magazine-issues/2025/feb/manage-your-speak'
                + 'ing-time',
        },
        recog: {
            name: 'Toastmaster 杂志 2025-08：What Recognition Updates Mean',
            url: 'https://www.toastmasters.org/magazine/magazine-issues/2025/august/what-recogniti'
                + 'on-updates-mean',
        },
        officers: {
            name: 'Toastmaster 杂志 2019-07：Congratulations, Incoming Club Officers',
            url: 'https://www.toastmasters.org/magazine/magazine-issues/2019/july/congratulations-'
                + 'incoming-club-officers',
        },
        coach: {
            name: 'Toastmaster 杂志 2026-02：The Win-Win of the Club Coach Program',
            url: 'https://www.toastmasters.org/magazine/magazine-issues/2026/february/the-win-win-'
                + 'of-the-club-coach-program',
        },
    },

    /*
     * 六关。name 是官方英文名；gloss 是帮助理解的大意，不是官方中文译名。
     * card 是关卡开头那张“这一级要做什么”知识卡，一条一句，写真实 Pathways 的要求；
     * note 是卡片底下的一句提醒，src 是这张卡的出处。
     * theme 是这一关另外考什么（游戏自己排的）。
     * pick 是闯关时每局从这一关抽几道题。
     */
    levels: [
        {
            id: 1,
            code: 'Level 1',
            name: 'Mastering Fundamentals',
            gloss: '打好基本功',
            theme: '入门常识：Ice Breaker、Table Topics 和例会基础。',
            short: '入门常识',
            pick: 4,
            card: [
                '4 个必修项目，没有选修：Ice Breaker、Writing a Speech with Purpose、Introduction to Vocal '
                    + 'Variety and Body Language、Evaluation and Feedback。',
                'Ice Breaker 是第一篇演讲，4 到 6 分钟，讲讲你自己。',
                '英文 path 还要担任三个会议角色：Table Topics Speaker（要在 Ice Breaker 之前）、Evaluator（点评员）、Timer（时'
                    + '间官）或 Ah-Counter（哼哈官）二选一。',
                '全部做完，在 Base Camp 提交 Level 完成申请，通常由 VPE 批准。',
            ],
            note: '会议角色和分享的要求目前只在英文 path 里，翻译版（含简体中文）暂未加入，官方仍鼓励去做。',
            src: ['path', 'faq', 'icebreaker'],
        },
        {
            id: 2,
            code: 'Level 2',
            name: 'Learning Your Style',
            gloss: '认识自己的风格',
            theme: '会议角色：听台词，猜是谁在说话。',
            short: '会议角色',
            pick: 4,
            card: [
                '3 个必修项目，没有选修。前两个各 path 不同，第三个都是 Introduction to Toastmasters Mentoring。',
                '英文 path 的会议角色：Grammarian（语法官）、Topicsmaster（即兴主持人）、Evaluator（点评员），再从 Toastmaster '
                    + 'of the Day（主持人）、Timer、Ah-Counter 里选一个。',
                '完成 Level 2 之后，可以免费开始 Pathways Mentor Program，也达到了参加 International Speech Contest '
                    + '的 Pathways 门槛（Level 1 和 2）。',
            ],
            note: '会议角色和分享的要求目前只在英文 path 里，翻译版（含简体中文）暂未加入，官方仍鼓励去做。',
            src: ['path', 'faq', 'awards', 'rulebook'],
        },
        {
            id: 3,
            code: 'Level 3',
            name: 'Increasing Knowledge',
            gloss: '拓展知识',
            theme: '你来当计时员：按官方比赛规则亮灯。俱乐部例会可以有自己的约定。',
            short: '计时亮灯',
            pick: 4,
            card: [
                '1 个必修项目（各 path 不同），再从选修清单里自选 2 个。选修从这一级开始出现。',
                '英文 path 的会议角色：Toastmaster of the Day（主持人）、Evaluator（点评员），再从 Table Topics Speaker、'
                    + 'Topicsmaster、Introductory Mentor 里选一个。',
                '英文 path 还要给俱乐部做一次 Successful Club Series 的专题分享。',
                '完成 Level 3 起，可以申请让总部给你的雇主寄一封成就信。',
            ],
            note: '会议角色和分享的要求目前只在英文 path 里，翻译版（含简体中文）暂未加入，官方仍鼓励去做。',
            src: ['path', 'faq', 'awards'],
        },
        {
            id: 4,
            code: 'Level 4',
            name: 'Building Skills',
            gloss: '锻炼技能',
            theme: '俱乐部怎么运转：干事分工和 Distinguished Club Program。',
            short: '俱乐部与干事',
            pick: 4,
            card: [
                '1 个必修项目（各 path 不同），再自选 1 个选修。',
                '英文 path 的会议角色：Toastmaster of the Day（主持人）、General Evaluator（总评）、Evaluator（点评员），再加'
                    + '一个自选角色。General Evaluator 从这一级开始必做。',
                '英文 path 要做两次分享：Successful Club Series 和 Better Speaker Series 各一次。',
                '完成 Level 4 可以计入俱乐部 DCP 的教育目标第 5、6 项。',
            ],
            note: '会议角色和分享的要求目前只在英文 path 里，翻译版（含简体中文）暂未加入，官方仍鼓励去做。',
            src: ['path', 'faq', 'dcp'],
        },
        {
            id: 5,
            code: 'Level 5',
            name: 'Demonstrating Expertise',
            gloss: '展示专长',
            theme: 'Pathways 全景：有几条 path、多少个项目、完成后得到什么。',
            short: 'Pathways 全景',
            pick: 4,
            card: [
                '1 个必修项目（各 path 不同），再自选 1 个选修。',
                '五个 Level 都获批后，做最后一个项目 Reflect on Your Path，再提交 path 完成申请。',
                '英文 path 的会议角色：General Evaluator（总评）、Toastmaster of the Day（主持人）、Evaluator（点评员）各两次'
                    + '，再加一个自选角色。',
                '英文 path 要做两次分享：Successful Club Series 和 Leadership Excellence Series 各一次。',
                '完成整条 path（一共 15 个项目）得到 Proficient 称号。',
            ],
            note: '会议角色和分享的要求目前只在英文 path 里，翻译版（含简体中文）暂未加入，官方仍鼓励去做。',
            src: ['path', 'faq', 'awards'],
        },
        {
            id: 6,
            code: 'DTM',
            name: 'Distinguished Toastmaster',
            gloss: '头马教育体系里的最高成就',
            theme: 'DTM 到底要做完哪些事。',
            short: '终极关',
            pick: 5,
            card: [
                '一、完成两条不同的 path。',
                '二、任俱乐部干事满一届年任期或两届半年任期，并参与制定 Club Success Plan、参加 District 办的干事培训。',
                '三、完整担任一年 District leader。',
                '四、成功担任 club mentor 或 club coach。',
                '五、成功担任 club sponsor，或组织一期 Speechcraft 或 Youth Leadership。',
                '六、完成 DTM project：自己设计并实施的一个项目。完成一条 path 加上另一条 path 的 Level 1 到 3 之后可以申请开通。',
            ],
            note: '完整要求以官方的 Distinguished Toastmaster Award Application 为准。',
            src: ['dtm', 'awards', 'faq'],
        },
    ],

    questions: [
        /* ── 第 1 关 · Level 1 · 这一级的真实要求（core）＋入门常识 ── */
        {
            id: 'l1-first-project',
            level: 1,
            type: 'choice',
            core: true,
            q: '六条主 path 的 Level 1，第一个项目都是什么？',
            options: ['Ice Breaker', 'Table Topics', 'Reflect on Your Path', 'Persuasive Speaking'],
            explain: 'Ice Breaker 是每条 path 的开场演讲，用来向俱乐部介绍自己。',
            detail: 'Ice Breaker 讲的是你自己：可以讲人生里的一件大事，也可以只讲你最爱吃的一道菜，不一定要很私人。官方给的简单模板是：先自我介绍，主体部分分享你想'
                + '让会员了解的事，结尾用一个和“想成为更好的演讲者和领导者”有关的小故事收住。演讲要有开头、主体和结尾，时长 4 到 6 分钟。如果在别的 path 里已经做过'
                + ' Ice Breaker，这次可以讲讲为什么选这条新 path。',
            src: ['icebreaker', 'path'],
        },
        {
            id: 'l1-ice-len',
            level: 1,
            type: 'choice',
            core: true,
            q: 'Ice Breaker 这篇演讲要讲多久？',
            options: ['4 到 6 分钟', '1 到 2 分钟', '5 到 7 分钟', '7 到 10 分钟'],
            explain: '官方建议选一个能讲 4 到 6 分钟的话题。',
            detail: 'Ice Breaker 是 4 到 6 分钟，比之后常见的备稿演讲短一点。官方杂志给的常见时间参考是：备稿演讲通常 5 到 7 分钟，Table '
                + 'Topics 1 到 2 分钟，评估 2 到 3 分钟。没达到时间目标也不会“不及格”，头马不是及格制；但官方提醒，对准目标（包括时间目标）去练，收获才最大。',
            src: ['icebreaker', 'time', 'faq'],
        },
        {
            id: 'l1-projects-count',
            level: 1,
            type: 'choice',
            core: true,
            q: '现行六条主 path 的 Level 1 有几个项目？',
            options: ['4 个', '2 个', '3 个', '5 个'],
            explain: 'Ice Breaker、Writing a Speech with Purpose、Introduction to Vocal Variety and '
                + 'Body Language、Evaluation and Feedback，一共 4 个，都是必修。',
            detail: '这个 4 项目的 Level 1 是 2021 年 10 月 27 日发布的更新版。更早的 Level 1 是 3 个项目：Ice Breaker、'
                + 'Evaluation and Feedback、Researching and Presenting；更新后 Researching and '
                + 'Presenting 改成了 Level 3 的选修。现在六条主 path 的英文、简体中文等版本用的都是更新版。已经停售的 legacy path 里，英文'
                + '版也换成了更新版，阿拉伯语、法语、德语、简体中文、西班牙语版仍是原来的 3 项目结构。',
            src: ['faq', 'path'],
        },
        {
            id: 'l1-not-l1',
            level: 1,
            type: 'choice',
            core: true,
            q: '下面哪个项目不在 Level 1？',
            options: [
                'Introduction to Toastmasters Mentoring',
                'Ice Breaker',
                'Writing a Speech with Purpose',
                'Evaluation and Feedback',
            ],
            explain: 'Introduction to Toastmasters Mentoring 是 Level 2 的项目，其余三个都在 Level 1。',
            detail: '六条主 path 的 Level 1 完全相同，都是那 4 个项目。Level 2 有 3 个项目，前两个各 path 不同，第三个都是 '
                + 'Introduction to Toastmasters Mentoring。完成 Level 2 之后，还可以免费开始 Pathways Mentor '
                + 'Program；做完这个 program 再加一整条 path，就成为 Pathways Mentor。',
            src: ['path', 'awards'],
        },
        {
            id: 'l1-electives',
            level: 1,
            type: 'choice',
            core: true,
            q: 'Level 1 有选修项目吗？',
            options: ['没有，4 个项目全是必修', '有，要自选 1 个', '有，要自选 2 个'],
            explain: 'Level 1 和 Level 2 都没有选修，选修从 Level 3 开始。',
            detail: '一条 path 一共 15 个项目：11 个必修加 4 个选修。选修分布在后三级：Level 3 自选 2 个，Level 4 和 Level 5 各自选'
                + ' 1 个。官方说明里，选修至少做 4 个，想多做几个也可以。六条主 path 的 Level 1 一模一样，所以不管选哪条 path，起步的四个项目都相同。',
            src: ['faq', 'path'],
        },
        {
            id: 'l1-tt-before-ice',
            level: 1,
            type: 'choice',
            core: true,
            q: '按现行英文 path 的要求，做 Ice Breaker 之前要先担任一次什么角色？',
            options: [
                'Table Topics Speaker',
                'Toastmaster of the Day',
                'General Evaluator',
                'Grammarian',
            ],
            explain: '英文 path 的 Level 1 要求先当一次 Table Topics Speaker，再做 Ice Breaker。',
            detail: '2025 年 10 月起，六条主 path 的英文版在每个 Level 开头加了一节“必做的会议角色”。Level 1 是三个：Table Topics '
                + 'Speaker、Evaluator（点评员）、Timer（时间官）或 Ah-Counter（哼哈官）二选一。角色大多不限先后，但有两个例外：Table '
                + 'Topics Speaker 要在 Ice Breaker 之前，Evaluator 要结合 Evaluation and Feedback 项目来做。翻译版'
                + ' path（含简体中文）目前没有加入这些要求，官方仍鼓励大家去做这些角色。',
            src: ['faq', 'updates'],
        },
        {
            id: 'l1-roles',
            level: 1,
            type: 'choice',
            core: true,
            q: '现行英文 path 的 Level 1 要担任三个会议角色：Table Topics Speaker、Evaluator，还有一个是？',
            options: [
                'Timer（时间官）或 Ah-Counter（哼哈官）二选一',
                'Toastmaster of the Day（主持人）',
                'General Evaluator（总评）',
                'Grammarian（语法官）和 Topicsmaster（即兴主持人）',
            ],
            explain: 'Level 1 的三个角色：Table Topics Speaker、Evaluator、Timer 或 Ah-Counter。',
            detail: '这些角色必须在做这一级的期间完成：做 Level 1 时当过的角色，不能拿去抵 Level 2 的要求。会员可以在 Base Camp 个人资料页的 '
                + 'Meeting Roles 一栏记下担任的角色和日期，方便干事核对。Grammarian 和 Topicsmaster 是 Level 2 的要求，'
                + 'Toastmaster of the Day 到 Level 3 才指定必做，General Evaluator 是 Level 4。这些要求目前只在英文 '
                + 'path 里，翻译版 path（含简体中文）暂未加入。',
            src: ['faq'],
        },
        {
            id: 'l1-tt-len',
            level: 1,
            type: 'choice',
            q: 'Table Topics 即兴发言，官方建议说多久？',
            options: ['1 到 2 分钟', '30 秒以内', '3 到 4 分钟', '5 到 7 分钟'],
            explain: '官方对 Table Topics Speaker 的说明：清楚、简洁地表达想法，时长 1 到 2 分钟。',
            detail: 'Table Topics 是头马的老传统，用来练习快速组织想法、回应一个即兴的问题或话题。它通常排在备稿演讲之后：Toastmaster（主持人）先介绍 '
                + 'Topicsmaster（即兴主持人），Topicsmaster 简单说明这个环节，再随机点人回答。官方杂志给的常见时间范围是最少 1 分钟、最多 2 分 '
                + '30 秒，而且 Table Topics 的下限没有其他发言那样的 30 秒宽限。',
            src: ['roles', 'time'],
        },
        {
            id: 'l1-ah-counter',
            level: 1,
            type: 'choice',
            q: '例会上哪个角色负责记录大家的口头禅、填充词和过长的停顿？',
            options: ['Ah-Counter', 'Grammarian', 'Timer', 'Topicsmaster'],
            explain: 'Ah-Counter（哼哈官）记下被当成“拐杖”的填充音和口头禅，在评估环节向大家报告。',
            detail: 'Ah-Counter 留意的是被当成“拐杖”的词和声音：and、well、but、so、you know 这类口头禅，ah、um、er 这类填充音，还有过'
                + '长的停顿。会前向 Sergeant at Arms 要一份记录表，没有就自己做笔记；被介绍时向大家说明这个角色；在评估环节被请到时报告观察结果。官方说这个角色'
                + '锻炼的是观察和倾听能力。',
            src: ['roles'],
        },
        {
            id: 'l1-timer-report',
            level: 1,
            type: 'choice',
            quote: '第一位演讲者，用时 6 分 12 秒。',
            q: '例会快结束时，这句话是谁在报告？',
            options: ['Timer', 'Ah-Counter', 'General Evaluator', 'Toastmaster'],
            explain: 'Timer（时间官）负责给每个环节和每位发言者计时，被请到时报告姓名和用时。',
            detail: '官方列的 Timer 职责是：会前向 Sergeant at Arms 领取计时和信号设备并学会使用；被请到时说明计时规则、演示信号设备；会中留意每位发言'
                + '者并按时给信号；被请到报告时，念出发言者的姓名和用时；会后归还设备。官方说这个角色锻炼的是时间管理能力。',
            src: ['roles'],
        },
        {
            id: 'l1-basecamp',
            level: 1,
            type: 'choice',
            q: '会员在哪个线上平台学习 Pathways 的项目？',
            options: ['Base Camp', 'Club Central', 'Speechcraft', 'Leader Letter'],
            explain: 'Base Camp 是放 Pathways 学习内容的线上系统。',
            detail: '做完一个 Level，在 Base Camp 上提交完成申请，由俱乐部的 Base Camp manager 批准；批准后会自动提交到 Club '
                + 'Central 记入成绩。所有俱乐部干事都有 Base Camp manager 的权限，通常由 VPE 负责审批，VPE 做不了时一般由 '
                + 'President 和 Secretary 顶上。干事不能批准自己的申请。',
            src: ['faq', 'updates'],
        },
        {
            id: 'l1-not-passfail',
            level: 1,
            type: 'choice',
            q: '演讲超时了，没达到项目的全部目标。这个项目还能算完成吗？',
            options: ['能，头马不是“及格 / 不及格”制', '不能，必须重讲一遍', '不能，要先补交一份书面说明'],
            explain: '官方原话：Toastmasters is not a pass/fail program。',
            detail: '官方 FAQ 的回答是可以拿到 credit，但也提醒：你在这个项目里投入多少，就收获多少，对准目标（包括时间目标）去练，学到的才最多。大多数项目至少包含'
                + '一篇要接受评估的演讲。另外，大多数项目要同时拿到口头和书面评估才算完成，具体要仔细看各项目自己的说明。',
            src: ['faq'],
        },
        {
            id: 'l1-one-speech',
            level: 1,
            type: 'choice',
            q: '同一场例会上讲了两篇演讲，可以两篇都算项目 credit 吗？',
            options: ['不可以，一场例会只能有一篇算 credit', '可以，只要两篇都有人评估', '可以，但要 VPE 当场批准'],
            explain: '官方规定：一场例会只能讲一篇、算一篇 credit。',
            detail: '官方 FAQ 原话是 you may present and receive credit for only one speech per meeting'
                + '。在俱乐部以外的场合演讲也可以拿 credit，但要事先得到 VPE 或其他干事的同意。头马的其他活动也算“俱乐部以外”，比如在比赛里演讲、当 '
                + 'Evaluation Contest 的测试演讲者。',
            src: ['faq'],
        },
        {
            id: 'l1-topic-limits',
            level: 1,
            type: 'choice',
            q: '总部对演讲题目有没有禁区，比如政治、宗教？',
            options: ['没有，总部不禁止任何题目；俱乐部可以经会员共识自行限制', '有，政治、宗教和性话题被总部明令禁止', '有，敏感题目要先报 District 审批'],
            explain: '官方明确说，“总部禁止某些话题”这个流传很广的说法不对。',
            detail: '官方 FAQ 原话：Toastmasters International does not prohibit any speech topic, '
                + 'content, or language。同时总部建议会员顾及听众的多样性，在选题、内容和用词上讲究得体和分寸，并且记着四个核心价值：integrity、'
                + 'respect、service、excellence。每个俱乐部有权在会员达成共识后，限制本俱乐部的题目、内容或用语。',
            src: ['faq'],
        },

        /* ── 第 2 关 · Level 2 · 这一级的真实要求（core）＋会议角色 ── */
        {
            id: 'l2-count',
            level: 2,
            type: 'choice',
            core: true,
            q: 'Level 2（Learning Your Style）有几个项目？',
            options: ['3 个，都是必修', '4 个，都是必修', '1 个必修加 2 个选修', '2 个必修加 1 个选修'],
            explain: 'Level 2 是 3 个必修项目，没有选修。',
            detail: 'Level 2 的前两个项目各 path 不同：Presentation Mastery 是 Understanding Your '
                + 'Communication Style 和 Effective Body Language，Dynamic Leadership 是 '
                + 'Understanding Your Leadership Style 和 Understanding Your Communication Style，'
                + 'Engaging Humor 是 Know Your Sense of Humor 和 Connect with Your Audience。第三个项目六条 '
                + 'path 都一样：Introduction to Toastmasters Mentoring。',
            src: ['path'],
        },
        {
            id: 'l2-mentoring',
            level: 2,
            type: 'choice',
            core: true,
            q: '六条主 path 的 Level 2 里，哪个项目是每条 path 都有的？',
            options: [
                'Introduction to Toastmasters Mentoring',
                'Understanding Your Communication Style',
                'Active Listening',
                'Know Your Sense of Humor',
            ],
            explain: '六条 path 的 Level 2 都有 Introduction to Toastmasters Mentoring。',
            detail: '其余三个选项只出现在部分 path 的 Level 2 里：Understanding Your Communication Style 在 '
                + 'Presentation Mastery、Dynamic Leadership、Motivational Strategies、Visionary '
                + 'Communication；Active Listening 在 Motivational Strategies 和 Persuasive Influence'
                + '；Know Your Sense of Humor 在 Engaging Humor。完成 Level 2 之后，可以免费开始 Pathways '
                + 'Mentor Program；做完它再加一整条 path，就成为 Pathways Mentor。',
            src: ['path', 'awards'],
        },
        {
            id: 'l2-roles',
            level: 2,
            type: 'choice',
            core: true,
            q: '现行英文 path 的 Level 2 必做的会议角色里，不包括下面哪一个？',
            options: ['General Evaluator', 'Grammarian', 'Topicsmaster', 'Evaluator'],
            explain: 'Level 2 是 Grammarian、Topicsmaster、Evaluator，再加一个三选一。General Evaluator 到 '
                + 'Level 4 才必做。',
            detail: 'Level 2 的第四个角色是 Toastmaster of the Day（主持人）、Timer（时间官）、Ah-Counter（哼哈官）三选一。这些角'
                + '色要在做 Level 2 的期间完成，Level 1 时当过的不能拿来抵。官方加入角色要求的理由是：会议角色让俱乐部运转起来，也让会员在动手中练技能，而且每一'
                + '级指定的角色和这一级的项目是呼应的。这些要求目前只在英文 path 里，翻译版 path（含简体中文）暂未加入。',
            src: ['faq'],
        },
        {
            id: 'l2-contest',
            level: 2,
            type: 'choice',
            core: true,
            q: '想参加 International Speech Contest，Pathways 上至少要完成到哪里？',
            options: [
                '任意一条 path 的 Level 1 和 Level 2',
                '只要做完 Ice Breaker',
                '一整条 path',
                '没有 Pathways 进度要求',
            ],
            explain: '比赛规则：要拿到任意一条 path 的 Level 1 和 Level 2 完成证书，或者已经是 DTM。',
            detail: '规则把这一条单独列为 International Speech Contest 的额外要求。所有比赛共同的基本要求是：选手是所在 Area、'
                + 'Division、District 里某个俱乐部的付费会员，而且俱乐部状态良好（in good standing）。有一个例外：俱乐部在俱乐部比赛之前成立不满'
                + '一年的，创会会员可以不受 Level 1、2 的限制，但俱乐部必须在 Area 比赛之前正式成立。',
            src: ['rulebook'],
        },
        {
            id: 'l2-tmd',
            level: 2,
            type: 'choice',
            quote: '接下来有请今晚的第一位演讲者，她的演讲题目是《第一次搬家》。',
            q: '这句台词属于哪个角色？',
            options: ['Toastmaster', 'General Evaluator', 'Topicsmaster', 'Timer'],
            explain: 'Toastmaster（主持人，常叫 Toastmaster of the Day）是例会的导演和主人，负责介绍演讲者、衔接各环节。',
            detail: '官方说，会员通常要等到对俱乐部和流程非常熟悉之后，才会被安排当 Toastmaster。职责包括：向 VPE 要会议议程；和 General '
                + 'Evaluator（总评）一起确保每个人都清楚自己的角色；介绍每位演讲者，包括演讲题目、项目名称、目标和时长；让演讲者之间的过渡顺畅。官方说这个角色锻炼的是组'
                + '织、时间管理和公众演讲能力。',
            src: ['roles'],
        },
        {
            id: 'l2-ge',
            level: 2,
            type: 'choice',
            quote: '现在进入评估环节。先请各位评估员，再请 Timer、Ah-Counter 和 Grammarian 做报告。',
            q: '这句台词属于哪个角色？',
            options: ['General Evaluator', 'Toastmaster', 'Topicsmaster', 'Evaluator'],
            explain: 'General Evaluator（总评）评估整场例会，并主持评估环节。',
            detail: 'General Evaluator 评估的是例会上发生的一切。官方把演讲评估员、Ah-Counter、Grammarian、Timer 称为它负责的“评估'
                + '团队”。职责包括：确认各位评估员清楚自己的任务；向大家说明评估的目的和好处；和 Toastmaster 核对会议流程；会中做笔记，就守时、热情、准备、组织、各'
                + '角色履职等方面给整场例会做反馈。',
            src: ['roles'],
        },
        {
            id: 'l2-topicsmaster',
            level: 2,
            type: 'choice',
            quote: '今晚还没机会上台的朋友，我先请你：如果明天突然放假，你会去哪儿？',
            q: '这句台词属于哪个角色？',
            options: ['Topicsmaster', 'Toastmaster', 'Grammarian', 'Evaluator'],
            explain: 'Topicsmaster（即兴主持人）主持 Table Topics 环节，把机会给当晚没有发言角色的会员。',
            detail: 'Topicsmaster 负责 Table Topics 环节，训练会员在即兴场合快速组织和表达想法。官方列的做法：会前准备好能让人发表看法的题目；把机会'
                + '给当晚没有安排发言角色的会员；不要问两个人同一个问题，除非特意要引出相反的观点；如果俱乐部评“最佳 Table Topics”，请大家投票。',
            src: ['roles'],
        },
        {
            id: 'l2-grammarian',
            level: 2,
            type: 'choice',
            quote: '今天的 Word of the Day 是 resilient。我会记下谁在发言里用上了它。',
            q: '这句台词属于哪个角色？',
            options: ['Grammarian', 'Ah-Counter', 'Topicsmaster', 'General Evaluator'],
            explain: 'Grammarian（语法官）介绍新词，并留意大家的语法和用词。',
            detail: 'Grammarian 帮所有会员改进语法和词汇：留意大家的语言使用，记下不完整的句子、读错的音、语法错误等，在会议结束前被请到时做完整报告。介绍一个新词是'
                + '可选的做法（官方页面叫 Word of the Week，配套资料里也叫 Word of the Day）：展示这个词、词性和简短释义，准备一个例句，并记下会'
                + '上谁用对了、谁用错了。',
            src: ['roles'],
        },
        {
            id: 'l2-eval-before',
            level: 2,
            type: 'choice',
            q: '演讲开始前，官方建议评估员先做什么？',
            options: ['问演讲者这次要讲什么、想达到什么目标', '先把演讲稿要来改一遍', '提前想好要挑的三个毛病', '请计时员提前亮红灯'],
            explain: '先了解演讲者的目标，评估才能对准对方最想进步的地方。',
            detail: '官方说，评估是头马教育体系的核心：你观察会员的演讲和领导角色并给出评估，别人也这样对你。Evaluator（点评员）的三件事：先问被评估的人这次要讲什么、'
                + '想达到什么；给出客观的口头和书面评估；任何评估都要既有肯定，也有建设性的批评。演讲者这边也有对应的职责：演讲前和评估员聊聊自己的目标、长处和短处。',
            src: ['roles'],
        },
        {
            id: 'l2-eval-balance',
            level: 2,
            type: 'choice',
            q: '按官方要求，一次评估应该怎么给反馈？',
            options: ['既有肯定，也有建设性的改进建议', '只讲优点，免得打击信心', '只讲问题，节省时间', '把演讲内容复述一遍'],
            explain: '官方说法是 offer praise as well as constructive criticism。',
            detail: '评估员要给的是客观的口头评估加书面评估，两样都要。官方 FAQ 也写明：所有评估都应当既口头又书面，而且最好趁热在现场给。现场评估不只帮到演讲者：评估员练'
                + '的是听一遍不能暂停的演讲、快速分析并组织反馈，其他会员也能从听评估里学到东西。所以官方要求演讲者和评估员都在场（线下、线上都算），不赞成把演讲录下来事后再评。',
            src: ['roles', 'faq'],
        },
        {
            id: 'l2-ge-team',
            level: 2,
            type: 'choice',
            q: 'General Evaluator（总评）带领的评估团队有哪些人？',
            options: [
                '演讲评估员、Ah-Counter、Grammarian、Timer',
                'President、VPE、Secretary',
                'Topicsmaster 和所有 Table Topics 发言者',
                'Toastmaster 和 Sergeant at Arms',
            ],
            explain: '官方说明里，General Evaluator（总评）负责的评估团队就是这四类角色。',
            detail: '评估团队是：各位演讲评估员、Ah-Counter（哼哈官）、Grammarian（语法官）、Timer（时间官）。总评会前要和 Timer、'
                + 'Grammarian、Ah-Counter 确认各自的任务，并确保评估员们清楚职责。Topicsmaster 和 Toastmaster 不在这个团队里：前者'
                + '主持 Table Topics，后者是整场例会的主持人。',
            src: ['roles'],
        },
        {
            id: 'l2-agenda-from',
            level: 2,
            type: 'choice',
            q: '当 Toastmaster（主持人）之前，会议议程应该找哪位干事拿？',
            options: [
                'Vice President Education (VPE)',
                'Treasurer',
                'Vice President Public Relations (VPPR)',
                'Sergeant at Arms',
            ],
            explain: '官方角色说明的第一条就是向 VPE 要会议议程。',
            detail: 'VPE 负责排例会角色、带新会员入门、分配导师，通常也是俱乐部主要的 Base Camp manager，所以 Toastmaster（主持人）拿议程要找'
                + ' VPE。拿到议程后，Toastmaster 还要和 General Evaluator（总评）一起，确认每位参与者都清楚自己的角色和职责。',
            src: ['roles', 'officers'],
        },

        /* ── 第 3 关 · Level 3 · 这一级的真实要求（core）＋计时亮灯（全部按比赛规则） ── */
        {
            id: 'l3-electives',
            level: 3,
            type: 'choice',
            core: true,
            q: 'Level 3（Increasing Knowledge）除了 1 个必修项目，还要自选几个选修项目？',
            options: ['2 个', '1 个', '3 个', '不用选'],
            explain: 'Level 3 是 1 个必修加 2 个自选，选修从这一级开始出现。',
            detail: 'Level 3 的必修项目各 path 不同，比如 Presentation Mastery 是 Persuasive Speaking，Dynamic '
                + 'Leadership 是 Negotiate the Best Outcome。选修从一份十几个项目的清单里挑，例如 Connect with '
                + 'Storytelling、Creating Effective Visual Aids、Using Presentation Software、'
                + 'Researching and Presenting。官方只要求选 2 个，想多做也可以。完成 Level 3 之后，可以申请让总部给你的雇主寄一封成就信。',
            src: ['path', 'faq', 'awards'],
        },
        {
            id: 'l3-series',
            level: 3,
            type: 'choice',
            core: true,
            q: '现行英文 path 的 Level 3，除了项目和会议角色，还要给俱乐部做一次什么？',
            options: [
                'Successful Club Series 里的一个专题分享',
                '一期 Speechcraft 课程',
                '一次 District 干事培训',
                '一场 Humorous Speech Contest',
            ],
            explain: 'Level 3 到 5 都要做 Education Series 的分享，Level 3 是一次 Successful Club Series。',
            detail: 'Education Series 有三个系列：Successful Club Series 讲怎样办好一个有活力的俱乐部，Better Speaker '
                + 'Series 给演讲准备和表达的实用建议，Leadership Excellence Series 帮俱乐部培养懂行、有效的领导者。Level 3 可选的 '
                + 'Successful Club Series 题目是 Creating the Best Club Climate、Meeting Roles and '
                + 'Responsibilities、Keeping the Commitment、Going Beyond our Club。Level 4 要做 '
                + 'Successful Club Series 和 Better Speaker Series 各一次，Level 5 是 Successful Club '
                + 'Series 和 Leadership Excellence Series 各一次。这些要求目前只在英文 path 里，翻译版 path（含简体中文）暂未加入'
                + '。',
            src: ['faq', 'updates'],
        },
        {
            id: 'l3-roles',
            level: 3,
            type: 'choice',
            core: true,
            q: '现行英文 path 的 Level 3，下面哪个会议角色是指定必做的？',
            options: ['Toastmaster of the Day', 'General Evaluator', 'Grammarian', 'Timer'],
            explain: 'Level 3 指定 Toastmaster of the Day 和 Evaluator，另外再从三个角色里选一个。',
            detail: '第三个角色是 Table Topics Speaker、Topicsmaster（即兴主持人）、Introductory Mentor 三选一。'
                + 'Introductory Mentor 是官方说的非正式角色：以导师的方式支持俱乐部里的其他人，比如带新会员、回答关于你做过的会议角色的问题。在 Level '
                + '2，Toastmaster of the Day 还只是三选一里的一个选项，到 Level 3 成了指定角色。这些要求目前只在英文 path 里，翻译版 '
                + 'path（含简体中文）暂未加入。',
            src: ['faq'],
        },
        {
            id: 'l3-light-intl-green',
            level: 3,
            type: 'light',
            contest: 'International Speech Contest，演讲 5–7 分钟',
            clock: '5:30',
            answer: 'green',
            explain: '绿灯 5:00 亮，黄灯 6:00，红灯 7:00。5:30 还在绿灯段。',
            detail: 'International、Humorous、Online 三种比赛的演讲都是 5 到 7 分钟，亮灯时间相同：绿灯 5:00 亮起并保持一分钟，黄灯 '
                + '6:00 亮起并保持一分钟，红灯 7:00 亮起，一直亮到演讲结束。信号要让选手看得清，但不能让观众觉得显眼。超时阶段不会再给任何信号，所以红灯亮了之后的 '
                + '30 秒要自己把握。',
            src: ['rulebook'],
        },
        {
            id: 'l3-light-intl-yellow',
            level: 3,
            type: 'light',
            contest: 'International Speech Contest，演讲 5–7 分钟',
            clock: '6:20',
            answer: 'yellow',
            explain: '6:00 换黄灯，亮满一分钟，7:00 再换红灯。',
            detail: '黄灯亮起，说明规定时长只剩最后一分钟。按规则，比赛由 chief judge 指定两位计时员：一位拿秒表，记录每篇演讲的用时，这份记录就是正式时间；另一位'
                + '操作绿、黄、红三色的信号设备。信号设备必须放在每位选手都能完整看到的位置。',
            src: ['rulebook'],
        },
        {
            id: 'l3-light-intl-red',
            level: 3,
            type: 'light',
            contest: 'International Speech Contest，演讲 5–7 分钟',
            clock: '7:10',
            answer: 'red',
            explain: '7:00 起亮红灯，一直亮到演讲结束。超过 7 分 30 秒会被取消资格。',
            detail: '红灯亮起说明 7 分钟已到，但在 7 分 30 秒之前结束都不会被取消资格：规则写的是不满 4 分 30 秒或超过 7 分 30 秒才取消。计时不算秒以下'
                + '的零头，到 7 分 31 秒才算超时。如果信号或计时设备出了技术故障，选手可以多得到 30 秒的超时宽限。宣布结果之前，contest chair 会宣布有几'
                + '位选手因时间被取消资格，但不点名。',
            src: ['rulebook'],
        },
        {
            id: 'l3-light-tt-yellow',
            level: 3,
            type: 'light',
            contest: 'Table Topics Contest，发言 1–2 分钟',
            clock: '1:40',
            answer: 'yellow',
            explain: 'Table Topics 比赛：绿灯 1:00，黄灯 1:30，红灯 2:00。',
            detail: 'Table Topics Contest 的发言是 1 到 2 分钟：绿灯 1:00，黄灯 1:30，红灯 2:00，绿灯和黄灯各保持 30 秒，红灯一直'
                + '亮到发言结束。不满 1 分钟或超过 2 分 30 秒会被取消资格，也就是下限没有宽限。比赛里所有选手拿到的是同一个题目，前面的选手讲的时候，后面的选手要在场外'
                + '等。',
            src: ['rulebook'],
        },
        {
            id: 'l3-light-tt-none',
            level: 3,
            type: 'light',
            contest: 'Table Topics Contest，发言 1–2 分钟',
            clock: '0:45',
            answer: 'none',
            explain: '绿灯要到 1:00 才亮。不满 1 分钟就结束，会被取消资格。',
            detail: '比赛的三个信号都从“规定时长的下限”才开始：Table Topics 是 1:00，Evaluation 是 2:00，Tall Tales 是 3:00'
                + '，International、Humorous、Online 是 5:00。在那之前计时员什么都不亮。Table Topics 的发言不满 1 分钟就会被取消'
                + '资格，所以没等到绿灯就结束是有风险的。',
            src: ['rulebook'],
        },
        {
            id: 'l3-dq-over',
            level: 3,
            type: 'choice',
            q: 'International Speech Contest 的演讲是 5–7 分钟。讲到多久算超时、取消资格？',
            options: ['超过 7 分 30 秒', '超过 7 分钟', '超过 8 分钟', '超时不取消资格，只扣分'],
            explain: '不满 4 分 30 秒，或者超过 7 分 30 秒，都会被取消资格。',
            detail: '5 到 7 分钟的比赛演讲（International、Humorous、Online）界限是 4 分 30 秒和 7 分 30 秒。其他比赛也是规定时长'
                + '上下各留 30 秒：Evaluation 是 2 到 3 分钟，界限 1 分 30 秒和 3 分 30 秒；Tall Tales 是 3 到 5 分钟，界限 '
                + '2 分 30 秒和 5 分 30 秒。只有 Table Topics 例外，下限就是 1 分钟，没有宽限。计时员不计秒以下的零头。',
            src: ['rulebook'],
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
            detail: 'Table Topics Contest 规定发言 1 到 2 分钟，不满 1 分钟或超过 2 分 30 秒取消资格。官方杂志给俱乐部例会的常见参考也是同'
                + '一组数字，并说明除了 Table Topics，其他发言在规定时间上下各有 30 秒宽限。亮灯是绿灯 1:00、黄灯 1:30、红灯 2:00。',
            src: ['rulebook', 'time'],
        },
        {
            id: 'l3-eval-prep',
            level: 3,
            type: 'choice',
            q: 'Evaluation Contest 里，听完测试演讲后选手有多久准备评估？',
            options: ['5 分钟', '1 分钟', '10 分钟', '不给准备时间'],
            explain: '所有选手有 5 分钟准备，时间一到就不能再写。评估发言本身是 2–3 分钟。',
            detail: 'Evaluation Contest 开场先有一篇 5 到 7 分钟的测试演讲，所有选手评估的都是它。测试演讲结束后，全体选手离场，用 5 分钟在 '
                + 'Evaluation Contestant Notes 表上准备，由 contest Sergeant at Arms 监督。5 分钟一到，笔记表要交给 '
                + 'Sergeant at Arms，轮到自己上场时再拿回来。评估发言不满 1 分 30 秒或超过 3 分 30 秒会被取消资格。',
            src: ['rulebook'],
        },
        {
            id: 'l3-timing-start',
            level: 3,
            type: 'choice',
            q: '比赛中，计时从哪一刻开始？',
            options: ['选手对观众的第一个明确表达，说话或动作都算', '主持人念出选手名字时', '选手走到讲台站定时', '计时员亮起绿灯时'],
            explain: '计时从选手对观众的第一个明确表达开始，说话、动作、音效都算。',
            detail: '现行规则（2026–2027 版）里，选手被介绍后要先说一句 “Thank you, Contest Chair” 来确认音视频设备正常，contest '
                + 'chair 回答 “You’re welcome”。计时从这之后选手的下一个明确的语言或非语言表达开始：通常是说出的第一个词，但也包括音效、请别人做的一段表演'
                + '等。选手到达演讲位置后应当很快开始，不能无故拖延比赛。',
            src: ['rulebook'],
        },

        /* ── 第 4 关 · Level 4 · 这一级的真实要求（core）＋俱乐部与干事 ── */
        {
            id: 'l4-electives',
            level: 4,
            type: 'choice',
            core: true,
            q: 'Level 4（Building Skills）的项目是怎么构成的？',
            options: ['1 个必修加 1 个自选', '1 个必修加 2 个自选', '3 个必修，没有选修', '2 个自选，没有必修'],
            explain: 'Level 4 是 1 个必修项目加 1 个自选项目。',
            detail: 'Level 4 的必修项目各 path 不同，比如 Presentation Mastery 是 Managing a Difficult '
                + 'Audience，Dynamic Leadership 是 Manage Change。选修清单里有 Create a Podcast、Write a '
                + 'Compelling Blog、Manage Online Meetings、Question-and-Answer Session、Public '
                + 'Relations Strategies 等。完成 Level 4 可以计入俱乐部 DCP 的教育目标第 5、6 项，和 path 完成、DTM 是同一类。',
            src: ['path', 'dcp'],
        },
        {
            id: 'l4-ge',
            level: 4,
            type: 'choice',
            core: true,
            q: '现行英文 path 里，General Evaluator（总评）从哪个 Level 开始成为必做角色？',
            options: ['Level 4', 'Level 1', 'Level 2', 'Level 3'],
            explain: 'Level 4 要当 Toastmaster of the Day、General Evaluator、Evaluator 各一次，再加一个自选角色。',
            detail: 'Level 4 的自选角色可以是 Table Topics Speaker、Topicsmaster，或者你们俱乐部特有的非正式角色。到 Level 5，'
                + 'General Evaluator、Toastmaster of the Day、Evaluator 都要各做两次。General Evaluator（总评）'
                + '评估的是整场例会，并负责由演讲评估员、Ah-Counter、Grammarian、Timer 组成的评估团队。这些要求目前只在英文 path 里，翻译版 '
                + 'path（含简体中文）暂未加入。',
            src: ['faq', 'roles'],
        },
        {
            id: 'l4-series',
            level: 4,
            type: 'choice',
            core: true,
            q: '现行英文 path 的 Level 4 要做两次 Education Series 分享，分别来自哪两个系列？',
            options: [
                'Successful Club Series 和 Better Speaker Series',
                'Successful Club Series 和 Leadership Excellence Series',
                'Better Speaker Series 和 Leadership Excellence Series',
                '三个系列各一次',
            ],
            explain: 'Level 4：Successful Club Series 一次，Better Speaker Series 一次。',
            detail: 'Level 4 可选的 Successful Club Series 题目是 Finding New Members、Closing the Sale、'
                + 'How to Be a Distinguished Club、Toastmasters Educational Program；Better Speaker '
                + 'Series 任选一个。Level 3 只要一次 Successful Club Series；Level 5 是 Successful Club '
                + 'Series（Moments of Truth、Evaluate to Motivate、Mentoring 三选一）加一次 Leadership '
                + 'Excellence Series。官方说，做这些分享让会员练习把现成的讲稿讲成自己的，听的人也能更了解俱乐部。这些要求目前只在英文 path 里，翻译版 '
                + 'path（含简体中文）暂未加入。',
            src: ['faq'],
        },
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
            explain: 'VPE 通常是俱乐部的主要 Base Camp manager。',
            detail: 'Base Camp manager 是负责确认项目和 Level 完成情况、在 Base Camp 上支持会员的俱乐部干事，核心职责是核实 Level 完'
                + '成、核实 path 完成、跟踪会员进度。所有干事都能进入 Base Camp manager 面板，但通常由 VPE 负责批准完成申请；VPE 做不了时，一般'
                + '由 President 和 Secretary 顶上，所以待审批的邮件会发给这三位。',
            src: ['faq'],
        },
        {
            id: 'l4-self-approve',
            level: 4,
            type: 'choice',
            q: 'VPE 自己完成了一个 Level，可以在 Base Camp 上给自己批准吗？',
            options: ['不可以，要请另一位干事批准', '可以，VPE 有这个权限', '可以，但要先口头告知 President'],
            explain: '官方规定干事不能批准自己的完成申请，要由俱乐部里另一位干事来批。',
            detail: '官方 FAQ 写明：你不能批准自己的申请，要确保由俱乐部里另一位干事来批。如果你不是 VPE，批准别人的申请之前，先和其他干事沟通好由谁负责、什么时候需要'
                + '你帮忙。申请一旦被批准，这个 Level 或 path 的完成会自动提交到 Club Central。',
            src: ['faq'],
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
            explain: 'Area Director 是 District 层面的职位。俱乐部的七个干事是 President、VPE、VPM、VPPR、Secretary、'
                + 'Treasurer、Sergeant at Arms。',
            detail: 'DCP 手册在干事培训目标里列出的俱乐部干事是七个：Club President、Vice President Education、Vice '
                + 'President Membership、Vice President Public Relations、Club Secretary、Club '
                + 'Treasurer、Sergeant at Arms。比赛规则手册列出的 District 干事则有 District Director、Program '
                + 'Quality Director、Club Growth Director、Administration Manager、Finance Manager、'
                + 'Public Relations Manager、Division Director、Area Director。另外，Immediate Past '
                + 'President 由现任 President 任命，负责主持提名委员会，并给 President 提供建议。',
            src: ['dcp', 'rulebook', 'officers'],
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
            detail: '官方杂志对几位干事的概括：VPM 通过解答来宾的问题、策划吸引访客的活动来发展会员，尽责的 VPM 会很快跟进来宾。VPE 排例会角色、带新会员入门、分配'
                + '导师。Secretary 管记录，包括出勤、干事名单和会议纪要。Treasurer 管财务：收会费、付账单、跟踪财务状况。这篇文章是 2019 年的，分工的最'
                + '新表述以官网的干事资料为准。',
            src: ['officers'],
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
            detail: 'VPPR 管理俱乐部的形象，通过内部和外部的传播来推广俱乐部，手段包括新闻稿、宣传活动、网站内容和社交媒体。相对地，VPM 负责解答来宾问题、跟进潜在会员'
                + '。Sergeant at Arms 负责会务后勤和场地的布置、收拾，比如摆好计时灯、俱乐部旗帜、指示牌和评估表。',
            src: ['officers'],
        },
        {
            id: 'l4-dcp-goals',
            level: 4,
            type: 'choice',
            q: '衡量俱乐部质量的 Distinguished Club Program (DCP) 一共有几个目标？',
            options: ['10 个', '5 个', '7 个', '12 个'],
            explain: '10 个目标分四类：教育 6 个、会员 2 个、干事培训 1 个、行政 1 个。',
            detail: 'DCP 是一年一度的俱乐部认可项目，从 7 月 1 日到次年 6 月 30 日。教育 6 个目标：4 个 Level 1；2 个 Level 2；再 2 '
                + '个 Level 2；2 个 Level 3；1 个 Level 4、path 完成或 DTM；再 1 个。会员 2 个目标：4 名新会员；再 4 名。干事培训'
                + ' 1 个：两次培训各有至少 4 个干事岗位参加。行政 1 个：按时交会费和干事名单。参评还有三个前提：俱乐部状态良好；年底有 20 名会员或净增至少 3 人；'
                + '9 月 30 日前提交 Club Success Plan。',
            src: ['dcp'],
        },
        {
            id: 'l4-dcp-top',
            level: 4,
            type: 'choice',
            q: 'DCP 的四档认可里，最高的一档叫什么？',
            options: [
                'Smedley Distinguished',
                'President’s Distinguished',
                'Select Distinguished',
                'Distinguished',
            ],
            explain: '四档从低到高：Distinguished、Select Distinguished、President’s Distinguished、Smedley '
                + 'Distinguished。',
            detail: '四档对应的目标数是 5、7、9、10 个。会员数的前提也逐档提高：Distinguished 要 20 名会员或净增 3 人，Select '
                + 'Distinguished 要 20 名或净增 5 人，President’s Distinguished 要 20 名，Smedley '
                + 'Distinguished 要 25 名。Smedley 这一档是 Board 从 2025–2026 年度起加进 DCP 的，在那之前最高是 '
                + 'President’s Distinguished。',
            src: ['dcp', 'recog'],
        },
        {
            id: 'l4-coach',
            level: 4,
            type: 'choice',
            q: '俱乐部会员数落在什么范围，才符合申请 club coach 的条件？',
            options: ['3 到 12 人', '13 到 19 人', '20 人以上', '没有人数限制'],
            explain: 'club coach 是去帮人数偏少的俱乐部重建的，条件之一是会员 3 到 12 人。',
            detail: '符合条件的俱乐部：会员 3 到 12 人，没有被暂停或关闭，至少一位干事完成了 Base Camp 里的 Club Coach Program '
                + 'Training，并且在任教练不超过两位。教练在任命前六个月内不能是这个俱乐部的会员，任期内也不能加入。教练要服务满六个月、并帮俱乐部评上 '
                + 'Distinguished 或更高，才拿到 credit；这也是 DTM “担任 club mentor 或 coach” 那一项的途径之一。',
            src: ['coach', 'dtm'],
        },

        /* ── 第 5 关 · Level 5 · 这一级的真实要求（core）＋Pathways 全景 ── */
        {
            id: 'l5-last-project',
            level: 5,
            type: 'choice',
            core: true,
            q: '一条 path 的最后一个项目是什么？',
            options: [
                'Reflect on Your Path',
                'Ice Breaker',
                'High Performance Leadership',
                'DTM project',
            ],
            explain: '五个 Level 都获批后，做最后一个项目 Reflect on Your Path，再提交 path 完成申请。',
            detail: '官网把 Reflect on Your Path 列在 Level 5 的项目里，但 FAQ 说明它要等 Level 1 到 5 都被 Base '
                + 'Camp manager 批准之后才做。做完后提交 Path Completion Approval 申请，批准后这条 path 就完成了，成绩会记入 '
                + 'Club Central。完成整条 path 会得到一枚数字徽章，和一张可以下载打印的 certificate of proficiency。',
            src: ['faq', 'path'],
        },
        {
            id: 'l5-electives',
            level: 5,
            type: 'choice',
            core: true,
            q: 'Level 5（Demonstrating Expertise）要自选几个选修项目？',
            options: ['1 个', '2 个', '3 个', '不用选'],
            explain: 'Level 5 是 1 个必修加 1 个自选，最后还有 Reflect on Your Path。',
            detail: 'Level 5 的必修项目各 path 不同，比如 Presentation Mastery 是 Prepare to Speak '
                + 'Professionally，Dynamic Leadership 是 Lead in Any Situation。选修清单包括 Ethical '
                + 'Leadership、High Performance Leadership、Leading in Your Volunteer Organization、'
                + 'Lessons Learned、Moderate a Panel Discussion 等。整条 path 的选修一共 4 个：Level 3 两个，'
                + 'Level 4 和 Level 5 各一个。',
            src: ['path', 'faq'],
        },
        {
            id: 'l5-roles-twice',
            level: 5,
            type: 'choice',
            core: true,
            q: '现行英文 path 的 Level 5 里，Toastmaster of the Day、General Evaluator、Evaluator 这三个角色各要做几'
                + '次？',
            options: ['各 2 次', '各 1 次', '各 3 次', '三个里任选一个做 1 次'],
            explain: 'Level 5 这三个角色都要各做两次，另外再加一个自选角色。',
            detail: 'Level 5 的自选角色范围最宽：Table Topics Speaker、Topicsmaster、Ah-Counter、Timer、'
                + 'Grammarian、Club Mentor，或者你们俱乐部特有的非正式角色。此外还要做两次 Education Series 分享：一次 '
                + 'Successful Club Series，一次 Leadership Excellence Series。官方承认这些要求让有的 Level 多出一到两次'
                + '上台，但认为多数角色可以穿插在项目之间完成。这些要求目前只在英文 path 里，翻译版 path（含简体中文）暂未加入。',
            src: ['faq'],
        },
        {
            id: 'l5-projects-count',
            level: 5,
            type: 'choice',
            core: true,
            q: '完成一条 path，一共要做多少个项目？',
            options: ['15 个', '10 个', '12 个', '20 个'],
            explain: '五个 Level 合计 15 个项目：11 个必修加 4 个选修。',
            detail: '官方 FAQ：完成 15 个项目就完成一条 path，其中 11 个必修、4 个选修，选修想多做可以多做。按 Level 拆开是：Level 1 四个必修'
                + '，Level 2 三个必修，Level 3 一个必修加两个选修，Level 4 和 Level 5 各一个必修加一个选修，最后是 Reflect on '
                + 'Your Path。大多数项目至少包含一篇要接受评估的演讲。',
            src: ['faq', 'path'],
        },
        {
            id: 'l5-proficient',
            level: 5,
            type: 'choice',
            core: true,
            q: '完成一整条 path 后，你会得到哪个称号？',
            options: [
                'Proficient，比如 Presentation Mastery Proficient',
                'Distinguished Toastmaster',
                'Pathways Mentor',
                'World Champion of Public Speaking',
            ],
            explain: '每完成一条 path 得到一个 Proficient 称号。',
            detail: '官方的例子是：完成 Motivational Strategies 这条 path，就成为 Motivational Strategies '
                + 'Proficient。每完成一个 Level 会拿到一枚数字徽章和一张证书；完成一条 path 或一个 exploration，会收到 '
                + 'International President 的祝贺邮件。Pathways Mentor 是另一个称号，要完成 Pathways Mentor '
                + 'Program 加一整条 path。DTM 则需要两条不同的 path，外加一系列领导力要求。',
            src: ['awards', 'faq'],
        },
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
            explain: 'Level 3 是 Increasing Knowledge。',
            detail: '五个 Level 的名称依次是：Level 1 Mastering Fundamentals、Level 2 Learning Your Style、'
                + 'Level 3 Increasing Knowledge、Level 4 Building Skills、Level 5 Demonstrating '
                + 'Expertise。六条主 path 用的是同一套名称。官方说项目的难度随 Level 递增，各 Level 是按顺序完成来设计的。',
            src: ['path', 'faq'],
        },
        {
            id: 'l5-paths-count',
            level: 5,
            type: 'choice',
            q: '不算 vintage path，现在可以选的 Pathways path 有几条？',
            options: ['6 条', '11 条', '5 条', '8 条'],
            explain: '六条：Dynamic Leadership、Engaging Humor、Motivational Strategies、Persuasive '
                + 'Influence、Presentation Mastery、Visionary Communication。',
            detail: 'Pathways 原来有 11 条 path。2024 年 10 月新版 Base Camp 上线时，官方把可选的 path 调整为 6 条，理由之一是很'
                + '多会员反映选项太多、刚入门时不知道怎么选。另外 5 条成为 legacy path，不再出售，之前买了的会员仍可完成并拿到 credit。2026 年又新增了'
                + '两条 vintage path，内容是头马早年的经典教材。每位会员的第一条 path 是免费的。',
            src: ['faq', 'updates'],
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
            explain: 'Leadership Development 属于 legacy path，已经不再出售，之前买了的会员仍然可以完成。',
            detail: 'legacy path 一共五条：Effective Coaching、Innovative Planning、Leadership '
                + 'Development、Strategic Relationships、Team Collaboration。它们从 2024 年 10 月 23 日起不再出'
                + '售，之前购买的会员可以继续完成并拿到 credit。legacy path 没有收到之后的更新，所以 2025 年 10 月加入的会议角色和 '
                + 'Education Series 要求对它们不适用。',
            src: ['faq'],
        },
        {
            id: 'l5-credential',
            level: 5,
            type: 'choice',
            q: 'Pat 完成了 Motivational Strategies 的 Level 1。名册上 Pat 的名字后面会显示什么？',
            options: ['MS1', 'L1', 'CC', 'DTM'],
            explain: 'Pathways 的缩写是“path 缩写加 Level 数字”，Motivational Strategies 的 Level 1 就是 MS1。',
            detail: '官方 FAQ 的例子：完成 Motivational Strategies 的 Level 1 显示 MS1，完成整条 path 显示 MS5；之后开始 '
                + 'Team Collaboration 并完成 Level 1，就变成 TC1。名字后面只显示最近拿到的那一个 Pathways 奖项。拿到 DTM 之后，不管'
                + '以后再完成什么，都一直显示 DTM。CC（Competent Communication）是 Pathways 之前的旧教育体系里的奖项，官方表示这些成就会一'
                + '直被承认。',
            src: ['faq'],
        },
        {
            id: 'l5-level-order',
            level: 5,
            type: 'choice',
            q: '能不能先做完 Level 2 的项目，再回头补 Level 1？',
            options: ['项目先后可以自己定，但 Level 完成申请必须按顺序提交', '不能，项目必须严格按顺序做', '能，而且可以先拿 Level 2 的证书'],
            explain: '项目顺序可以自己选，但前面的 Level 没完成，后面的 Level 就交不了完成申请。',
            detail: '官方说，项目的难度随 Level 递增，各 Level 是按顺序完成来设计的，例如 Level 4 学组织一个小活动，Level 5 再去策划更大的活动。'
                + '如果你觉得合适，可以按自己的顺序做项目。但 Level 完成申请要按先后提交：做完了 Level 2 的全部项目，也得先完成 Level 1 才能提交 '
                + 'Level 2；要拿 Level 3 的认可，必须先完成 Level 1 和 2，依此类推。',
            src: ['faq'],
        },
        {
            id: 'l5-founder',
            level: 5,
            type: 'choice',
            q: '第一个长期办下来的 Toastmasters 俱乐部，是谁在哪里创办的？',
            options: [
                'Ralph C. Smedley，在美国加州 Santa Ana 的 YMCA',
                'Ralph C. Smedley，在英国 Southport',
                'Ralph C. Smedley，在加拿大 British Columbia',
                'Dale Carnegie，在美国纽约',
            ],
            explain: '1924 年 10 月 22 日，Ralph C. Smedley 在加州 Santa Ana 的 YMCA 地下室召集了第一次会。',
            detail: 'Smedley 早在 1905 年 3 月 24 日就办过第一次非正式的 Toastmasters 聚会，当时他在 Illinois 州 '
                + 'Bloomington 的 YMCA 工作；但他每次调动工作，那些俱乐部就因为没人带而办不下去。Santa Ana 的俱乐部能办下来，是因为他一直留在了那里。'
                + '之后组织逐步走向国际：1930 年在加拿大 British Columbia 有了俱乐部，1932 年 Toastmasters International '
                + '注册为非营利组织，1935 年在英国 Southport 成立了大西洋彼岸的第一个俱乐部。',
            src: ['history'],
        },

        /* ── 终极关 · DTM ── */
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
            detail: '要拿到 DTM，官方列了六项：① 完成两条不同的 path；② 任俱乐部干事满一届年任期或两届半年任期，并参与制定 Club Success Plan、参'
                + '加 District 办的干事培训；③ 完整担任一年 District leader；④ 成功担任 club mentor 或 club coach；⑤ 成功'
                + '担任 club sponsor，或组织一期 Speechcraft 或 Youth Leadership；⑥ 完成 DTM project。完整要求以官方的 '
                + 'Distinguished Toastmaster Award Application 为准。',
            src: ['dtm', 'faq'],
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
            detail: '六条主 path 用的是同一套 Level 名称。项目数依次是：Level 1 四个必修，Level 2 三个必修，Level 3 一个必修加两个选修，'
                + 'Level 4 和 Level 5 各一个必修加一个选修，最后用 Reflect on Your Path 收尾，一共 15 个。DTM 的第一项要求，就是把'
                + '这样的五个 Level 走完两遍，而且得是两条不同的 path。',
            src: ['path', 'faq', 'dtm'],
        },
        {
            id: 'dtm-paths',
            level: 6,
            type: 'choice',
            q: '拿 DTM，需要完成几条 path？',
            options: ['两条不同的 path', '一条', '同一条 path 做两遍', '全部六条'],
            explain: '官方原文是 two unique learning paths，必须是两条不同的 path。',
            detail: '官方 FAQ 说，同一条 path 可以再买一次、重做一遍，照样能拿 Level 奖项；但要申请 DTM，必须完成两条不同的 path。另外，DCP 对同'
                + '一位会员、同一个俱乐部，每个年度每种奖项只认一次。两条 path 只是 DTM 六项要求里的第一项，其余五项是干事任职、带俱乐部和 DTM project。',
            src: ['faq', 'dtm'],
        },
        {
            id: 'dtm-only-paths',
            level: 6,
            type: 'choice',
            q: '“做完两条 path 就能拿到 DTM。”这句话对吗？',
            options: ['不对，后面还有五项要求', '对，两条 path 就是全部要求', '对，但两条都要拿满分'],
            explain: '两条 path 只是六项要求里的第一项。',
            detail: '官方列了六项：① 完成两条不同的 path；② 任俱乐部干事满一届年任期或两届半年任期，并参与制定 Club Success Plan、参加 '
                + 'District 办的干事培训；③ 完整担任一年 District leader；④ 成功担任 club mentor 或 club coach；⑤ 成功担任'
                + ' club sponsor，或组织一期 Speechcraft 或 Youth Leadership；⑥ 完成 DTM project。DTM '
                + 'project 在完成一条 path、加上另一条不同 path 的 Level 1 到 3 之后就可以申请开通，不用等两条 path 都做完。',
            src: ['dtm'],
        },
        {
            id: 'dtm-club-officer',
            level: 6,
            type: 'choice',
            q: 'DTM 对俱乐部干事任期的要求是？',
            options: ['任满 12 个月：一届年任期，或两届半年任期', '任满 6 个月就够', '必须连任两年', '必须当过 President'],
            explain: '任满一届年任期或两届半年任期，任期内还要参与两件事。',
            detail: '这一项官方写了三件事：任俱乐部干事满两届半年任期或一届年任期；参与制定 Club Success Plan；参加一次 District 举办的 Club '
                + 'Officer Training。俱乐部干事的年任期是 7 月 1 日到次年 6 月 30 日，半年任期是 7 月 1 日到 12 月 31 日、1 月 1 '
                + '日到 6 月 30 日。官方 DTM 页面写的是 club officer，没有指定必须是哪个岗位。',
            src: ['dtm', 'dcp'],
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
            detail: '官方 FAQ 补充：District 职位必须任满才算。任期从 7 月 1 日到次年 6 月 30 日；9 月 1 日之后才补缺上任的，不计入 '
                + 'District leadership 的认可。所在地没有 District 的会员可以申请例外，但要先报总部审核。具体哪些职位算 District '
                + 'leader，以官方的 DTM Award Application 为准。',
            src: ['faq', 'dtm'],
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
            explain: '官方原文：Serve successfully as a club mentor or coach。',
            detail: 'club coach 的规则官方杂志讲得比较细：去帮会员 3 到 12 人的俱乐部重建，服务满六个月并帮俱乐部评上 Distinguished 或更高才拿'
                + '到 credit；如果俱乐部还达到 20 名会员，教练再多得一个 DTM credit。一次教练任命从六个月到两个年度不等。club mentor 的具体规则'
                + '，这个游戏没有查到总部的原文，这里不展开。',
            src: ['dtm', 'coach'],
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
            explain: '官方原文：Serve successfully as a club sponsor or conduct a Speechcraft or Youth '
                + 'Leadership program。',
            detail: '这一项有三种完成方式：成功担任 club sponsor；组织一期 Speechcraft；组织一期 Youth Leadership。'
                + 'Speechcraft 和 Youth Leadership 在头马官网上是和 Pathways 并列的教育项目。具体怎样才算“成功担任”，以官方的 DTM '
                + 'Award Application 为准。',
            src: ['dtm'],
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
            explain: '完成一条 path，再完成另一条不同 path 的 Level 1、2、3，就可以申请。',
            detail: 'DTM project 要求你自己设计并实施一个项目，用来展示学到的技能和专长。达到开通条件后，要发邮件给总部的教育项目团队申请（邮箱见官方 DTM 页面'
                + '），项目会出现在 Base Camp 上。也就是说，不用等第二条 path 全部做完。',
            src: ['dtm', 'faq'],
        },
    ],
};
