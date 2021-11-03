const { resolve } = require('path')

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        docs: false,
      },
    },
    '@storybook/preset-create-react-app',
    'storybook-addon-styled-component-theme/dist/register',
  ],
  typescript: {
    reactDocgen: 'none',
  },
  webpackFinal(config) {
    config.resolve.alias['@lifi'] = resolve('src')
    return config
  },
}
