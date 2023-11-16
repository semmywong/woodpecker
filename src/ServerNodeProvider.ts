/*
 * @Author: Semmy Wong
 * @Date: 2023-02-21 17:29:21
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-11-16 23:38:28
 * @Description: view列表服务器节点列表
 */
import * as vscode from 'vscode';
import { ConfigGroup } from './constants';
import localize from './localize';
import { ServerNode } from './ServerNode';

export interface ServerNodeConfig {
  [x: string]: ServerNodeConfigItem;
}

export interface ServerNodeConfigItem {
  name: string; // 服务器名称
  host: string; // 服务器地址
  username: string; // 用户名
  password: string; // 密码
  remotePath: string; // 服务器文件目录
  build?: string; // 构建代码命令
  distPath?: string; // 打包文件夹名称, 默认 dist
  privateKey?: string; // 秘钥地址
  remove?: boolean; // 是否删除远程文件
}

export class ServerNodeProvider implements vscode.TreeDataProvider<ServerNode> {
  // workspaceRoot 当前工作区根路径
  constructor(private workspaceRoot: string, private configGroup: ConfigGroup) {}

  #onDidChangeTreeData: vscode.EventEmitter<ServerNode | undefined | void> = new vscode.EventEmitter<
    ServerNode | undefined | void
  >();
  readonly onDidChangeTreeData: vscode.Event<ServerNode | undefined | void> = this.#onDidChangeTreeData.event;

  getDeployConfig = (): ServerNodeConfigItem[] => {
    try {
      const inspectConfig = vscode.workspace.getConfiguration('woodpecker').inspect('config');
      const config = this.configGroup === ConfigGroup.user ? inspectConfig?.globalValue : inspectConfig?.workspaceValue;
      return (config as ServerNodeConfigItem[]) ?? [];
    } catch (error) {
      return [];
    }
  };

  getTreeItem(element: ServerNode): vscode.TreeItem {
    return element;
  }

  refresh(): void {
    this.#onDidChangeTreeData.fire();
  }

  getChildren(element?: ServerNode): Thenable<ServerNode[]> {
    // element 当前选中的节点， 如果为空则为根节点
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage(localize('ext.deploy.workspaceEmpty'));
      return Promise.resolve([]);
    }

    if (element) {
      return Promise.resolve([]);
    } else {
      const configList = this.getDeployConfig().map((config: any) => {
        return new ServerNode(config.name, config.host, 0, config, this.workspaceRoot, {
          title: localize('ext.deploy.packedUpload'),
          command: 'woodpecker.upload',
          tooltip: '',
        });
      });
      return Promise.resolve(configList);
    }
  }
}
