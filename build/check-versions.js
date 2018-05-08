'use strict'
//定义控制台日志的输入样式
const chalk = require('chalk')
//加载语义化版本测试库
const semver = require('semver')
//引入package.json文件
const packageConfig = require('../package.json')
//插件是shelljs 执行*nix系统命令
const shell = require('shelljs')

function exec (cmd) {
  //脚本可以通过child_process模块新建子进程 从而执行unix系统命令
  //require("child_process")调用nodejs子进程
  //execSync同步的exec方法执行command
  return require('child_process').execSync(cmd).toString().trim()
}

const versionRequirements = [
  {
    name: 'node',
    //process.version是当前使用的node版本信息
    //semver.clean(' v=1.2.3')返回1.2.3
    //semver.clean格式化返回当前使用的node版本信息
    currentVersion: semver.clean(process.version),
    //从package.json读取node版本最低要求
    versionRequirement: packageConfig.engines.node
  }
]

if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    //自动调用npm --version命令 并且把参数返回给exec函数 从而获取纯净的版本号
    currentVersion: exec('npm --version'),
    //从package.json读取npm版本要求
    versionRequirement: packageConfig.engines.npm
  })
}

module.exports = function () {
  const warnings = []

  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]

    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()

    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }

    console.log()
    process.exit(1)
  }
}
