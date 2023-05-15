'use strict'

const fs = require('fs')
const path = require('path')

const rootDirectory = fs.realpathSync(process.cwd())

const resolveDirectory = (relativePath, root = rootDirectory) => path.resolve(root, relativePath)

module.exports = {
  resolveDirectory,
  rootDirectory,
  distDirectory: resolveDirectory('dist'),
  mdDirectory: resolveDirectory('src'),
  buildDirectory: path.resolve(resolveDirectory('dist'), 'md'),
  mdDataFile: path.resolve(resolveDirectory('dist'), 'md.json')
}
