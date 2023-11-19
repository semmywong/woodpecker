/*
 * @Author: Semmy Wong
 * @Date: 2023-02-21 17:29:03
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-11-19 22:43:30
 * @Description: 单个服务器节点
 */
import * as path from 'path';
import * as vscode from 'vscode';

export class ServerNode extends vscode.TreeItem {
  public type: string = 'server';
  constructor(
    public readonly label: string,
    private readonly version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly config: ServerNodeConfigItem,
    public readonly workspaceRoot: string,
    public readonly command?: vscode.Command,
  ) {
    super(label, collapsibleState);

    this.tooltip = `${this.label}(${this.version})`;
    this.description = this.version;
  }

  iconPath = {
    light: path.join(__filename, '..', '..', 'resources', 'server_light.svg'),
    dark: path.join(__filename, '..', '..', 'resources', 'server_dark.svg'),
  };

  contextValue = 'SERVER_NODE';
}
