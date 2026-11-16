# toastmasters-quiz（头马闯关）

一句话定位：既能测、也能学的头马知识小游戏。闯关模式从 Level 1 一路答到 DTM（一局 25 题，约 5 分钟），
练习模式不扣命、按关卡把题刷完，每道题都有一段完整讲解。

非官方学习工具，俱乐部会员自制，与 Toastmasters International 无关。所有规则以
[toastmasters.org](https://www.toastmasters.org) 当前页面为准。

## 当前状态

可玩原型，第二版。纯原生 HTML/CSS/JS，没有依赖，没有构建步骤，不联网也能玩。
题库 69 道：Level 1 14 道、Level 2 12 道、Level 3 12 道、Level 4 11 道、Level 5 11 道、DTM 9 道。

## 怎么跑

双击 `index.html`，在浏览器里打开就能玩。按手机宽度（390px）设计，电脑上会居中显示成一列。
双击 `review.html` 打开审题页（见下面“审题页”一节）。

## 怎么玩

开始页有两个并排的入口，外加一个“只练错题”：

- **闯关**：六关，Level 1 到 Level 5 各 4 题，DTM 终极关 5 题。顶上那张牌是血条：开局绿牌，
  答错一题变黄牌，再错变红牌，红牌时再答错就“铃响下台”；每过一关换回绿牌。每题 100 分，
  连对每多一题加 10 分（最多加 50），一关全对加 100。结束后出一张可以截图发群的结果卡。
- **练习**：不扣命、不计分。挑一关，把这一关题库里的题全部过一遍，讲解一直是展开的。
- **只练错题**：闯关或练习里答错的题会记在这台设备上（浏览器的 localStorage）。在练习或
  “只练错题”里答对一道，就从错题本划掉一道。没有错题时按钮是灰的。

三种模式共用的东西：

- **知识卡**：每关开头先有一张“这一级要做什么”，讲真实 Pathways 里这一级的要求，然后才考。
  闯关时每关至少抽 2 道直接考这张卡的题。
- **讲解**：每题答完显示正确答案、一两句摘要、一段“展开讲讲”和官方出处链接。闯关里答错时
  讲解自动展开，答对时折叠、可以点开；练习里一直展开。
- **错题回顾**：结果页和练习小结都会列出这一轮答错的题，带完整讲解，可以当复习材料。
- **这题有问题**：每道题下面都有这个按钮，点了把题号和题干复制到剪贴板，发给俱乐部管理员即可；
  复制不了时会显示题号让人手抄。不连任何后台。
- **题型**：选择题（含“听台词猜角色”）、亮灯题（你当比赛计时员）、排序题（给五个 Level 排序）。

每关除了考这一级的真实要求，还会考一个游戏自己排的主题（例如 Level 3 考计时亮灯），
这些主题不代表真实 Level 里的项目内容，开始页上有说明。

角色英文名后面括号里的中文，例如 Timer（时间官）、Ah-Counter（哼哈官），是国内俱乐部的常见叫法，
不是官方译名。

## 文件

| 文件 | 作用 |
|---|---|
| `index.html` | 游戏页面骨架 |
| `style.css` | 游戏样式 |
| `game.js` | 游戏逻辑（三种模式、抽题、计分、换牌、错题本、结果卡） |
| `questions.js` | 题库、六关的知识卡、角色中文叫法、出处列表。唯一需要维护的内容文件 |
| `review.html` | 审题页 |
| `review.js` | 审题页的逻辑，内容全部现读 `questions.js` |

## 审题页

`review.html` 把题库按关卡全部列出来：每关的知识卡，每道题的题号、题干、正确答案、错误选项、
摘要、展开讲解和出处链接（网址印成了文字）。它是给熟悉头马的会员逐条审题用的，适合打印，
页面上有“打印这一页”按钮。内容直接读自 `questions.js`，题库一改它就跟着变，不用另外维护。
游戏开始页没有链接到它，需要时直接打开这个文件（线上版在试玩链接后面加 `review.html`）。

## 题库怎么加题

只改 `questions.js`，文件开头有完整的格式说明和三种题型的例子。要点：

1. 在 `questions` 数组里加一个对象。选择题的 `options` 第一个永远写正确答案，页面会自动打乱。
2. `level` 填 1 到 5（对应 Level 1 到 5）或 6（DTM 终极关），决定这道题出现在哪一关。
3. `explain` 写一两句摘要；`detail` 写三到五句“展开讲讲”，把题目背后的知识点讲完整。
4. `src` 填出处，是一个列表，对应文件上方 `sources` 里的名字；没有合适的就先在 `sources` 里
   加一条官网链接。
5. 题干只问现行规则，不要写“某年改版后”；年份和新旧差异放进 `detail`。
6. 选项如果正好是一个英文角色名（例如 `'Timer'`），页面会自动显示成“Timer（时间官）”，
   叫法在 `roleNames` 里维护。题干和讲解里想带中文叫法，直接写在文字里。
7. 直接考“这一级真实要做什么”的题加 `core: true`；想让某道题每局必出加 `must: true`。
8. 加完打开 `review.html` 看新题排出来对不对，再玩几局确认显示正常。

加题的规矩：先在官网找到原文再出题，`detail` 里的每一句都要在出处里找得到。查不到官方出处的，
不要出题，记到下面的“未核实”清单。

## 题目是怎么核对的

69 道题和 6 张知识卡全部核对于 2026-11-16。这一轮每个出处都把原文下载下来逐字读过
（网页原文和两份官方 PDF），没有依赖摘要。每道题的出处见 `questions.js` 里的 `src`。用到的来源：

- Education Programs FAQ（path 数量、Level 1 的项目、每级的会议角色和 Education Series 要求、
  Base Camp 审批、credential 缩写、演讲题目有无禁区等）
- Paths, Levels and Electives 页面（六条主 path 的页面都读了）
- Pathways Updates 页面、Pathways Achievements and Awards 页面、Distinguished Toastmaster 页面
- Club Meeting Roles 各角色页面（Toastmaster、General Evaluator、Topicsmaster、Timer、Ah-Counter、
  Grammarian、Evaluator、Table Topics Speaker、Meeting Speaker）
- Speech Contest Rulebook 2026–2027（比赛时长、亮灯时间点、取消资格的界限、参赛资格）
- Distinguished Club Program 手册（2026 年 7 月生效版）
- Our History 页面，以及 Toastmaster 杂志的五篇文章（Ice Breaker、时间管理、DCP 认可更新、
  干事分工、club coach）

头马的规则每年都可能调整（比赛规则手册每年 7 月换版，DCP 在 2025–2026 年度刚改过）。
建议每年 7 月新年度开始后，对着官网把题库过一遍，并请一位资深会员用审题页整体审一次。

## 没能核实的知识点（都没有出题，讲解里也没有写）

- **Level、项目、会议角色的官方简体中文译法**。游戏里一律用英文原名。每关的“打好基本功”
  “认识自己的风格”等只是帮助理解的大意；角色后面括号里的叫法是国内俱乐部的习惯说法，
  各俱乐部可能不同。
- **翻译版 path（含简体中文）什么时候会加入会议角色和 Education Series 要求**。官方 FAQ 写的是
  “目前未包含”，没有给时间。相关题目和知识卡都注明了“英文 path”。
- **俱乐部例会（非比赛）的亮灯时间点**。官方 Timer 角色页面没有写；官方杂志只给了常见的时间范围。
  所以亮灯题全部按比赛规则手册出，题面写明了是比赛。
- **各个项目内部的具体要求**（比如 Evaluation and Feedback 要讲几次、各项目的演讲时长）。
  项目内容在 Base Camp 里，需要登录。Ice Breaker 的 4 到 6 分钟来自官方杂志。
- **club mentor 和 club sponsor 的具体定义、任期和人数上限**。没找到总部页面，
  只引用了 DTM 页面上的原文。
- **哪些职位算 DTM 要求里的 “District leader”**，以及 DTM 各项的细则。
  没读到 Distinguished Toastmaster Award Application 的原文。
- **干事分工的最新官方表述**。官网的 Club Officer Roles 页面需要登录；VPM、VPPR 等干事的题
  依据的是 2019 年 7 月的 Toastmaster 杂志文章，来源偏旧，讲解里写明了这一点。
- **Education Series 每次分享的时长**。2026 年 5 月的一篇杂志文章提到 10 到 15 分钟
  （这篇只看了工具摘要，没读原文），FAQ 没写。
- **vintage path 的购买前提**。同一篇杂志文章的摘要说要先完成 Level 1，FAQ 原文说选过第一条 path
  就可以，两处说法不一致。
- **Pathways Mentor Program 的细节**（项目数量、完成条件）。只用了奖项页面上的一句话。
- **Triple Crown 奖**。官方页面没有提到。
- **总部所在地、会员人数、俱乐部数量**；**女性会员入会的具体年份**（官方只写了“1970 年代”）。

## 已核实、还没出成题的素材

想加题可以从这里开始，出处都在 `questions.js` 的 `sources` 里：

- explorations：第一个是 Online Meeting Mastery，含三个项目和一个收尾任务，完成后在 DCP 里
  算一个 Level 2（Education Programs FAQ、Pathways Updates）
- vintage path 的两条名称和 credential 缩写 BT、CES（Education Programs FAQ）
- Evaluation Contest 和 Tall Tales Contest 的亮灯时间点、各级比赛的评委人数（比赛规则手册）
- 头马的使命和 Toastmaster’s Promise（DCP 手册开头）
- 在俱乐部以外演讲拿 credit 的规定（Education Programs FAQ）

## 可以调的地方

- 闯关每关抽几道题：`questions.js` 里每个 level 的 `pick`。
- 闯关每关至少抽几道 `core` 题、最多优先出几道错题：`game.js` 开头的 `CORE_QUOTA` 和 `WRONG_QUOTA`。
- 过关后牌怎么恢复、计分规则：`game.js` 里的 `finishStage` 和 `settle`。
- 角色的中文叫法：`questions.js` 里的 `roleNames`。

## 试玩链接

https://zhuge-core.github.io/touma-quiz/

托管在 GitHub Pages，公开仓库 `Zhuge-Core/touma-quiz`。更新线上版本：把改过的文件提交到该仓库的 `main` 分支，
一两分钟后生效。提交身份用 GitHub 的 noreply 邮箱，不要带真实邮箱。
