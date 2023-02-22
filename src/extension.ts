/*
 * @Author: Semmy Wong
 * @Date: 2023-02-21 13:10:36
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-02-21 20:41:19
 * @Description: 插件入口
 */
import * as vscode from 'vscode';
import { upload } from './events/upload';
import { ServerNodeProvider } from './ServerNodeProvider';

// 激活事件
export function activate(context: vscode.ExtensionContext) {
    const serverNodeProvider = new ServerNodeProvider(
        vscode.workspace.rootPath || ''
    );
    vscode.window.registerTreeDataProvider('woodpecker', serverNodeProvider);
    vscode.commands.registerCommand('woodpecker.refresh', () =>
        serverNodeProvider.refresh()
    );
    vscode.commands.registerCommand('woodpecker.upload', upload);
}

// 销毁周期
export function deactivate() {}
