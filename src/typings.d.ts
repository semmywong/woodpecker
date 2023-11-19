/*
 * @Author: Semmy Wong
 * @Date: 2023-11-17 11:43:53
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-11-19 22:42:07
 * @Description: 描述
 */
interface ServerNodeConfig {
  [x: string]: ServerNodeConfigItem;
}

interface ServerNodeConfigItem {
  type: 'server'; // 服务器类型
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
interface ServerGroupNodeConfigItem {
  type: 'group'; // 服务器类型
  name: string; // 服务器组名称
  children: ServerNodeConfigItem[]; // 服务器组列表
}
