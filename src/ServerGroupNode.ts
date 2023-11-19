/*
 * @Author: Semmy Wong
 * @Date: 2023-02-21 17:29:03
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-11-19 23:17:16
 * @Description: 服务器组节点
 */
import * as vscode from 'vscode';

export class ServerGroupNode extends vscode.TreeItem {
  public type: string = 'group';
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly config: ServerGroupNodeConfigItem,
    public readonly workspaceRoot: string,
    public readonly command?: vscode.Command,
  ) {
    super(label, collapsibleState);
    this.tooltip = this.label;
    // this.description = this.label;
  }

  contextValue = 'SERVER_GROUP_NODE';
}
