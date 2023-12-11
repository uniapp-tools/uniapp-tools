import fs from 'fs-extra'
import path from 'path'

// const loadWxconfig = (cwd): void => {
//   try {
//     return require(path.join(cwd, 'wx.config.js'))
//   } catch (e) {
//     // 未配置 wx.config.js 文件，将按照默认配置读取
//     return
//   }
// }

export interface ConfigOptions {
  appid?: string
  privateKeyPath?: string
  projectPath?: string
}


export function getConfig (options: ConfigOptions): Required<ConfigOptions> {
  const { projectPath = process.cwd() } = options
  // 获取project地址
  const projectConfigPath = path.join(process.cwd(), 'project.config.json')
  const data = fs.readFileSync(projectConfigPath, 'utf8')
  const projectInfo = JSON.parse(data)
  // 读数appid,等信息
  const appid = projectInfo.appid
  const privateKeyPath = path.join(process.cwd(), `private.${appid}.key`)
  return {
    appid,
    projectPath,
    privateKeyPath
  }
}

export function getPackageVersion (): string {
  const pkg = fs.readJSONSync(path.join(process.cwd(), 'package.json'))
  return pkg?.version ?? '0.0.0'
}

export function setPackageVersion (version: string): void {
  const pkg = fs.readJSONSync(path.join(process.cwd(), 'package.json'))
  fs.writeJsonSync('./package.json', { ...pkg, version }, { spaces: 2 })
}
