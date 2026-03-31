export interface Resource {
  id: string
  title: string
  url: string
  type: 'video' | 'article' | 'doc' | 'github'
}

export interface Task {
  id: string
  day: number
  title: string
  practice: string
  output: string
  completed: boolean
  resources?: Resource[]
}

export interface Week {
  id: string
  weekNumber: number
  title: string
  goal: string
  tasks: Task[]
  weekOutput: string
  keyKnowledge?: string[]
}

export interface Month {
  id: string
  monthNumber: number
  title: string
  description: string
  weeks: Week[]
}

export interface Project {
  id: string
  name: string
  coreAbility: string
  highlight: string
  progress: number
  techStack: string[]
  weekRange: [number, number]
}

export interface MindMapNode {
  id: string
  label: string
  description?: string
  children?: MindMapNode[]
}

export const defaultLearningPlan: Month[] = [
  {
    id: 'month-1',
    monthNumber: 1,
    title: '打牢地基',
    description: 'Python 后端 + 大模型基础 + RAG 核心',
    weeks: [
      {
        id: 'week-1',
        weekNumber: 1,
        title: 'Python & 后端刚需',
        goal: '能写异步 API，懂 Git 协作基础',
        weekOutput: '3 个可运行 FastAPI 接口（todo / echo / 并发代理） + Git 基础规范',
        keyKnowledge: ['Python 异步编程', 'FastAPI 框架', 'RESTful API 设计', 'Git 工作流'],
        tasks: [
          { id: 'w1d1', day: 1, title: 'Python 文件操作 + json 处理', practice: '读写 JSON 配置，异常 try-except', output: '脚本：读取/写入日志文件', completed: false, resources: [{ id: 'r1', title: 'Python 官方文档', url: 'https://docs.python.org/3/', type: 'doc' }] },
          { id: 'w1d2', day: 2, title: '异步 aiohttp + 并发请求', practice: '用 aiohttp 并发调用公共 API', output: '脚本：批量请求+统计耗时', completed: false, resources: [{ id: 'r2', title: 'aiohttp 文档', url: 'https://docs.aiohttp.org/', type: 'doc' }] },
          { id: 'w1d3', day: 3, title: 'FastAPI 基础：GET/POST', practice: '写一个简单的 /echo 和 /add 接口', output: '本地运行 Swagger 文档', completed: false, resources: [{ id: 'r3', title: 'FastAPI 教程', url: 'https://fastapi.tiangolo.com/', type: 'doc' }] },
          { id: 'w1d4', day: 4, title: 'FastAPI 路径参数、查询参数', practice: '实现模拟 todo 的 CRUD', output: '可测试的 todo API', completed: false },
          { id: 'w1d5', day: 5, title: '中间件、CORS、错误处理', practice: '给 todo API 加上 CORS 和全局异常捕获', output: '支持前端调用的后端', completed: false },
          { id: 'w1d6', day: 6, title: 'Git 分支管理 + PR 模拟', practice: '创建 dev 分支，修改代码后合并到 main', output: '仓库有清晰 commit 历史', completed: false, resources: [{ id: 'r4', title: 'Git 工作流指南', url: 'https://www.atlassian.com/git/tutorials/comparing-workflows', type: 'article' }] },
          { id: 'w1d7', day: 7, title: '复盘 + 文档整理', practice: '把本周 3 个接口整理成 README', output: 'FastAPI 接口文档（含 curl 示例）', completed: false },
        ]
      },
      {
        id: 'week-2',
        weekNumber: 2,
        title: '大模型基础 + Prompt 工程',
        goal: '熟练调用 LLM API，实现带记忆的聊天后端',
        weekOutput: '个人极简对话 AI 网页后端（带历史） + Prompt 实践笔记',
        keyKnowledge: ['LLM API 调用', '流式输出', 'Prompt Engineering', '上下文管理'],
        tasks: [
          { id: 'w2d1', day: 1, title: '大模型 API 调用（非流式）', practice: '用 requests 调用 DeepSeek/OpenAI', output: '脚本：固定 prompt 返回 JSON', completed: false, resources: [{ id: 'r5', title: 'OpenAI API 文档', url: 'https://platform.openai.com/docs', type: 'doc' }] },
          { id: 'w2d2', day: 2, title: '流式输出 + 参数调优', practice: '实现流式打印回复（temperature/top_p）', output: '命令行聊天机器人（单轮）', completed: false },
          { id: 'w2d3', day: 3, title: 'Prompt 工程：Few-shot、CoT', practice: '让模型做数学推理、按 JSON 格式输出', output: '脚本：自动提取文本中的实体', completed: false, resources: [{ id: 'r6', title: 'Prompt Engineering Guide', url: 'https://www.promptingguide.ai/', type: 'article' }] },
          { id: 'w2d4', day: 4, title: '上下文记忆（简单 list 存历史）', practice: '实现多轮对话，保留最近 5 轮', output: '带记忆的对话脚本', completed: false },
          { id: 'w2d5', day: 5, title: '封装为 FastAPI 接口', practice: '设计 /chat 接口，接收 message 和 history', output: '聊天 API（支持 postman 测试）', completed: false },
          { id: 'w2d6', day: 6, title: '加入简易前端（HTML + JS）', practice: '写一个极简聊天页面，对接自己的 API', output: '可视化的对话网页', completed: false },
          { id: 'w2d7', day: 7, title: '完善 + 记录关键 Prompt 模板', practice: '整理常用的 CoT、JSON 输出模板', output: '周报：Prompt 模板库 + 聊天后端 demo', completed: false },
        ]
      },
      {
        id: 'week-3',
        weekNumber: 3,
        title: 'RAG 核心',
        goal: '实现一个本地文档问答系统',
        weekOutput: '可演示的私有知识库问答（支持上传 txt/pdf，返回引用）',
        keyKnowledge: ['Embedding 原理', '向量数据库', '文档切片策略', '检索增强生成'],
        tasks: [
          { id: 'w3d1', day: 1, title: 'Embedding 原理 + 向量数据库选型', practice: '安装 Chroma，跑通官方示例', output: '理解相似度检索流程', completed: false, resources: [{ id: 'r7', title: 'Chroma 文档', url: 'https://docs.trychroma.com/', type: 'doc' }] },
          { id: 'w3d2', day: 2, title: '文档切片（Chunking 策略）', practice: '把 PDF 或 Word 转成 txt，切分成块', output: '输出 chunks（json 文件）', completed: false, resources: [{ id: 'r8', title: 'LangChain 文档切分', url: 'https://python.langchain.com/docs/modules/data_connection/document_transformers/', type: 'doc' }] },
          { id: 'w3d3', day: 3, title: '向量化并存入 Chroma', practice: '用 embedding 模型生成向量并入库', output: '向量库持久化到本地', completed: false },
          { id: 'w3d4', day: 4, title: '检索 + LLM 生成（最简单的 RAG）', practice: '输入问题 -> 检索 top_k -> 拼接 prompt -> 调用 LLM', output: '命令行 RAG 问答脚本', completed: false },
          { id: 'w3d5', day: 5, title: '封装为 FastAPI 接口', practice: '/upload 接收文档，/ask 返回答案', output: 'RAG API 完整功能', completed: false },
          { id: 'w3d6', day: 6, title: '优化：增加源引用', practice: '让回答显示来自哪段文本', output: '提高可信度，减少幻觉', completed: false },
          { id: 'w3d7', day: 7, title: '整理项目结构，写 README', practice: '加入架构图', output: '项目1雏形：个人本地知识库 RAG 系统', completed: false },
        ]
      },
      {
        id: 'week-4',
        weekNumber: 4,
        title: '整合 + 部署入门',
        goal: '把 RAG 项目 Docker 化，能录屏展示',
        weekOutput: '完整 RAG 项目（GitHub 可运行，带视频演示）→ 简历项目1',
        keyKnowledge: ['Docker 容器化', 'Docker Compose', '本地模型部署', 'Ollama'],
        tasks: [
          { id: 'w4d1', day: 1, title: '将前三周代码整合成完整项目', practice: '统一目录：api/, rag/, chat/', output: '整洁的项目结构', completed: false },
          { id: 'w4d2', day: 2, title: '写 Dockerfile + requirements.txt', practice: '让 FastAPI 应用能在容器内运行', output: '本地 docker build -t rag-app .', completed: false, resources: [{ id: 'r9', title: 'Docker 官方教程', url: 'https://docs.docker.com/get-started/', type: 'doc' }] },
          { id: 'w4d3', day: 3, title: 'Docker Compose 多服务编排', practice: '用 compose 启动 app + chroma', output: '一键启动脚本', completed: false },
          { id: 'w4d4', day: 4, title: '私有化部署概念（本地 ollama）', practice: '安装 ollama，跑一个 qwen 小模型', output: '本地模型替代 API 调用', completed: false, resources: [{ id: 'r10', title: 'Ollama 官网', url: 'https://ollama.ai/', type: 'doc' }] },
          { id: 'w4d5', day: 5, title: '录制演示视频 + 截图', practice: '演示上传文档、提问、引用显示', output: '10 分钟录屏', completed: false },
          { id: 'w4d6', day: 6, title: '优化项目 README', practice: '加 badge，写清楚技术栈', output: '简历可直接跳转的 GitHub 链接', completed: false },
          { id: 'w4d7', day: 7, title: '月末复盘 + 项目梳理', practice: '整理 RAG 的关键难点与解决方案', output: '一篇技术笔记', completed: false },
        ]
      }
    ]
  },
  {
    id: 'month-2',
    monthNumber: 2,
    title: '主攻 AI Agent',
    description: 'LangChain Agent + 工程化 + Unity 差异化',
    weeks: [
      {
        id: 'week-5',
        weekNumber: 5,
        title: 'LangChain Agent 入门',
        goal: '理解 Agent 思维，搭建单智能体办公小助手',
        weekOutput: '能自动查数据、计算、生成报表的简易 Agent',
        keyKnowledge: ['ReAct 模式', 'Tool Calling', 'Agent 执行链路', 'LangChain 框架'],
        tasks: [
          { id: 'w5d1', day: 1, title: 'Agent 核心概念（ReAct 模式）', practice: '跑通 create_react_agent 官方示例', output: '输出简单的 Agent 日志', completed: false, resources: [{ id: 'r11', title: 'LangChain Agent 文档', url: 'https://python.langchain.com/docs/modules/agents/', type: 'doc' }] },
          { id: 'w5d2', day: 2, title: 'Tool 基础：计算器、当前时间', practice: '给 Agent 加两个工具，测试问答', output: 'Agent 能回答数学/时间问题', completed: false },
          { id: 'w5d3', day: 3, title: '联网搜索工具（Tavily/SerpAPI）', practice: 'Agent 根据问题决定是否搜索', output: '支持"今天广州天气"类问题', completed: false },
          { id: 'w5d4', day: 4, title: '文件读写工具', practice: 'Agent 能读取本地 txt，并统计字数', output: '写一段总结文件的对话', completed: false },
          { id: 'w5d5', day: 5, title: '单智能体完成一个小任务', practice: '输入昨天的工作记录，输出日报格式', output: 'Agent 输出日报 markdown', completed: false },
          { id: 'w5d6', day: 6, title: '封装为 FastAPI Agent 接口', practice: '接收任务描述，返回执行结果', output: 'API 形式的 Agent', completed: false },
          { id: 'w5d7', day: 7, title: '复盘：Agent 的执行链路', practice: '画流程图，记录常见失败场景', output: '博客：Agent 从零到一', completed: false },
        ]
      },
      {
        id: 'week-6',
        weekNumber: 6,
        title: '进阶 Agent 能力',
        goal: '自定义工具 + 多 Agent 协作',
        weekOutput: '可演示的办公智能助手（能查知识库、发邮件、写总结）',
        keyKnowledge: ['自定义 Tool', '记忆管理', '多 Agent 协作', 'LangGraph'],
        tasks: [
          { id: 'w6d1', day: 1, title: '自定义工具（@tool 装饰器）', practice: '写一个"发送邮件"模拟工具', output: 'Agent 可以"发邮件"', completed: false },
          { id: 'w6d2', day: 2, title: '多轮记忆管理', practice: 'Agent 记住用户之前说的偏好', output: '带长期记忆的助手', completed: false },
          { id: 'w6d3', day: 3, title: '上下文压缩（Summary Memory）', practice: '使用 ConversationSummaryMemory', output: '压缩历史后还能理解意图', completed: false },
          { id: 'w6d4', day: 4, title: '防幻觉：强制调用工具', practice: '要求 Agent 必须查询工具后再回答', output: '减少编造事实', completed: false },
          { id: 'w6d5', day: 5, title: '多 Agent 分工（LangGraph）', practice: '写手 Agent + 审阅 Agent 协作写文档', output: '两个 Agent 接力完成', completed: false, resources: [{ id: 'r12', title: 'LangGraph 文档', url: 'https://langchain-ai.github.io/langgraph/', type: 'doc' }] },
          { id: 'w6d6', day: 6, title: '集成 RAG 作为 Agent 的一个工具', practice: 'Agent 可以"查询知识库"工具', output: 'Agent+RAG 统一入口', completed: false },
          { id: 'w6d7', day: 7, title: '整理项目，写 README', practice: '录制自动办公场景', output: '项目2：自动办公智能助手 Agent', completed: false },
        ]
      },
      {
        id: 'week-7',
        weekNumber: 7,
        title: 'AI 工程化落地优化',
        goal: '让项目更健壮，达到开源可深挖的程度',
        weekOutput: '两个核心项目达到「面试能深挖、代码能开源」',
        keyKnowledge: ['异步并发', '重试机制', '日志追踪', '性能优化'],
        tasks: [
          { id: 'w7d1', day: 1, title: '接口并发 + 异步改造', practice: 'Agent 长任务改为异步执行', output: '支持轮询结果', completed: false },
          { id: 'w7d2', day: 2, title: '异常兜底 + 重试机制（tenacity）', practice: 'API 调用失败时自动重试 3 次', output: '提高鲁棒性', completed: false },
          { id: 'w7d3', day: 3, title: '日志记录（loguru）', practice: '记录每个请求的输入、输出、耗时', output: '可排查问题的日志文件', completed: false },
          { id: 'w7d4', day: 4, title: '本地轻量化模型部署', practice: '替换 API 为本地模型，测试性能', output: '不依赖外网也能运行', completed: false },
          { id: 'w7d5', day: 5, title: '项目性能分析（cProfile）', practice: '优化 chunk 数量，使用缓存', output: '响应时间减少 30%', completed: false },
          { id: 'w7d6', day: 6, title: '完善项目文档', practice: '架构图（Mermaid）、部署视频', output: 'GitHub 满星项目结构', completed: false },
          { id: 'w7d7', day: 7, title: '双项目整合演示', practice: 'Agent 可以调用 RAG 知识库', output: '端到端智能助手', completed: false },
        ]
      },
      {
        id: 'week-8',
        weekNumber: 8,
        title: '轻量 Unity + AI（差异化）',
        goal: '差异化加分项，游戏+AI 交叉能力',
        weekOutput: '可玩的 Unity 小游戏（NPC 实时对话，有性格）→ 简历项目3',
        keyKnowledge: ['Unity 基础', 'C# 编程', 'HTTP 请求', 'NPC 角色扮演'],
        tasks: [
          { id: 'w8d1', day: 1, title: '安装 Unity Hub + 编辑器', practice: '创建 3D 项目，了解场景、物体、脚本', output: '能移动一个方块', completed: false, resources: [{ id: 'r13', title: 'Unity Learn', url: 'https://learn.unity.com/', type: 'doc' }] },
          { id: 'w8d2', day: 2, title: 'C# 基础 + 按钮事件', practice: '写一个按钮，点击打印日志', output: '简单的 UI 交互', completed: false },
          { id: 'w8d3', day: 3, title: 'Unity 中发送 HTTP 请求', practice: '调用之前写的聊天 API（UnityWebRequest）', output: '控制台输出 AI 回复', completed: false },
          { id: 'w8d4', day: 4, title: '整合：NPC 对话功能', practice: '点击 NPC -> 弹出对话框 -> 调用 AI', output: 'NPC 能回答用户输入', completed: false },
          { id: 'w8d5', day: 5, title: '给 NPC 添加"性格" Prompt', practice: '修改 system prompt，实现角色扮演', output: '角色扮演 NPC', completed: false },
          { id: 'w8d6', day: 6, title: '添加简单动画 + 多轮对话', practice: '历史记录显示在 UI 上', output: '更像游戏对话', completed: false },
          { id: 'w8d7', day: 7, title: '打包成 Windows 程序', practice: '写 README 说明如何运行', output: 'AI 智能 NPC 小游戏', completed: false },
        ]
      }
    ]
  },
  {
    id: 'month-3',
    monthNumber: 3,
    title: '刷题 + 复盘 + 简历',
    description: '知识体系 + 面试准备 + 求职冲刺',
    weeks: [
      {
        id: 'week-9',
        weekNumber: 9,
        title: '技术复盘 + 补短板',
        goal: '形成完整知识体系，查漏补缺',
        weekOutput: '知识思维导图 + 技术博客',
        keyKnowledge: ['知识梳理', 'Bug 修复', '代码重构', '技术写作'],
        tasks: [
          { id: 'w9d1', day: 1, title: '整理 RAG 知识思维导图', practice: 'XMind 或 markmap', output: '形成记忆树', completed: false },
          { id: 'w9d2', day: 2, title: '整理 Agent 知识思维导图', practice: '梳理工具调用流程', output: '形成记忆树', completed: false },
          { id: 'w9d3', day: 3, title: '修复项目 bug，跑通全流程', practice: '每个项目再跑一遍', output: '确保零错误启动', completed: false },
          { id: 'w9d4', day: 4, title: '优化项目注释', practice: '添加详细注释和类型标注', output: '代码可读性提升', completed: false },
          { id: 'w9d5', day: 5, title: '重写 RAG 检索核心代码', practice: '手写一遍关键逻辑', output: '加深理解', completed: false },
          { id: 'w9d6', day: 6, title: '重写 Agent 工具核心代码', practice: '手写一遍关键逻辑', output: '加深理解', completed: false },
          { id: 'w9d7', day: 7, title: '写总结博客', practice: '《三个月 AI 应用学习之路》', output: '发知乎/掘金', completed: false },
        ]
      },
      {
        id: 'week-10',
        weekNumber: 10,
        title: '校招八股 + AI 岗面试题',
        goal: '掌握核心面试知识点',
        weekOutput: '面试知识储备完成',
        keyKnowledge: ['RAG 原理', '向量数据库', 'Agent 工具调用', 'LLM 优化'],
        tasks: [
          { id: 'w10d1', day: 1, title: 'RAG 原理 + 幻觉解决方案', practice: '背诵 + 理解，能清晰讲解', output: '能清晰讲解 RAG 流程', completed: false },
          { id: 'w10d2', day: 2, title: '向量数据库对比', practice: 'Chroma vs Milvus vs Pinecone', output: '能对比优缺点', completed: false },
          { id: 'w10d3', day: 3, title: 'Agent 工具调用流程', practice: 'ReAct 模式详解，画流程图', output: '能画流程图讲解', completed: false },
          { id: 'w10d4', day: 4, title: '大模型 API 优化', practice: '流式、批处理、缓存、Token 优化', output: '能举例说明', completed: false },
          { id: 'w10d5', day: 5, title: '部署流程', practice: 'Docker、Ollama、云服务对比', output: '能演示部署', completed: false },
          { id: 'w10d6', day: 6, title: '后端基础八股', practice: '并发、GIL、FastAPI 生命周期', output: '能解答常见问题', completed: false },
          { id: 'w10d7', day: 7, title: 'LeetCode 刷题', practice: '数组、字符串、哈希、双指针', output: '完成 20 道简单题', completed: false, resources: [{ id: 'r14', title: 'LeetCode', url: 'https://leetcode.cn/', type: 'doc' }] },
        ]
      },
      {
        id: 'week-11',
        weekNumber: 11,
        title: '简历定稿 + GitHub 美化',
        goal: '完成求职准备材料',
        weekOutput: 'STAR 法则简历 + 美化的 GitHub 仓库',
        keyKnowledge: ['STAR 法则', 'README 撰写', '项目展示', '个人品牌'],
        tasks: [
          { id: 'w11d1', day: 1, title: '项目1简历撰写', practice: 'RAG 知识库 STAR 法则', output: '简历项目1完成', completed: false },
          { id: 'w11d2', day: 2, title: '项目2简历撰写', practice: '办公智能体 STAR 法则', output: '简历项目2完成', completed: false },
          { id: 'w11d3', day: 3, title: '项目3简历撰写', practice: 'AI NPC STAR 法则', output: '简历项目3完成', completed: false },
          { id: 'w11d4', day: 4, title: 'GitHub 仓库美化', practice: '架构图、演示 GIF、badge', output: 'README 专业化', completed: false },
          { id: 'w11d5', day: 5, title: '添加部署教程', practice: 'requirements.txt、docker-compose.yml', output: '一键部署说明', completed: false },
          { id: 'w11d6', day: 6, title: '录制演示视频', practice: '每个项目 3-5 分钟', output: '视频链接添加到 README', completed: false },
          { id: 'w11d7', day: 7, title: '技术博客 / LinkedIn 更新', practice: '突出 AI 工程化能力', output: '在线作品集完成', completed: false },
        ]
      },
      {
        id: 'week-12',
        weekNumber: 12,
        title: '模拟面试 + 投递冲刺',
        goal: '拿到 offer',
        weekOutput: '开始投递，准备面试',
        keyKnowledge: ['自我介绍', '项目讲解', '行为面试', '技术深挖'],
        tasks: [
          { id: 'w12d1', day: 1, title: '自我讲解项目架构', practice: '录音回听，优化表达', output: '30 分钟模拟', completed: false },
          { id: 'w12d2', day: 2, title: '讲解项目难点', practice: '录音回听，准备追问', output: '30 分钟模拟', completed: false },
          { id: 'w12d3', day: 3, title: '讲解项目优化点', practice: '录音回听，突出成果', output: '30 分钟模拟', completed: false },
          { id: 'w12d4', day: 4, title: '同学模拟面试', practice: '重点深挖 RAG', output: '反馈改进', completed: false },
          { id: 'w12d5', day: 5, title: '学长/学姐模拟面试', practice: '重点深挖 Agent', output: '反馈改进', completed: false },
          { id: 'w12d6', day: 6, title: '开始投递简历', practice: 'AI 应用开发、Agent 开发岗位', output: '投递 10+ 岗位', completed: false },
          { id: 'w12d7', day: 7, title: '继续投递 + 复盘', practice: '根据反馈调整简历', output: '持续优化', completed: false },
        ]
      }
    ]
  }
]

export const defaultProjects: Project[] = [
  {
    id: 'project-1',
    name: '私有文档 RAG 知识库',
    coreAbility: '文档切片、向量检索、LLM 生成',
    highlight: '解决企业知识孤岛，支持 PDF/Word，带引用溯源',
    progress: 0,
    techStack: ['Python', 'FastAPI', 'Chroma', 'OpenAI', 'Docker'],
    weekRange: [1, 4]
  },
  {
    id: 'project-2',
    name: '自动办公 AI Agent 智能体',
    coreAbility: '工具调用、多轮记忆、多 Agent 协作',
    highlight: '自动生成日报/发邮件/查知识库，工程化落地',
    progress: 0,
    techStack: ['LangChain', 'LangGraph', 'FastAPI', 'Redis'],
    weekRange: [5, 7]
  },
  {
    id: 'project-3',
    name: 'Unity + 大模型智能 NPC',
    coreAbility: 'HTTP 对接 LLM、角色扮演、实时对话',
    highlight: '游戏 + AI 交叉能力，面试差异化亮点',
    progress: 0,
    techStack: ['Unity', 'C#', 'FastAPI', 'WebSocket'],
    weekRange: [8, 8]
  }
]

export const defaultMindMapData: MindMapNode = {
  id: 'root',
  label: 'AI 工程师学习路径',
  description: '3 个月冲刺 AI 应用工程师',
  children: [
    {
      id: 'foundation',
      label: '基础能力',
      description: '第 1-2 周',
      children: [
        { id: 'python', label: 'Python 编程', description: '异步、文件操作、JSON' },
        { id: 'fastapi', label: 'FastAPI 后端', description: 'REST API、中间件、CORS' },
        { id: 'git', label: 'Git 协作', description: '分支管理、PR 流程' },
        { id: 'docker', label: 'Docker 部署', description: '容器化、Compose' }
      ]
    },
    {
      id: 'llm',
      label: '大模型应用',
      description: '第 2 周',
      children: [
        { id: 'api', label: 'API 调用', description: 'OpenAI/DeepSeek 接口' },
        { id: 'prompt', label: 'Prompt 工程', description: 'Few-shot、CoT、JSON 输出' },
        { id: 'stream', label: '流式输出', description: 'SSE、实时响应' },
        { id: 'memory', label: '上下文记忆', description: '多轮对话、历史管理' }
      ]
    },
    {
      id: 'rag',
      label: 'RAG 系统',
      description: '第 3-4 周',
      children: [
        { id: 'embedding', label: 'Embedding 向量化', description: '文本转向量' },
        { id: 'vectordb', label: '向量数据库', description: 'Chroma/Milvus' },
        { id: 'chunking', label: '文档切片', description: '切分策略、重叠' },
        { id: 'retrieval', label: '检索策略', description: 'Top-K、重排序' },
        { id: 'generation', label: '生成优化', description: '引用溯源、防幻觉' }
      ]
    },
    {
      id: 'agent',
      label: 'Agent 智能体',
      description: '第 5-7 周',
      children: [
        { id: 'react', label: 'ReAct 模式', description: '思考-行动-观察循环' },
        { id: 'tools', label: '工具调用', description: '自定义工具、强制调用' },
        { id: 'multi-agent', label: '多 Agent 协作', description: '分工、接力、审阅' },
        { id: 'langchain', label: 'LangChain/LangGraph', description: '框架使用' }
      ]
    },
    {
      id: 'engineering',
      label: '工程化',
      description: '第 7 周',
      children: [
        { id: 'async', label: '异步并发', description: '长任务、轮询' },
        { id: 'retry', label: '重试机制', description: 'tenacity、指数退避' },
        { id: 'logging', label: '日志追踪', description: 'loguru、请求记录' },
        { id: 'deploy', label: '私有化部署', description: 'Ollama、本地模型' }
      ]
    },
    {
      id: 'interview',
      label: '面试准备',
      description: '第 9-12 周',
      children: [
        { id: 'resume', label: '简历撰写', description: 'STAR 法则' },
        { id: 'github', label: 'GitHub 美化', description: 'README、演示 GIF' },
        { id: 'mock', label: '模拟面试', description: '项目讲解、技术深挖' },
        { id: 'leetcode', label: '算法刷题', description: '基础算法' }
      ]
    }
  ]
}

export const defaultMilestones = [
  { id: 'm1', week: 4, title: '完成 RAG 项目', description: '私有文档知识库系统上线' },
  { id: 'm2', week: 7, title: '完成 Agent 项目', description: '自动办公智能助手可演示' },
  { id: 'm3', week: 8, title: '完成 Unity 项目', description: 'AI NPC 游戏 Demo 打包' },
  { id: 'm4', week: 11, title: '简历定稿', description: 'GitHub 美化 + 视频演示' },
  { id: 'm5', week: 12, title: '开始投递', description: '校招冲刺，拿到 Offer' }
]

export const learningResources = [
  { category: 'Python 后端', items: ['FastAPI 官方文档', 'Python asyncio 教程', 'requests 库文档'] },
  { category: '大模型 API', items: ['OpenAI API 文档', 'DeepSeek 开发指南', 'Prompt Engineering Guide'] },
  { category: 'RAG 系统', items: ['LangChain 文档', 'Chroma 官方教程', 'Embedding 模型对比'] },
  { category: 'Agent 开发', items: ['LangChain Agent 文档', 'LangGraph 官方教程', 'ReAct 论文解读'] },
  { category: '工程化', items: ['Docker 官方教程', 'Ollama 文档', 'loguru 日志库'] },
  { category: '面试准备', items: ['LeetCode 热题 100', 'AI 岗位面经汇总', 'STAR 法则写简历'] },
]
