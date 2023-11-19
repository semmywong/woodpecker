/*
 * @Author: Semmy Wong
 * @Date: 2023-02-21 17:29:21
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-11-19 23:19:55
 * @Description: view列表服务器节点列表
 */
import * as vscode from 'vscode';
import { ConfigGroup } from './constants';
import localize from './localize';
import { ServerGroupNode } from './ServerGroupNode';
import { ServerNode } from './ServerNode';

type ServerType = ServerNode | ServerGroupNode;
type ServerConfig = ServerNodeConfigItem | ServerGroupNodeConfigItem;

export class ServerNodeProvider implements vscode.TreeDataProvider<ServerType> {
  // workspaceRoot 当前工作区根路径
  constructor(private workspaceRoot: string, private configGroup: ConfigGroup) {}

  #onDidChangeTreeData: vscode.EventEmitter<ServerType | undefined | void> = new vscode.EventEmitter<
    ServerType | undefined | void
  >();
  readonly onDidChangeTreeData: vscode.Event<ServerType | undefined | void> = this.#onDidChangeTreeData.event;

  getDeployConfig = (): ServerConfig[] => {
    try {
      const inspectConfig = vscode.workspace.getConfiguration('woodpecker').inspect('config');
      const config =
        this.configGroup === ConfigGroup.Global ? inspectConfig?.globalValue : inspectConfig?.workspaceValue;
      return (config as ServerConfig[]) ?? [];
    } catch (error) {
      return [];
    }
  };

  getTreeItem(element: ServerType): vscode.TreeItem {
    return element;
  }

  refresh(): void {
    this.#onDidChangeTreeData.fire();
  }

  private getServerNodes(configs: ServerConfig[]) {
    const serverNodes = configs.map((config: ServerConfig) => {
      if (config.type === 'group') {
        return new ServerGroupNode(config.name, vscode.TreeItemCollapsibleState.Collapsed, config, this.workspaceRoot, {
          title: localize('ext.deploy.packedUpload'),
          command: 'woodpecker.upload',
          tooltip: '',
        });
      } else {
        return new ServerNode(
          config.name,
          config.host,
          vscode.TreeItemCollapsibleState.None,
          config,
          this.workspaceRoot,
          {
            title: localize('ext.deploy.packedUpload'),
            command: 'woodpecker.upload',
            tooltip: '',
          },
        );
      }
    });
    return serverNodes;
  }

  getChildren(element?: ServerType): Thenable<ServerType[]> {
    // element 当前选中的节点， 如果为空则为根节点
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage(localize('ext.deploy.workspaceEmpty'));
      return Promise.resolve([]);
    }

    if (element) {
      if (element.type === 'group') {
        const serverNodes = this.getServerNodes((element.config as ServerGroupNodeConfigItem).children);
        return Promise.resolve(serverNodes);
      }
      return Promise.resolve([]);
    } else {
      const serverNodes = this.getServerNodes(this.getDeployConfig());
      return Promise.resolve(serverNodes);
    }
  }
}
