[English](./README.md) | 简体中文
<p align="center">
  <img src="https://raw.githubusercontent.com/semmywong/woodpecker/main/assets/woodpecker.png" />
</p>
<p align="center">
  啄木鸟(前端自动集成服务)
</p>

当前端和后端分离开发时，通用的方式部署前端项目的步骤是：

1. 通过Xshell命令上传
2. 通过filezilla可视化界面上传
3. 脚本代码通过ssh上传（你可以配置自己的业务代码）
4. 项目配置通过Jenkins上传（关联git仓库）

以上的部署方式，有不足之处，还需要在编译时输入命令，Jenkins的配置又比较复杂，还要切换到其他工具配置，这个扩展是为了替代以上工具，集成到vscode中，方便前端开发者快速集成部署

## 功能

1. 自动构建和打包项目
2. 自动压缩
3. 自动上传服务器发布

## 使用方法

1. 在vscode扩展中搜索`Woodpecker`，然后点击安装
2. 打开`文件->首选项->设置`。
3. 你可以选择进入 `用户设置`或 `工作区设置`，找到 `扩展`树节点并找到 `Woodpecker`，点击 `Settings.json`中的编辑。
4. 进入`Settings.json`文件，将自动为你生成以下结构

```json
{
    "name": "开发服务器", // 服务器名称的备注
    "host": "127.0.0.1", // 服务器地址
    "username": "root", // 登录的用户名
    "password": "password", // 登录密码
    "remotePath": "/home/www/admin", // 用于项目上传的服务器文件目录
    "build": "yarn build:test", // 建立已执行的命令
    "distPath": "dist" // 项目被包装成需要上传的目录
}

```

5. 你可以在数组配置里创建多个环境

## FAQ

### 我是否需要同时配置密码和privateKey?

不，如果你配置了密钥的地址路径，那么你就不需要用户名和密码，否则你需要用户名和密码
