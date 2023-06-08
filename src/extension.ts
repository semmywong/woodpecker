/*
 * @Author: Semmy Wong
 * @Date: 2023-02-21 13:10:36
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-06-08 10:21:54
 * @Description: 插件入口
 */
import * as vscode from 'vscode';
import { ServerNodeProvider } from './ServerNodeProvider';
import { terminal } from './events/terminal';
import { upload } from './events/upload';

// 激活事件
export function activate(context: vscode.ExtensionContext) {
  const serverNodeProvider = new ServerNodeProvider(vscode.workspace.rootPath || '');
  vscode.window.registerTreeDataProvider('woodpecker', serverNodeProvider);
  vscode.commands.registerCommand('woodpecker.refresh', () => serverNodeProvider.refresh());
  vscode.commands.registerCommand('woodpecker.upload', upload);
  vscode.commands.registerCommand('woodpecker.terminal', terminal);
}

// 销毁周期
export function deactivate() {}
