/*
 * @Author: Semmy Wong
 * @Date: 2023-02-21 13:10:36
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-01-04 18:15:56
 * @Description: 描述
 */
import * as vscode from 'vscode';
import { ServerNode } from '../ServerNode';
import { Deploy } from '../deploy';
import localize from '../localize';

let loading = false;

export const tasks: ServerNode[] = [];

/**
 * 上传事件
 * @param serverNode
 */
export const upload = (serverNode: ServerNode) => {
  if (!serverNode) {
    return;
  }
  if (loading) {
    const { name, host } = serverNode.config;
    vscode.window.showInformationMessage(
      localize('ext.deploy.deployTask', name, host, String(tasks.length + 1)),
      localize('common.titleTip'),
    );
    return;
  }
  loading = true;
  new Deploy(serverNode.config, serverNode.workspaceRoot, () => {
    const task = tasks.shift();
    loading = false;
    task && upload(task);
  });
};
