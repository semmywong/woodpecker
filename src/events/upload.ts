/*
 * @Author: Semmy Wong
 * @Date: 2023-02-21 13:10:36
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-02-21 18:50:36
 * @Description: 描述
 */
import * as vscode from 'vscode';
import { Deploy } from '../deploy';
import { ServerNode } from '../ServerNode';

let loading = false;

/**
 * 上传事件
 * @param serverNode
 */
export const upload = (serverNode: ServerNode) => {
    if (!serverNode) {
        return;
    }
    if (loading) {
        vscode.window.showInformationMessage(
            `当前已有任务正在进行，请稍后再试`,
            '知道了'
        );
        return;
    }
    loading = true;
    new Deploy(serverNode.config, serverNode.workspaceRoot, () => {
        loading = false;
    });
};
