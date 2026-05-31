# PaperMod Zola 增强主题设计文档

## 目标

基于 `cydave/zola-theme-papermod` 创建增强版 Zola 主题，移植 lvbibir Hugo PaperMod 博客的全部增强功能。

## 技术路线

Fork Zola PaperMod 作为基础（已含归档、RSS、标签、明暗切换、代码高亮、搜索、SEO、多语言），在其上增量添加。

## 目录结构

```
zola-theme-papermod/
├── content/                          # 示例内容
├── static/
│   ├── css/styles.css
│   ├── css/override.css
│   └── js/
│       ├── search.js                 # 已有
│       ├── toc.js              +     # TOC滚动同步高亮
│       ├── progress-bar.js     +     # 阅读进度条
│       ├── lazy-load.js        +     # 图片懒加载
│       └── code-copy.js        +     # 增强代码复制
│   └── admin/                  +
│       ├── index.html          +     # Decap CMS 入口
│       └── config.yml          +     # CMS 配置
├── templates/
│   ├── partials/
│   │   ├── header.html               # 修改: 加进度条
│   │   ├── footer.html               # 修改: 加统计
│   │   ├── toc.html                  # 重写: 增强TOC
│   │   ├── series_sidebar.html +     # 系列文章侧边栏
│   │   ├── comments.html      +      # 评论系统
│   │   ├── reward.html        +      # 打赏弹窗
│   │   └── site_stats.html    +      # 站点统计
│   ├── shortcodes/
│   │   ├── friend.html        +      # 友链卡片
│   │   ├── lazy_image.html    +      # 懒加载图片
│   │   └── reward_button.html +      # 打赏按钮
│   └── series/                +      # 系列 taxonomy 模板
│       ├── list.html          +
│       └── single.html        +
├── config.toml                       # 扩展配置
├── theme.toml
```

## 功能详细设计

### 1. 系列文章侧边栏

- 依赖 Zola taxonomy 机制，在 config.toml 添加 `series` taxonomy
- `series_sidebar.html` partial 展示当前文章所属系列的所有文章
- 三种响应式布局：弹出层(≤768px)、2列(≤1200px)、3列(>1200px)
- CSS: `@media` 查询控制布局切换，参考 lvbibir `series.css`

### 2. 响应式 TOC

- 重写已有 `toc.html` partial
- 桌面端(>768px): 固定定位在文章左侧/右侧
- 移动端(≤768px): 底部弹出式面板，按钮触发
- JS 监听 scroll 事件，根据可视区域高亮当前标题
- 使用 `IntersectionObserver` 监听标题元素

### 3. Mac 风格代码块

- 纯 CSS 实现，在 `<pre>` 元素前用 `::before` 伪元素添加红黄绿圆点
- 配合已有的代码复制按钮（Zola PaperMod 已有 `show_code_copy_buttons`）
- 圆点颜色：红 `#ff5f56`、黄 `#ffbd2e`、绿 `#27c93f`

### 4. 阅读进度条

- 固定在页面顶部的进度条，宽度 0-100% 映射页面滚动位置
- CSS: `position: fixed; top: 0; height: 2px; z-index: 9999`
- JS: `window.scroll` 事件计算进度百分比
- 在 `header.html` 中引入

### 5. 图片懒加载

- Zola 没有 Hugo 的 `_markup/render-image.html` 钩子
- 用 `lazy_image.html` shortcode 替代: `{{ lazy_image(src="...", alt="...") }}`
- JS: `IntersectionObserver` 监听 `<img data-src>`，进入视口时设置 `src`
- 未加载时显示占位背景

### 6. 评论系统

- `comments.html` partial，通过配置切换评论系统
- 默认支持 Twikoo（自托管评论），可扩展 Giscus
- 通过 `extra.papermod.comment_system` 和 `comment_env_id` 配置

### 7. 打赏功能

- `reward_button.html` shortcode 在文章底部生成打赏按钮
- 点击弹出模态框显示微信/支付宝收款二维码
- CSS 参考 lvbibir `reward.css`

### 8. 友链卡片

- `friend.html` shortcode 参数: `name`, `url`, `avatar`, `description`
- 卡片布局：左侧头像 + 右侧名称/描述
- CSS 参考 lvbibir `friend-link.css`

### 9. 站点统计

- `site_stats.html` partial 集成到 `footer.html`
- 不蒜子统计: 通过 `<script>` 引入外部 JS
- 网站运行时间: JS 计算从 `site_start_year` 到当前的天数

## 配置设计

在现有 `[extra.papermod]` 基础上新增：

```toml
# 系列文章
show_series_sidebar = true
series_sidebar_layout = "popup"

# 增强TOC
show_toc = true
toc_open = false
toc_scroll_sync = true

# Mac风格代码块
mac_code_block = true

# 图片懒加载
lazy_loading = true

# 阅读进度条
show_progress_bar = true

# 评论
comments = true
comment_system = "twikoo"
comment_env_id = ""

# 打赏
show_reward = true
reward_wechat_qr = ""
reward_alipay_qr = ""

# 站点统计
show_site_stats = true
site_start_year = 2020
busuanzi_enable = true
filing_no = ""
```

## 实施顺序

1. 初始化项目 + 引入 Zola PaperMod 主题作为 submodule 或直接纳入
2. 系列文章侧边栏
3. 响应式 TOC 增强
4. Mac 风格代码块
5. 阅读进度条
6. 图片懒加载
7. 评论系统
8. 打赏功能
9. 友链卡片
10. 站点统计
11. Decap CMS 集成
12. 整合测试 + 示例站点

## 10. Decap CMS 集成

- `static/admin/index.html` 从 CDN 加载 Decap CMS SPA
- `static/admin/config.yml` 配置 CMS 集合、字段、后端
- CMS 通过 GitHub OAuth 认证，直接向仓库提交 Markdown 文件
- 集合配置对应 Zola 的内容结构：posts、pages、friend links

### CMS 集合设计

```yaml
backend:
  name: github
  repo: serbia70/rusthugo
  branch: main

collections:
  - name: "posts"
    label: "博客文章"
    folder: "content/posts"
    create: true
    fields:
      - { label: "标题", name: "title", widget: "string" }
      - { label: "日期", name: "date", widget: "datetime" }
      - { label: "标签", name: "tags", widget: "list" }
      - { label: "系列", name: "series", widget: "string", required: false }
      - { label: "正文", name: "body", widget: "markdown" }

  - name: "pages"
    label: "页面"
    files:
      - label: "关于"
        name: "about"
        file: "content/about/_index.md"
        fields:
          - { label: "标题", name: "title", widget: "string" }
          - { label: "正文", name: "body", widget: "markdown" }
```

### 目录结构追加

```
├── static/
│   └── admin/
│       ├── index.html          +     # Decap CMS 入口
│       └── config.yml          +     # CMS 配置
```

## Zola vs Hugo 差异处理

- **Markdown 渲染钩子**: Hugo 的 `_markup/` 钩子在 Zola 中不存在，改用 shortcode
- **Taxonomy**: Zola 原生支持，添加 config 即可
- **i18n**: Zola 使用 TOML 配置多语言
- **模板语法**: Hugo 用 Go template，Zola 用 Tera，语义等价但语法不同
- **Sass**: Zola 内置 `compile_sass = true`，CSS 放在 `static/` 或通过 Sass 编译
