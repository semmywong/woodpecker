English | [中文](./README.zh-CN.md)
<p align="center">
  <img src="./media/woodpecker.png" />
</p>
<p align="center">
  Woodpecker(front-end automated integration services)
</p>

Steps to deploy a front-end project in a generic way when developing with a separate front-end and back-end：

1. Upload via Xshell command
2. Upload via filezilla visual interface
3. Script code is uploaded via ssh (you can configure your own business code)
4. Project configuration upload via Jenkins (associated git repository)

The above deployment method, there are shortcomings, but also need to compile in the input command, Jenkins configuration and complex, but also switch to other tools configuration, this extension is to replace the above tools, integrated into vscode, convenient for front-end developers to quickly integrate the deployment

## Features

1. Automatically build and packaged projects
2. Automatic compression
3. Automatic upload server publishing

## usage

1. Search for `Woodpecker` in the vscode extension and click install
2. Open `File->Preferences->Settings`
3. You can choose to go to the `User Settings` or `Workspace Settings`, find the `Extension` Tree node and locate `Woodpecker`, click Edit in `Settings.json`
4. Go to the `Settings.json` file and the following structure will be automatically generated for you

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

5. You can create multiple environments in the array configuration

## FAQ

### Do I need to configure both password and privateKey?

No, if you configure the address path of the key, then you don't need a username and password, otherwise you need a username and password
