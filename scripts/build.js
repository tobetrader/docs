'use strict'

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const { mdDirectory, buildDirectory, mdDataFile, resolveDirectory, distDirectory, rootDirectory } = require('./paths')

const excludes = ['.git', 'README.md']

const copys = ['api_templates']

const CONVERT_FILE_SUFFIX = '.md'

function convert (dirPath) {
  const dirs = fs.readdirSync(dirPath)
  dirs.forEach(dir => {
    if (!excludes.includes(dir)) {
      let relativeParentDirPath = (dirPath.split(mdDirectory))[1]
      if (relativeParentDirPath) {
        relativeParentDirPath = relativeParentDirPath.substr(1)
      }
      const parentDirPath = path.resolve(buildDirectory, relativeParentDirPath)
      if (!fs.existsSync(parentDirPath)) {
        fs.mkdirSync(parentDirPath)
      }

      const p = path.resolve(dirPath, dir)
      const dirInfo = fs.statSync(p)
      if (dirInfo.isDirectory()) {
        convert(p)
      } else if (dirInfo.isFile() && dir.match(CONVERT_FILE_SUFFIX)) {
        const fileName = dir.split('.')[0] || 'template'
        const text = fs.readFileSync(p, 'utf-8')
        const buildFilePath = path.resolve(parentDirPath, `${fileName}.json`)
        fs.writeFileSync(buildFilePath, JSON.stringify({ result: text }), 'utf-8')
      }
    }
  })
}

function copy () {
  copys.forEach(file => {
    fs.cpSync(
      resolveDirectory(file, rootDirectory),
      resolveDirectory(file, distDirectory),
      { force: true, recursive: true }
    )
  })
}

function deleteDir (dirPath) {
  if (fs.existsSync(dirPath)) {
    const dirs = fs.readdirSync(dirPath)
    dirs.forEach(dir => {
      const p = path.resolve(dirPath, dir)
      if (fs.statSync(p).isDirectory()) {
        deleteDir(p)
      } else {
        fs.unlinkSync(p)
      }
    })
    fs.rmdirSync(dirPath)
  }
}

function build () {
  deleteDir(distDirectory)
  if (!fs.existsSync(distDirectory)) {
    fs.mkdirSync(distDirectory)
  }
  if (!fs.existsSync(buildDirectory)) {
    fs.mkdirSync(buildDirectory)
  }

  convert(mdDirectory)
  console.log(chalk.blue('Convert markdown to html completed!'))

  console.log()

  copy()
  console.log(chalk.blue('Generate data completed!'))

  console.log()

  console.log(chalk.green('Build articles success!'))
}

build()
