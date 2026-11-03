# 🌏 方言翻译英语 | Dialect to English Translator

> 一款支持多种中国方言翻译成英语的在线翻译工具，基于阿里百炼大模型 API 构建。

## ✨ 功能特性

- 🗣️ **9 种方言支持** — 粤语、闽南语、上海话、四川话、客家话、东北话、北京话、天津话、粤语俗语
- 👤 **多用户系统** — 支持注册登录，每个用户独立保存 API 配置
- ⚙️ **灵活配置** — 支持自定义 Base URL，适配百炼工作空间专属端点
- 💾 **本地存储** — API Key 和配置保存在浏览器本地，安全可靠
- 📱 **响应式设计** — 完美适配电脑和手机
- ⌨️ **快捷键支持** — Ctrl + Enter 快速翻译

## 🌐 在线体验

**访问地址**：[https://Dxw-qy.github.io/dialect-translator/](https://Dxw-qy.github.io/dialect-translator/)

## 🚀 快速开始

### 使用方法

1. 打开网页，注册一个账号并登录
2. 点击底部「⚙️ API 设置」，填入你的百炼 API Key 和 Base URL
3. 选择要翻译的方言
4. 输入方言文本，点击「翻译」按钮（或按 Ctrl + Enter）

### API 配置说明

| 配置项 | 说明 |
|--------|------|
| **百炼 API Key** | 在阿里百炼控制台创建的 API Key（sk- 开头） |
| **Base URL** | 百炼 OpenAI 兼容地址，格式：`https://ws-xxx.cn-beijing.maas.aliyuncs.com/compatible-mode/v1` |
| **模型名称** | 默认 `qwen-plus`，可根据需要更换为其他通义系列模型 |

> 💡 获取 API Key：前往 [阿里百炼控制台](https://bailian.console.aliyun.com/) → 模型服务 → API Key 管理

## 🛠️ 本地开发

```bash
# 克隆仓库
git clone https://github.com/Dxw-qy/dialect-translator.git

# 进入目录
cd dialect-translator

# 直接用浏览器打开 index.html 即可
```

## 📦 技术栈

- **前端**：纯 HTML + CSS + JavaScript（零依赖）
- **翻译引擎**：阿里百炼（DashScope）通义千问大模型
- **部署**：GitHub Pages
- **用户存储**：浏览器 localStorage

## 📝 支持方言列表

| 方言 | 英文名称 |
|------|----------|
| 粤语（广东话） | Cantonese |
| 闽南语（福建话） | Minnan / Hokkien |
| 上海话 | Shanghainese |
| 四川话 | Sichuan Dialect |
| 客家话 | Hakka |
| 东北话 | Northeastern Mandarin |
| 北京话 | Beijing Dialect |
| 天津话 | Tianjin Dialect |
| 粤语俗语 | Cantonese Slang |

## 📄 License

MIT License
