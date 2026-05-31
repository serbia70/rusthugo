+++
title = "PaperMod 主题安装与配置"
date = 2024-03-15
draft = false

[taxonomies]
tags = ["PaperMod", "Zola"]
series = ["博客建站"]

[extra]
cover_image = "/images/cover-hugo.svg"
+++

记录 Zola + PaperMod 主题的安装、配置和自定义过程。

<!-- more -->

## 安装主题

```bash
git clone https://github.com/serbia70/rusthugo
cd rusthugo
zola serve
```

## 配置说明

编辑 `config.toml` 文件，配置站点基本信息、导航菜单、社交图标等。

## 自定义

通过 `override.css` 和自定义模板扩展主题功能。

## 表格

| 功能 | 状态 |
|------|------|
| 系列侧边栏 | ✅ |
| 响应式 TOC | ✅ |
| Mac 代码块 | ✅ |
| 阅读进度条 | ✅ |
| 评论系统 | ✅ |
| 打赏 | ✅ |
| 友链卡片 | ✅ |
| 站点统计 | ✅ |

