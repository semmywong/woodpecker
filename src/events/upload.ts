/*
 * @Author: Semmy Wong
 * @Date: 2023-02-21 13:10:36
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-06-08 13:31:56
 * @Description: 描述
 */
import * as vscode from 'vscode';
import { ServerNode } from '../ServerNode';
import { Deploy } from '../deploy';
import localize from '../localize';

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
    vscode.window.showInformationMessage(localize('ext.deploy.taskRunning'), localize('common.titleTip'));
    return;
  }
  loading = true;
  new Deploy(serverNode.config, serverNode.workspaceRoot, () => {
    loading = false;
  });
};
