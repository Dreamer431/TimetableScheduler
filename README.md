# 智能课程表管理系统

一个基于 Tauri + React + TypeScript 开发的现代化教务管理系统，专注于班级管理和课程表制作。

## ✨ 功能特性

### 🎯 核心功能
- **项目管理**: 支持多项目管理，每个项目独立配置
- **年级管理**: 完整的年级层级管理，支持年级排序和编辑
- **班级管理**: 班级信息管理，支持批量添加和Excel导入
- **Excel导入**: 标准化Excel模板，一键导入班级数据
- **数据持久化**: 本地JSON存储，数据安全可靠
- **演示数据**: 内置演示数据，快速体验系统功能

### 🔧 技术特性
- **跨平台**: 基于Tauri，支持Windows、macOS、Linux
- **现代化UI**: 使用Ant Design组件库，界面美观易用
- **类型安全**: 全面的TypeScript支持，代码质量保证
- **高性能**: Rust后端提供卓越性能
- **响应式设计**: 支持不同屏幕尺寸，移动端友好

## 🚀 快速开始

### 环境要求
- Node.js 16+
- Rust 1.70+
- 操作系统: Windows 10+, macOS 10.15+, 或 Linux

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
# 启动前端开发服务器（浏览器模式）
npm run dev

# 启动Tauri开发模式（桌面应用，推荐）
npm run tauri dev
```

### 构建应用
```bash
# 构建前端资源
npm run build

# 构建桌面应用
npm run tauri build
```

## 📖 使用指南

### 1. 项目管理
- **创建项目**: 首次使用时创建新的课程表项目
- **项目选择**: 支持多个项目，可随时切换
- **项目配置**: 每个项目独立管理年级和班级信息

### 2. 年级管理
- **添加年级**: 创建新的年级（如高一、高二、高三）
- **年级排序**: 支持上移下移调整年级顺序
- **年级编辑**: 修改年级名称和备注信息
- **年级删除**: 删除年级及其下属所有班级

### 3. 班级管理
- **单个添加**: 为指定年级添加单个班级
- **批量添加**: 使用模板批量创建多个班级
- **班级编辑**: 修改班级信息（班级序号、学生人数、班主任等）
- **班级删除**: 删除指定班级

### 4. Excel导入功能
1. **下载模板**: 点击"下载模板"获取标准Excel格式
2. **填写数据**: 按照模板格式填写年级和班级信息
3. **上传导入**: 选择Excel文件进行导入
4. **数据预览**: 导入前可预览解析的数据
5. **确认导入**: 检查无误后确认导入到系统

### 5. 演示数据
- **快速体验**: 点击"加载演示数据"快速生成示例数据
- **数据内容**: 包含3个年级（高一、高二、高三）和15个班级
- **数据关联**: 演示数据展示完整的年级-班级层级关系

## 🏗️ 项目结构

```
├── src/                    # 前端源码
│   ├── components/         # React组件
│   │   ├── GradeManagement.tsx    # 年级管理组件
│   │   ├── BatchClassModal.tsx    # 批量添加班级模态框
│   │   └── ExcelImportModal.tsx   # Excel导入模态框
│   ├── views/              # 页面组件
│   │   ├── ProjectManager.tsx     # 项目管理页面
│   │   ├── ProjectWizard.tsx      # 项目配置向导
│   │   └── steps/                 # 配置步骤组件
│   │       └── ClassSetup.tsx     # 班级设置页面
│   ├── services/           # 服务层
│   │   ├── projectService.ts      # 项目数据服务
│   │   └── api.ts                 # API接口
│   ├── types/              # TypeScript类型定义
│   │   └── index.ts               # 核心数据模型
│   ├── utils/              # 工具函数
│   │   └── demoData.ts            # 演示数据生成
│   ├── App.tsx             # 主应用组件
│   └── main.tsx            # 应用入口
├── src-tauri/              # Tauri后端
│   ├── src/
│   │   ├── lib.rs                 # 核心业务逻辑
│   │   └── main.rs                # 应用入口
│   ├── Cargo.toml                 # Rust依赖配置
│   └── tauri.conf.json            # Tauri配置
├── public/                 # 静态资源
├── index.html              # 应用入口HTML
├── package.json            # 项目配置
└── vite.config.ts          # Vite构建配置
```

## 🎨 界面预览

### 项目管理界面
- 清晰的项目列表展示
- 项目创建和选择功能
- 项目信息概览（年级数量、班级数量等）

### 年级管理界面
- 折叠面板展示年级层级结构
- 每个年级显示班级数量标签
- 年级操作按钮（上移、下移、编辑、删除）
- 班级列表表格显示详细信息

### Excel导入界面
- 标准化导入流程指引
- 模板下载功能
- 数据预览表格
- 导入结果反馈

## 📊 Excel导入格式

系统支持标准Excel格式导入，模板包含以下列：

| 列名 | 必填 | 说明 | 示例 |
|------|------|------|------|
| 年级 | ✅ | 年级名称 | 高一、高二、高三 |
| 班级序号 | ✅ | 班级在年级中的序号 | 1、2、3 |
| 班级名称 | ✅ | 完整的班级名称 | 高一(1)班 |
| 学生人数 | ⚠️ | 班级学生数量，默认40 | 45、42、38 |
| 班主任 | ⚠️ | 班主任姓名 | 张老师、李老师 |
| 备注 | ⚠️ | 班级备注信息 | 重点班、理科班 |

## 🔧 技术栈

**前端技术**
- React 18 - 用户界面库
- TypeScript - 类型安全的JavaScript
- Ant Design - 企业级UI组件库
- Vite - 现代化构建工具
- XLSX.js - Excel文件处理

**后端技术**
- Rust - 系统编程语言
- Tauri 2.0 - 跨平台应用框架
- Serde - JSON序列化/反序列化
- UUID - 唯一标识符生成

**开发工具**
- ESLint - 代码质量检查
- Prettier - 代码格式化
- Git - 版本控制

## 📝 开发说明

### 数据模型
系统采用层级化数据模型：
```typescript
Project (项目)
├── GradeInfo[] (年级列表)
└── ClassInfo[] (班级列表)
    └── gradeId (关联到年级)
```

### 核心组件架构
- **GradeManagement**: 年级管理主组件，处理年级CRUD操作
- **BatchClassModal**: 批量添加班级模态框
- **ExcelImportModal**: Excel导入功能模态框
- **ProjectService**: 项目数据持久化服务

### 状态管理
- 使用React Hooks进行状态管理
- 项目数据通过props传递
- 本地存储使用JSON格式

## 🚀 部署说明

### 浏览器模式
```bash
npm run build
# 将 dist 目录部署到 Web 服务器
```

### 桌面应用
```bash
npm run tauri build
# 在 src-tauri/target/release/bundle/ 目录找到安装包
```

## 🐛 常见问题

### Q: Excel导入失败怎么办？
A: 请检查Excel文件格式是否正确，确保必填字段（年级、班级序号、班级名称）都有值。

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Tauri](https://tauri.app/) - 跨平台应用框架
- [Ant Design](https://ant.design/) - 企业级UI组件库
- [React](https://reactjs.org/) - 用户界面库
- [Rust](https://www.rust-lang.org/) - 系统编程语言
- [XLSX.js](https://sheetjs.com/) - Excel文件处理库

---

**开发者**: dreamer
**版本**: v0.1.0
**最后更新**: 2025.6.4
