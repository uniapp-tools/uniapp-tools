import prompts from 'prompts'
import os from 'os'
import ci from 'miniprogram-ci'
import { blue, yellow } from 'kolorist'
import { getConfig, getPackageVersion, setPackageVersion } from './config'
import { handleError } from './error'
let result: prompts.Answers<'version' | 'versionType' | 'desc'>
enum UploadType {
  Refactor = 'refactor',
  Feature = 'feature',
  Fix = 'fix'
}
async function init (): Promise<typeof result> {
  try {
    const typeRes = await prompts({
      type: 'select',
      name: 'uploadType',
      message: '请选择更新类型',
      choices: [
        { title: '版本升级', value: UploadType.Refactor },
        { title: '特性更新', value: UploadType.Feature },
        { title: '修复补丁', value: UploadType.Fix }
      ],
      initial: 2
    })
    // 更新版本号
    const updateVersion = updatePackageVersion(getPackageVersion(), typeRes.uploadType)
    result = await prompts([
      {
        type: 'text',
        name: 'version',
        message: '请输入版本号',
        initial: updateVersion
      },
      {
        type: 'toggle',
        name: 'versionType',
        message: '是否体验版本',
        initial: true,
        active: '体验版本',
        inactive: '线上版本'
      },
      {
        type: 'text',
        name: 'desc',
        message: '项目备注'
      }
    ])
  } catch (cancelled: any) {
    console.log('cancelled', cancelled.message)
    return await Promise.reject(cancelled)
  }

  return result
}

function updatePackageVersion (version: string, uploadType: UploadType): string {
  // 去除非数字
  version = version.replace(/[^(\d)\\.]/g, '')
  // 默认格式为：1.0.0'
  let versions: number[] = version.split('.').map((v, i): number => Number(v ?? (i === 0 ? 1 : 0)))
  if (versions.length !== 3) {
    console.log(yellow('包版本格式不正确，将自动校准版本号,默认格式为：1.0.0'))
    versions = versions.slice(0, 3)
  }
  switch (uploadType) {
    case UploadType.Refactor:
      versions[0]++
      versions[1] = 0
      versions[2] = 0
      break
    case UploadType.Feature:
      versions[1]++
      versions[2] = 0
      break
    default:
      versions[2]++
      break
  }
  console.log(blue(`更新包：${version} to ${versions.join('.')}`))
  // setPackageVersion()
  return versions.join('.')
}

export async function main (): Promise<void> {
  await init().then((result) => {
    // console.log('config', getConfig())
    console.log('result', result)
    const { version, versionType, desc } = result
    setPackageVersion(version)
    // const { appid, projectPath, privateKeyPath } = getConfig()
    // // console.log('threads', threads)
    // // // 注意： new ci.Project 调用时，请确保项目代码已经是完整的，避免编译过程出现找不到文件的报错。
    // const project = new ci.Project({
    //   appid,
    //   type: 'miniProgram', // 显示指明当前的项目类型, 默认为 miniProgram，有效值 miniProgram/miniProgramPlugin/miniGame/miniGamePlugin
    //   projectPath, // 打包后的路径 (⚠️修改)
    //   privateKeyPath, // 微信公众平台密钥，建议放项目根目录 (⚠️修改)
    //   ignores: ['node_modules/**/*']
    // })
    // // 获取cpu线程数
    // const threads = os.cpus().length
    // const uploadResult = await ci.upload({
    //   project,
    //   version,
    //   desc,
    //   // robot 1-30
    //   // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    //   robot: versionType ? 1 : 2,
    //   threads,
    //   // #编译设置
    //   setting: {
    //     es6: true, // 对应小程序开发者工具的 "es6 转 es5"
    //     es7: true, // 对应小程序开发者工具的 "增强编译"
    //     minifyJS: true,
    //     minifyWXML: true,
    //     minifyWXSS: true,
    //     minify: true,
    //     codeProtect: false, // https://developers.weixin.qq.com/miniprogram/dev/devtools/project.html#%E6%9C%AC%E5%9C%B0%E8%AE%BE%E7%BD%AE
    //     autoPrefixWXSS: true
    //   },
    //   // 进度更新监听函数
    //   onProgressUpdate: console.log
    // })
    // console.log(uploadResult)
  }).catch(handleError)
}
