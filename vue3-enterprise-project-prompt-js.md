# Vue 3 企业级前端项目初始化 Prompt（JavaScript 版本）

## 一、角色定位

你是一名拥有丰富经验的资深前端架构师，精通 Vue 3、Composition API、Vite、Element Plus、ECharts、Axios、Pinia、Vue Router 和 Tailwind CSS。

请按照企业级前端工程化标准，从零搭建一套结构清晰、规范统一、易于维护、方便扩展的 Vue 3 项目基础框架。

**核心原则：** 不使用 TypeScript，全部采用 JavaScript；不要过度设计，不要过度拆分代码；优先保证项目结构简单、职责明确、易于维护。

## 二、技术栈要求

1. **Vue 3**：使用 Composition API，组件优先采用 `<script setup>`。
2. **JavaScript**：项目全部使用 JavaScript，不安装、不配置、不引入 TypeScript。
3. **Vite**：作为项目构建工具。
4. **Element Plus**：作为主要 UI 组件库。
5. **ECharts**：用于数据可视化。
6. **Axios**：负责 HTTP 请求，并统一封装请求逻辑。
7. **Pinia**：负责全局状态管理。
8. **Vue Router**：负责路由管理。
9. **Tailwind CSS**：负责原子化 CSS 样式管理。
10. **Yarn**：作为项目依赖管理工具。

请先检查 Node.js、Yarn 和现有项目环境，再选择相互兼容的稳定依赖版本。不要盲目安装最新版，也不要混用不同主版本的配置方式。

## 三、项目目录结构

建议采用以下结构，可根据实际需要微调，但不要创建没有实际用途的文件或目录。

```text
src/
├── api/                  # API 接口管理
│   ├── modules/          # 按业务模块划分接口
│   └── index.js
├── assets/               # 静态资源
│   ├── images/
│   └── styles/
│       ├── index.css
│       └── tailwind.css
├── components/           # 全局公共组件
├── config/               # 项目配置
│   └── index.js
├── hooks/                # 公共组合式函数
├── layouts/              # 页面布局
├── router/               # 路由配置
│   ├── modules/
│   └── index.js
├── stores/               # Pinia 状态管理
│   └── modules/
├── utils/                # 公共工具函数
│   ├── request.js        # Axios 请求封装
│   └── index.js
├── views/                # 页面
│   ├── home/
│   └── login/
├── App.vue
└── main.js

.env.development
.env.production
vite.config.js
package.json
yarn.lock
```

不要创建 `types/`、`*.ts`、`*.d.ts`、`tsconfig.json` 等 TypeScript 专属目录或文件。

## 四、项目初始化与工程配置

1. 使用 Vite 创建 Vue 3 + JavaScript 项目，选择 JavaScript 模板。
2. 使用 Yarn 管理依赖，统一使用 `yarn.lock`，不混用 npm 或 pnpm。
3. 配置路径别名 `@` 指向 `src`，确保 Vite 配置与实际目录一致。
4. 配置开发环境和生产环境变量。
5. 配置 ESLint 和 Prettier，统一 JavaScript、Vue 和 CSS 代码风格。
6. 不安装 TypeScript，不配置 TypeScript，不生成 TypeScript 文件。
7. 配置 Element Plus 按需自动导入。
8. 配置 ECharts，并封装基础图表组件。
9. 配置 Tailwind CSS，确保与 Element Plus 样式正常共存。
10. 配置 Vue Router 和 Pinia。

## 五、Axios 请求封装（重点）

将 Axios 请求统一封装在 `src/utils/request.js` 中，业务 API 放在 `src/api/modules/` 下。页面组件不得散落编写 Axios 实例和重复的请求拦截逻辑。

### 1. 基础配置

- 统一配置 `baseURL` 和 `timeout`。
- 通过 `.env` 文件切换接口地址。
- 设置合理的默认请求头。
- 支持 JSON 请求和 FormData 文件上传。
- 支持请求级别自定义配置。

### 2. 请求拦截器

- 统一获取 Pinia 中的 Token。
- 按后端约定设置 `Authorization` 请求头。
- 支持自定义请求头。
- 不重复编写 Token 获取逻辑。
- 避免在模块初始化阶段因 Pinia 尚未就绪而产生循环依赖或访问异常。

### 3. 响应拦截器

- 统一处理 HTTP 状态码。
- 按后端约定处理业务状态码。
- 统一处理接口错误信息。
- 处理 Token 失效情况。
- 统一处理网络异常和超时。
- 避免同一错误重复弹出提示。
- 正确处理 `Blob`、文件下载等响应类型。
- 不要吞掉调用方需要处理的错误。

### 4. JavaScript 数据结构约定

虽然项目不使用 TypeScript，仍需保持数据结构清晰：

- 对 API 响应结构、请求参数和业务对象，在必要时通过 JSDoc 注释说明字段。
- 对公共函数补充参数、返回值和用途注释。
- 使用一致的数据结构和命名规范。
- 对外部接口数据进行必要的空值和类型检查。
- 不使用 `any` 等 TypeScript 概念，也不要为了模拟静态类型引入复杂运行时校验框架。

### 5. 请求方法

统一提供：

- GET
- POST
- PUT
- DELETE
- PATCH
- 文件上传
- 文件下载

支持 GET 参数、POST 请求体、请求取消和自定义配置。根据实际项目需要决定是否封装快捷方法，不要为了方法数量而增加无意义抽象。

### 6. 错误处理

区分并妥善处理：

- HTTP 请求错误
- 业务逻辑错误
- 网络连接错误
- 请求超时
- 用户主动取消请求
- Token 过期

错误处理应统一，但不能隐藏必要错误信息。明确哪些错误由拦截器处理，哪些错误交给业务调用方处理，避免重复提示。

## 六、Pinia 状态管理

创建用户状态模块：`src/stores/modules/user.js`。

实现：

- Token 管理
- 用户信息管理
- 登录状态管理
- 登录方法
- 退出登录方法
- 清空用户信息

Token 的读取、写入和清理方式应统一管理，避免多个文件重复操作。持久化方式应结合项目安全要求选择，不要默认认为 localStorage 适合所有场景。

## 七、Vue Router 路由管理

1. 使用 Vue Router 4。
2. 支持静态路由和动态路由。
3. 支持路由懒加载。
4. 配置路由元信息。
5. 实现登录页面与后台页面路由隔离。
6. 配置全局路由守卫。
7. 未登录访问受保护页面时跳转登录页，并保留合法的目标地址。
8. 已登录用户访问登录页时按项目规则重定向。
9. 预留动态菜单和权限路由扩展能力。
10. 处理 404 页面和未知路由。

## 八、Element Plus 配置

1. 正确安装和配置 Element Plus。
2. 使用自动按需导入。
3. 配置中文语言包。
4. 统一主题变量。
5. 统一表格、按钮、表单等基础样式。
6. 避免全局样式污染。
7. 确保自动导入插件配置与实际依赖版本匹配。

## 九、ECharts 封装

创建公共图表组件：`src/components/BaseChart.vue`。

要求：

1. 使用 Vue 3 Composition API 和 JavaScript。
2. 支持通过 props 传入 ECharts `option`。
3. 支持 option 变化后更新图表。
4. 支持容器尺寸变化时自适应。
5. 组件卸载时执行 `dispose`。
6. 避免重复初始化。
7. 支持常见柱状图、折线图和饼图。
8. 图表通用逻辑与业务配置分离。
9. 正确处理容器初始尺寸为 0、异步数据和组件销毁等情况。

## 十、Tailwind CSS 配置

1. 正确安装并配置 Tailwind CSS。
2. 全局引入 Tailwind 样式。
3. 支持响应式布局。
4. 与 Element Plus 样式兼容。
5. 评估并处理 Preflight 等基础样式重置对 Element Plus 的影响。
6. 根据选定的 Tailwind CSS 主版本采用对应配置方式，不要混用 v3 与 v4 的配置。

## 十一、基础页面

至少创建以下页面：

1. 登录页面。
2. 首页 Dashboard。
3. 404 页面。

Dashboard 页面展示：

- 数据统计卡片。
- ECharts 折线图。
- ECharts 柱状图。
- ECharts 饼图。

页面采用简洁、清晰的后台管理系统风格。示例数据应明确标记为模拟数据，不要伪装成真实接口数据。

## 十二、JavaScript 代码规范

1. Vue 组件使用 Composition API。
2. 优先使用 `<script setup>`，不添加 `lang="ts"`。
3. 所有业务逻辑使用 JavaScript。
4. 变量和函数采用 camelCase。
5. 组件采用 PascalCase。
6. 常量根据语义采用统一命名规范。
7. 公共函数补充必要的 JSDoc 注释。
8. 对接口返回值和外部数据做好空值检查。
9. 避免重复代码。
10. 不要过度封装和过度拆分。
11. 公共请求逻辑统一维护在 `utils/request.js`。
12. API 接口与页面业务逻辑分离。
13. 保证代码可读、可维护、易扩展。
14. 不要创建没有实际用途的抽象层。
15. 不使用 TypeScript 语法、类型声明、接口、泛型或类型断言。

## 十三、分阶段执行要求

请按以下阶段实施，每个阶段完成后先检查结果，再进入下一阶段：

### 第一阶段：环境检查与项目初始化

- 检查当前目录是否已有项目。
- 检查 Node.js 和 Yarn 版本。
- 使用 Vite 的 Vue + JavaScript 模板初始化项目。
- 不得覆盖或删除已有业务文件。
- 确认项目中没有 TypeScript 配置和模板文件。

### 第二阶段：安装与配置依赖

- 安装 Vue、Vite、Element Plus、ECharts、Axios、Pinia、Vue Router、Tailwind CSS。
- 安装必要的 JavaScript 开发依赖。
- 不安装 TypeScript、`vue-tsc` 或仅用于 TypeScript 的插件。
- 确认依赖版本兼容。

### 第三阶段：创建项目目录

- 创建必要目录和 JavaScript 文件。
- 配置路径别名、环境变量、ESLint 和 Prettier。
- 不创建 `types/`、`tsconfig.json` 或 `.ts` 文件。

### 第四阶段：实现 Axios 请求层

- 完成 Axios 实例、请求与响应拦截器。
- 完成请求方法、上传、下载、取消请求及错误处理。
- 使用 JSDoc 对关键公共方法进行说明。
- 用简单示例验证请求层。

### 第五阶段：配置 Pinia 和 Vue Router

- 完成用户状态模块。
- 完成路由模块、路由守卫和 404 页面。
- 验证登录状态与路由跳转。

### 第六阶段：配置 UI 与图表

- 完成 Element Plus 按需导入。
- 完成 Tailwind CSS 配置。
- 完成 ECharts 基础图表组件。

### 第七阶段：开发基础页面

- 完成登录页。
- 完成 Dashboard。
- 完成 404 页面。

### 第八阶段：检查与验证

- 检查依赖和配置。
- 执行 ESLint 检查。
- 执行生产构建。
- 检查项目中是否意外生成 TypeScript 文件或配置。
- 修复实际发现的问题。

### 第九阶段：启动项目

- 执行 `yarn dev`。
- 确认项目能够正常启动和访问。
- 给出启动地址、常用命令和验证结果。

## 十四、验收标准

完成后必须满足：

- `yarn install` 可以正常安装依赖。
- `yarn dev` 可以正常启动项目。
- `yarn build` 可以正常构建项目。
- ESLint 检查通过。
- Vue Router 路由跳转正常。
- Pinia 状态管理正常。
- Axios 请求封装可正常使用。
- Element Plus 组件正常显示。
- ECharts 图表正常渲染和更新。
- Tailwind CSS 样式正常生效。
- 开发环境和生产环境配置正常。
- 项目不包含 TypeScript 依赖、配置或源码文件。

## 十五、执行过程中的约束

1. 不要只输出目录结构或示例代码，必须在当前工作区实际创建和修改文件。
2. 如果当前目录已有项目，先检查技术栈和目录结构，再决定增量集成或初始化；禁止擅自覆盖已有业务代码。
3. 不确定后端响应结构、业务状态码、Token 字段或认证规则时，先标记为待确认配置，不要自行假设为真实业务约定。
4. 不要为了展示效果接入未经确认的真实接口；Dashboard 可使用明确标记的模拟数据。
5. 每个阶段说明修改了哪些文件、关键设计决策以及验证方式。
6. 遇到报错时先分析根因，再做最小必要修改，不要通过关闭检查来掩盖问题。
7. 最后提供项目目录说明、依赖清单、启动命令、构建命令和待确认事项。

**最终目标：** 交付一套全部使用 JavaScript、可以安装、启动、构建、验证的 Vue 3 企业级前端基础框架，而不是只有架构图或伪代码。
