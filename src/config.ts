import { readFileSync } from 'node:fs'
import { readJSONSync, writeJsonSync } from 'fs-extra'
import path from 'path'

// const loadWxconfig = (cwd): void => {
//   try {
//     return require(path.join(cwd, 'wx.config.js'))
//   } catch (e) {
//     // 未配置 wx.config.js 文件，将按照默认配置读取
//     return
//   }
// }

interface Config {
  appid: string
  privateKeyPath: string
  projectPath: string
}
interface Options extends Config {
}

export function getConfig (options?: Options): Config {
  const { projectPath = '' } = options ?? {}
  // 获取project地址
  const projectConfigPath = path.join('project.config.json')
  const data = readFileSync(projectConfigPath, 'utf8')
  const projectInfo = JSON.parse(data)
  // 读数appid,等信息
  const appid = projectInfo.appid
  const privateKeyPath = path.join(`private.${appid}.key`)
  return {
    appid,
    projectPath,
    privateKeyPath
  }
}

export function getPackageVersion (): string {
  const pkg = readJSONSync('./package.json')
  return pkg?.version ?? '1.0.0'
}

export function setPackageVersion (version: string): void {
  const pkg = readJSONSync('./package.json')
  writeJsonSync('./package.json', { ...pkg, version }, { spaces: 2 })
}
