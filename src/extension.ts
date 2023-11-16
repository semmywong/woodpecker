/*
 * @Author: Semmy Wong
 * @Date: 2023-02-21 13:10:36
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-11-16 23:33:18
 * @Description: 插件入口
 */
import * as vscode from 'vscode';
import { ConfigGroup } from './constants';
import { terminal } from './events/terminal';
import { upload } from './events/upload';
import { ServerNodeProvider } from './ServerNodeProvider';

// 激活事件
export function activate(context: vscode.ExtensionContext) {
  const workspaceServerNodeProvider = new ServerNodeProvider(vscode.workspace.rootPath || '', ConfigGroup.wWorkspace);
  vscode.window.registerTreeDataProvider('woodpecker.workspaceServerExplorer', workspaceServerNodeProvider);
  vscode.commands.registerCommand('woodpecker.workspaceRefresh', () => workspaceServerNodeProvider.refresh());

  const userServerNodeProvider = new ServerNodeProvider(vscode.workspace.rootPath || '', ConfigGroup.user);
  vscode.window.registerTreeDataProvider('woodpecker.userServerExplorer', userServerNodeProvider);
  vscode.commands.registerCommand('woodpecker.userRefresh', () => userServerNodeProvider.refresh());

  vscode.commands.registerCommand('woodpecker.upload', upload);
  vscode.commands.registerCommand('woodpecker.terminal', terminal);
}

// 销毁周期
export function deactivate() {}
