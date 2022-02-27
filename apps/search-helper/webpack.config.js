const path = require('path')
const glob = require('glob')
const CopyPlugin = require('copy-webpack-plugin')
const prettier = require('prettier')

const distScriptDir = './dist/scripts'

let entries = {}

glob.sync('src/**/index.{ts,tsx}').map((filePath) => {
  const name = filePath.split('/').splice(1, 1)[0]
  entries[name.split('.').shift()] = path.join(__dirname, filePath)
})

module.exports = {
  mode: 'production',
  entry: entries,
  output: {
    path: path.join(__dirname, distScriptDir),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: '../',
          transform: (content, _absoluteFrom) => {
            try {
              const json = JSON.parse(content)
              Object.keys(json)
                .filter((key) => /^\/\//.test(key))
                .forEach((key) => delete json[key])
              return prettier.format(JSON.stringify(json), { parser: 'json' })
            } catch (e) {
              console.error(e)
              return content
            }
          }
        },
        {
          from: 'src/options.html',
          to: path.join(__dirname, './dist')
        },
        {
          from: 'src/options.css',
          to: path.join(__dirname, './dist/css')
        }
      ]
    })
  ]
}
