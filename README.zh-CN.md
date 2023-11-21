[English](./README.md) | 简体中文
<p align="center">
  <img src="https://raw.githubusercontent.com/semmywong/woodpecker/main/assets/woodpecker.png" />
</p>

<h1 align="center">啄木鸟</h1>
<p align="center">
  <font size="5">前端自动化集成服务</font>
</p>

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/SemmyWong.woodpecker) ![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/SemmyWong.woodpecker) ![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/SemmyWong.woodpecker) ![Visual Studio Marketplace Last Updated](https://img.shields.io/visual-studio-marketplace/last-updated/SemmyWong.woodpecker?style=plastic)

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

* 一台服务器的配置

```json
{
    "name": "develop server", // Remarks of the server name
    "host": "127.0.0.1", // Server Address
    "username": "root", // Log in username
    "password": "password", // Log in password
    "remotePath": "/home/www/admin", // The server file directory for project uploads
    "build": "yarn build:test", // Build the executed command
    "distPath": "dist" // The project is packed with directories that need to be uploaded
}

```

* 如果你有很多服务器，那么你也可以对这些服务器分组管理

```json
[
    {
        "type": "group",
        "name": "group name",
        "children": [
            {
                "name": "develop server", // Remarks of the server name
                "host": "127.0.0.1", // Server Address
                "username": "root", // Log in username
                "password": "password", // Log in password
                "remotePath": "/home/www/admin", // The server file directory for project uploads
                "build": "yarn build:test", // Build the executed command
                "distPath": "dist" // The project is packed with directories that need to be uploaded
            }
        ]
    },
    {
        "name": "develop server", // Remarks of the server name
        "host": "127.0.0.1", // Server Address
        "username": "root", // Log in username
        "password": "password", // Log in password
        "remotePath": "/home/www/admin", // The server file directory for project uploads
        "build": "yarn build:test", // Build the executed command
        "distPath": "dist" // The project is packed with directories that need to be uploaded
    }
]
```

5. 你可以在数组配置里创建多个环境

6. Woodpecker默认会创建两个分组，一个是当前工作区的服务器(只显示工作的settings.json配置)，一个是全局的服务器组(显示用户的settings.json)

## FAQ

### 我是否需要同时配置密码和privateKey?

不，如果你配置了密钥的地址路径，那么你就不需要用户名和密码，否则你需要用户名和密码

### 本地开发环境和服务端开发环境的限制吗？

目前只在本地是window环境，服务器是linux环境下测试过，其他环境没有测试过，如果有问题，可以提issue
