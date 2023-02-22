/*
 * @Author: Semmy Wong
 * @Date: 2023-02-21 17:29:03
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-02-21 19:04:28
 * @Description: 单个服务器节点
 */
import * as path from 'path';
import * as vscode from 'vscode';
import type { ServerNodeConfigItem } from './ServerNodeProvider';

export class ServerNode extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        private readonly version: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly config: ServerNodeConfigItem,
        public readonly workspaceRoot: string,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);

        this.tooltip = `服务器：${this.label} 地址：${this.version}`;
        this.description = this.version;
    }

    iconPath = {
        light: path.join(
            __filename,
            '..',
            '..',
            'resources',
            'server_light.svg'
        ),
        dark: path.join(__filename, '..', '..', 'resources', 'server_dark.svg'),
    };

    contextValue = 'SERVER_NODE';
}
