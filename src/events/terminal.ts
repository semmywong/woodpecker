/*
 * @Author: Semmy Wong
 * @Date: 2023-02-21 13:10:36
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-06-08 14:14:23
 * @Description: 描述
 */
import * as vscode from 'vscode';
import { ServerNode } from '../ServerNode';
import localize from '../localize';

let loading = false;

/**
 * 上传事件
 * @param serverNode
 */
export const terminal = (serverNode: ServerNode) => {
  const { config } = serverNode;
  if (!config.privateKey) {
    vscode.window.showInformationMessage(
      localize('ext.terminal.needPrivateKeyCertificate'),
      localize('common.titleTip'),
    );
    return;
  }
  const bash = vscode.window.createTerminal({ name: serverNode.label, hideFromUser: true });
  bash.sendText(`ssh -i ${config.privateKey} ${config.username}@${config.host}`);
  bash.show();
};
