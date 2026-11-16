# toastmasters-quiz（头马闯关）

一句话定位：用闯关的方式学头马知识，从 Level 1 一路答到 DTM，一局 25 题，大约 5 分钟。

非官方学习工具，俱乐部会员自制，与 Toastmasters International 无关。所有规则以
[toastmasters.org](https://www.toastmasters.org) 当前页面为准。

## 当前状态

可玩原型。纯原生 HTML/CSS/JS，没有依赖，没有构建步骤，不联网也能玩。

## 怎么跑

双击 `index.html`，在浏览器里打开就能玩。按手机宽度（390px）设计，电脑上会居中显示成一列。

## 怎么玩

- 六关：Level 1 到 Level 5 各 4 题，DTM 终极关 5 题。每关的题从该关题库里随机抽，每局都不一样。
- 顶上那张牌是血条：开局绿牌，答错一题变黄牌，再错变红牌，红牌时再答错就“铃响下台”。
- 每过一关换回绿牌。一关全对加 100 分；连续答对有连对加分（每题 100 分，连对每多一题加 10 分，
  最多加 50 分）。
- 三种题：选择题（含“听台词猜角色”）、亮灯题（你当比赛计时员）、排序题（给五个 Level 排序）。
- 每题答完都会显示正确答案、一句解释和官方出处链接。
- 结束后出一张可以截图发群的结果卡，下面是这一局的错题回顾。

每关考什么是游戏自己排的（例如 Level 3 考计时亮灯），不代表真实 Level 里的项目内容。
真实的 Level 结构写在每关开始前的介绍里。

## 文件

| 文件 | 作用 |
|---|---|
| `index.html` | 页面骨架 |
| `style.css` | 样式 |
| `game.js` | 游戏逻辑（抽题、计分、换牌、结果卡） |
| `questions.js` | 题库、六关的介绍文字、出处列表 |

## 题库怎么加题

只改 `questions.js`，文件开头有完整的格式说明和三种题型的例子。要点：

1. 在 `questions` 数组里加一个对象。选择题的 `options` 第一个永远写正确答案，游戏会自动打乱。
2. `level` 填 1 到 5（对应 Level 1 到 5）或 6（DTM 终极关），决定这道题出现在哪一关。
3. `src` 填出处，对应文件上方 `sources` 里的名字；没有合适的出处就先在 `sources` 里加一条官网链接。
4. 加完刷新页面多玩几局，确认新题能正常显示。

加题的规矩：先在官网找到原文再出题。查不到官方出处的，不要出题，记到下面的“未核实”清单。

## 题目是怎么核对的

50 道题全部核对于 2026-11-16，每道题的出处见 `questions.js` 里的 `src`。用到的来源：

- Education Programs FAQ（Pathways 的 path 数量、Level 1 更新、2025 年 10 月新增的会议角色要求、
  Base Camp 审批）
- Paths, Levels and Electives 页面（核对了 Presentation Mastery 和 Dynamic Leadership 两条 path）
- Distinguished Toastmaster 页面、Pathways Achievements and Awards 页面（DTM 的六项要求）
- Club Meeting Roles 各角色页面（Toastmaster、General Evaluator、Topicsmaster、Timer、Ah-Counter、
  Grammarian、Evaluator、Table Topics Speaker）
- Speech Contest Rulebook 2026–2027（比赛时长、亮灯时间点、取消资格的界限）
- Distinguished Club Program 手册（2026 年 7 月生效版）
- Our History 页面，以及 Toastmaster 杂志的三篇文章（Ice Breaker 时长、干事分工、club coach）

头马的规则每年都可能调整（比赛规则手册每年 7 月换版，DCP 在 2025–2026 年度刚改过）。
建议每年 7 月新年度开始后，对着官网把题库过一遍。

## 没能核实的知识点（都没有出题）

- **Level 名称和项目名称的官方简体中文译法**。没查到官方中文页面，所以游戏里一律用英文原名；
  每关介绍里的“打好基本功”“认识自己的风格”等只是帮助理解的大意，不是官方译名。
- **中文（翻译版）path 现在是否已经包含 2025 年 10 月的会议角色和 Education Series 要求**。
  官方 FAQ 写的是翻译版“目前未包含”，但没写什么时候更新。相关题目的解释里都注明了“英文 path”。
- **俱乐部例会（非比赛）的亮灯时间点**。官方 Timer 角色页面没有写具体时间点，各俱乐部约定不同。
  所以亮灯题全部按比赛规则手册出，题面写明了是比赛。
- **Level 2 到 Level 5 在其余四条 path 里的具体项目**。只核对了 Presentation Mastery 和
  Dynamic Leadership；“每级几个必修、几个选修”的结构与 FAQ 里“11 个必修加 4 个选修”对得上，
  但 Engaging Humor、Motivational Strategies、Persuasive Influence、Visionary Communication
  没有逐页核对。
- **club mentor 和 club sponsor 的具体定义、任期和人数上限**。只找到 District 网站的说法，
  没找到总部页面，所以只出了“DTM 要求担任 club mentor 或 coach”这类直接引用官方原文的题。
- **哪些职位算 DTM 要求里的 “District leader”**。没查到 DTM Award Application 的原文。
- **干事分工的最新官方表述**。官网的 Club Officer Roles 页面需要登录，没能直接核对；
  VPM、VPPR 两道题依据的是 2019 年 7 月的 Toastmaster 杂志文章，来源偏旧。
- **Education Series 分享的时长**（10 到 15 分钟）。只在 2026 年 5 月的杂志文章里见到，
  FAQ 没写，没有出题。
- **Pathways Mentor Program 的细节**（项目数量、完成条件）。官方页面打不开，只在奖项页面
  见到“完成 Level 2 后可以开始”一句，没有出题。
- **PM1、DL5 这类 Level 完成后的缩写称号，以及 Triple Crown 奖**。官方奖项页面没有提到。
- **总部所在地、会员人数、俱乐部数量、国家数**。官网页面上的数字口径不清楚，没有出题。
- **女性会员何时可以入会**。官方历史页面只写了“1970 年代”，没有具体年份。

## 已核实、还没出成题的素材

想加题可以从这里开始，出处都在 `questions.js` 的 `sources` 里：

- 2025 年 10 月更新后 Level 2 到 5 各自要求的会议角色（Education Programs FAQ）
- DCP 的 10 个目标逐条内容、Club Success Plan 要在 9 月 30 日前提交、年度从 7 月 1 日到
  次年 6 月 30 日、目标 9 要求两次培训各有至少 4 个干事岗位参加（DCP 手册）
- Evaluation Contest 和 Tall Tales Contest 的亮灯时间点、俱乐部比赛至少 5 位评委、
  参加 International Speech Contest 要先完成 Level 1 和 2（比赛规则手册）
- 头马的使命、四个核心价值 Integrity、Respect、Service、Excellence（DCP 手册开头）
- vintage path 和 explorations（Pathways Updates 页面）

## 可以调的地方

- 每关抽几道题：`questions.js` 里每个 level 的 `pick`。
- 某道题每局必出：给这道题加 `must: true`。
- 过关后牌怎么恢复、计分规则：`game.js` 里的 `finishLevel` 和 `settle`。
