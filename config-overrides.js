const { resolve } = require('path')
const { alias, configPaths } = require('react-app-rewire-alias')

module.exports = {
  webpack(config) {
    alias(configPaths('./tsconfig.paths.json'))(config)

    return config
  },

  paths(paths) {
    paths.appIndexJs = resolve('./src/main.tsx')

    return paths
  },

  jest(config) {
    config.moduleNameMapper['^@lifi(.*)$'] = '<rootDir>/src$1'
    config.testTimeout = 15000

    return config
  },
}
