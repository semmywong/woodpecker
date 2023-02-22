/*
 * @Author: Semmy Wong
 * @Date: 2023-02-21 13:10:36
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-02-21 17:31:13
 * @Description: 工具方法
 */
import chalk = require('chalk');

export const oConsole = {
    log: (...message: any[]) => {
        console.log(...message);
    },
    // 成功信息
    succeed: (...message: any[]) => {
        console.log(...message);
    },
    // 提示信息
    info: (...message: any[]) => {
        console.log(...message);
    },
    // 错误信息
    error: (...message: any[]) => {
        console.error(...message);
    },
    // 下划线重点信息
    underline: (...message: any[]) => {
        return chalk.underline.blueBright.bold(message);
    },
};

export const toArray = (obj: {
    [x: string]: any;
}): { name: string; config: any }[] => {
    const arr = [];
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const element = obj[key];
            arr.push({
                name: key,
                config: Object.assign(
                    { distPath: 'dist', remove: true },
                    element
                ),
            });
        }
    }
    return arr;
};
