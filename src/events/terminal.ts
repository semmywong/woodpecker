/*
 * @Author: Semmy Wong
 * @Date: 2023-02-21 13:10:36
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-06-08 10:54:03
 * @Description: 描述
 */
import * as vscode from 'vscode';
import { ServerNode } from '../ServerNode';

let loading = false;

/**
 * 上传事件
 * @param serverNode
 */
export const terminal = (serverNode: ServerNode) => {
  // const bash = vscode.window.createTerminal({ name: serverNode.label, hideFromUser: true });
  // bash.show();
  const panel = vscode.window.createWebviewPanel('terminal', 'Terminal', vscode.ViewColumn.One, {});

  const terminal = vscode.window.createTerminal({
    name: 'My Terminal',
  });
  panel.webview.onDidReceiveMessage((message) => {
    if (message.command === 'write') {
      terminal.sendText(message.text);
    }
  });

  panel.webview.html = `
  <html>
  <body>
      <div id="terminal"></div>
      <script>
          const terminal = new Terminal();
          terminal.open(document.getElementById('terminal'));
          const write = function(data) {
              vscode.postMessage({
                  command: 'write',
                  text: data
              });
          };
          terminal.onData(write);
      </script>
  </body>
  </html>
`;
};
