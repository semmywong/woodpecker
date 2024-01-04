const fs = require('fs');
const archiver = require('archiver');
const childProcess = require('child_process');
import { NodeSSH } from 'node-ssh';
import * as path from 'path';
import * as vscode from 'vscode';
import localize from './localize';
import { oConsole } from './utils';

const { log, error, succeed, info, underline } = oConsole;

export class Deploy {
  config: ServerNodeConfigItem;
  ssh: NodeSSH;
  workspaceRoot: string;
  taskList: {
    task: () => void | Promise<any>;
    tip: string;
    increment: number;
    async?: boolean;
  }[];
  callback: (success: boolean) => void;
  constructor(config: ServerNodeConfigItem, workspaceRoot: string, callback: (success: boolean) => void) {
    this.config = config;
    this.workspaceRoot = workspaceRoot;
    this.callback = callback;
    this.ssh = new NodeSSH();
    this.taskList = [
      {
        task: this.checkConfig,
        tip: localize('ext.deploy.checkSettings'),
        increment: 0,
        async: false,
      },
      { task: this.execBuild, tip: localize('ext.deploy.pack'), increment: 10 },
      { task: this.buildZip, tip: localize('ext.deploy.packedZip'), increment: 20 },
      { task: this.connectSSH, tip: localize('ext.deploy.connectingServer'), increment: 50 },
      {
        task: this.removeRemoteFile,
        tip: localize('ext.deploy.removeServerFiles'),
        increment: 60,
        async: false,
      },
      {
        task: this.uploadLocalFile,
        tip: localize('ext.deploy.uploadToServer'),
        increment: 70,
      },
      {
        task: this.unzipRemoteFile,
        tip: localize('ext.deploy.unpackZip'),
        increment: 80,
      },
      {
        task: this.disconnectSSH,
        tip: localize('ext.deploy.closedConnection'),
        increment: 90,
        async: false,
      },
      {
        task: this.removeLocalFile,
        tip: localize('ext.deploy.removeLocalZipFile'),
        increment: 100,
        async: false,
      },
    ];
    this.start();
  }
  start = async () => {
    log('--------开始执行-------');
    const { name, host } = this.config;
    const progressOptions = {
      location: vscode.ProgressLocation.Notification,
      title: localize('ext.deploy.uploadServer', name, host),
    };
    vscode.window.withProgress(progressOptions, async (progress, token) => {
      let schedule = '';
      try {
        const { taskList } = this;
        const { length } = taskList;
        for (let i = 0; i < length; i++) {
          const { task, async, tip, increment } = taskList[i];
          progress.report({
            increment,
            message: `${tip}...(${increment}%)`,
          });
          schedule = tip;
          if (async === false) {
            task();
          } else {
            await task();
          }
        }
        log('--------执行成功-------');
        this.callback(true);
        vscode.window.showInformationMessage(
          localize('ext.deploy.uploadSuccess', name, host),
          localize('common.titleTip'),
        );
      } catch (err) {
        this.callback(false);
        vscode.window.showInformationMessage(
          localize('ext.deploy.uploadFail', name, host),
          localize('common.titleTip'),
        );
        error(`${schedule}失败:`);
        error(err);
      }
      return new Promise<void>((resolve) => {
        resolve();
      });
    });
  };
  checkConfig = () => {
    const { host, username, remotePath, distPath } = this.config;
    if (!remotePath) {
      throw new Error(localize('ext.deploy.setRemotePath'));
    }
    if (!username) {
      throw new Error(localize('ext.deploy.setUsername'));
    }
    if (!host) {
      throw new Error(localize('ext.deploy.setHost'));
    }
    if (!distPath) {
      throw new Error(localize('ext.deploy.setDistPath'));
    }
  };
  // 1. 执行打包脚本
  execBuild = () => {
    const { config } = this;
    const { build } = config;
    log(`1. 执行打包脚本：${build}`);
    if (!build) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve, reject) => {
      childProcess.exec(
        `${build}`,
        { cwd: this.workspaceRoot, maxBuffer: 1024 * 1024 * 1024 },
        (e: { message: any } | null) => {
          if (e === null) {
            resolve();
          } else {
            reject(localize('ext.deploy.firstStep.error', e.message));
          }
        },
      );
    });
  };
  // 2. 压缩文件夹
  buildZip = () => {
    const { distPath } = this.config;
    const fileName = `${path.basename(distPath || 'dist') || 'dist'}.tar.gz`;
    if (fs.existsSync(path.join(this.workspaceRoot, fileName))) {
      fs.unlinkSync(path.join(this.workspaceRoot, fileName));
    }
    return new Promise<void>((resolve, reject) => {
      log(`2. 压缩文件夹： ${distPath}`);
      const archive = archiver('tar', {
        zlib: { level: 9 },
        gzip: true,
      }).on('error', (e: any) => {
        error(e);
        reject(localize('ext.deploy.secondStep.error', e.message));
      });
      const output = fs.createWriteStream(path.join(this.workspaceRoot, fileName)).on('close', (e: any) => {
        if (e) {
          reject(localize('ext.deploy.secondStep.error', e));
          process.exit(1);
        } else {
          resolve();
        }
      });

      archive.pipe(output);
      archive.directory(path.join(this.workspaceRoot, distPath ?? 'dist'), false);
      archive.finalize();
    });
  };
  // 3. 连接服务器
  connectSSH = () => {
    const { config } = this;
    log(`3. 连接服务器： ${underline(config.host)}`);
    return new Promise<void>((resolve, reject) => {
      this.ssh
        .connect(config)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(localize('ext.deploy.thirdStep.error', err));
        });
    });
  };
  // 删除远程文件
  removeRemoteFile = async () => {
    const { config } = this;
    const { remotePath } = config;
    const command = `rm -rf ${path.posix.join(remotePath, '*')}`;
    const result = await this.ssh.execCommand(command);
    log(`4. 删除远程文件 ${underline(remotePath)}, 执行命令：${command}, 执行结果：${JSON.stringify(result)}`);
    return result;
  };
  // 上传本地文件
  uploadLocalFile = async () => {
    const { remotePath, distPath } = this.config;
    const fileName = `${path.basename(distPath || 'dist') || 'dist'}.tar.gz`;
    const remoteFile = path.posix.join(remotePath, fileName);

    const result = await this.ssh.putFile(path.join(this.workspaceRoot, fileName), remoteFile, null, {
      concurrency: 1,
    });
    log(`5. 上传打包gzip至远程目录： ${underline(remoteFile)}, 上传结果：${result}`);

    return result;
  };
  // 解压远程文件
  unzipRemoteFile = async () => {
    const { remotePath, distPath } = this.config;
    const fileName = `${path.basename(distPath || 'dist') || 'dist'}.tar.gz`;
    const remoteFile = path.posix.join(remotePath, fileName);
    const command = `tar -xzf ${remoteFile} -C ${remotePath}`;
    const result = await this.ssh.execCommand(command);
    log(`6. 解压远程文件 ${underline(remoteFile)}, 执行命令：${command}, 执行结果：${JSON.stringify(result)}`);
    return result;
  };
  // 删除本地打包文件
  removeLocalFile = () => {
    const { distPath } = this.config;
    const fileName = `${path.basename(distPath || 'dist') || 'dist'}.tar.gz`;
    const localPath = path.join(this.workspaceRoot, distPath ?? 'dist');
    log(`7. 删除本地打包目录: ${underline(localPath)}`);
    const remove = (path: string) => {
      if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file: any) => {
          let currentPath = `${path}/${file}`;
          if (fs.statSync(currentPath).isDirectory()) {
            remove(currentPath);
          } else {
            fs.unlinkSync(currentPath);
          }
        });
        fs.rmdirSync(path);
      }
    };
    remove(localPath);
    fs.unlinkSync(path.join(this.workspaceRoot, fileName));
  };
  // 断开ssh
  disconnectSSH = () => {
    log(`8. 断开服务器`);
    this.ssh.dispose();
  };
}
