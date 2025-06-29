# Oxyegn Blog Platform
本项目是一个基于 NEXT.js 制作的一个美观、配置方便、简洁的博客平台，目前为 V1.0.0 版本，后续会根据需求进行更新。

## 功能
- 支持 Markdown 格式的博客文章
- 支持分类功能
- 支持自定义导航栏、侧边栏、页脚等
- 支持深色模式

## 如何配置 (本地)
1. git clone 到本地
2. 安装依赖
```bash
npm install
# or
yarn install
# or
pnpm install
```
3. 运行项目
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
## 博客存放位置
博客存放在`src/content/blogs`文件夹中，需要遵循一定的规范
1. 文件名不能为中文
2. 如果没有图片资源，可以把blog的markdown文件直接放在blogs文件夹中
3. 如果有图片资源，需要放在`src/content/blogs/images`文件夹中
```text
blog-name/
├── index.md          # 博客内容
└── assets/           # 图片资源
    ├── image1.jpg
    └── image2.png
```
4. 博客需要命名为index.md
5. 博客的元数据需要遵循如下规范
```text
---
title: "这里是标题"
date: "2024-01-15"
category: "这里是分类"
tags: ["Markdown", "渲染", "展示"]
readTime: 8
excerpt: "展示博客平台强大的 Markdown 渲染能力，包括代码高亮、数学公式、表格等丰富功能。" //这里是预览内容
---
```
# 感谢您的使用，在使用过程中遇到任何问题都可以联系开发者