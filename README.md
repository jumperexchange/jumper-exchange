# Li.Finance

What we are aiming at (blue parts are already implemented):

![Screenshot](./src/assets/lifi_overview.jpg?raw=true)


## Setup

Use [nvm](https://github.com/nvm-sh/nvm) to run the app with the latest node version you have installed run: `nvm use`. Version `16` works great, install it using `nvm install 16`.

[EditorConfig](https://editorconfig.org/) defines basic formatting, use a [plugin](https://editorconfig.org/#download) for your IDE.

```sh
# install dependencies
yarn install

# server local development version
# > li.finance
yarn start
# > xpollinate.io
yarn start:xpollinate
# > testnet.xpollinate.io
yarn start:xpollinate:testnet
```

> If you are on windows or if you have problems running the `start` commands, please try to run `yarn windows` and create a local `.env.local` file to define your environment (e.g. if you want to use xpollinate, copy one of the xpollinate files)

The setup includes [antd](https://ant.design/components/overview/) for styled components.

The setup is based on [create-react-app](https://create-react-app.dev/).


## Environment Variables

All variable names have to start with `REACT_APP_` to be available within react.

Use `.env` for default config variabels used on all environments.
Use `.env.development` and `.env.production` for environment specific configuration.
Create a local `.env.local` file if you want to test additional settings locally (e.g. run a semi production version).

The .env files are loaded [automatically](https://create-react-app.dev/docs/adding-custom-environment-variables/), but changing variables will require you to restart `yarn start`.


## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn test unit`

Executes the unit tests. Unit tests should only test one component and mock others.

### `yarn test int`

Executes the integration tests. These tests do access more of the stack, e.g. they query external API. Since we can't ensure that the external resources are available all the time, these tests may sometimes fail.


## Guide for @lifinance/sdk

Follow the linked [Readme](https://github.com/lifinance/lifi-web/blob/develop/docs/sdk-guide.md) if you need changes in [@lifinance/sdk](https://github.com/lifinance/sdk) package.


## Deployment

Pushing code to the repository automatically triggers deployments to several environments:

Branch `main`:
- https://li.finance/ (with `.env.lifinance-mainnet` configuration)
- https://xpollinate.io/ (with `.env.xpollinate-mainnet` configuration)
- https://testnet.xpollinate.io/ (with `.env.xpollinate-testnet` configuration)

Branch `develop`:
- https://staging.li.finance/ (with `.env.lifinance-mainnet.staging` configuration)
- https://staging.xpollinate.io/ (with `.env.xpollinate-mainnet.staging` configuration)
- https://staging-testnet.xpollinate.io/ (with `.env.xpollinate-testnet.staging` configuration)

Branchs `testing/*`:
- https://testing.xpollinate.io/ (with `.env.xpollinate-mainnet.staging` configuration)
- https://testing.li.finance/ (with `.env.lifinance-mainnet.staging` configuration)


## Main Contributors

- Max Klenk ([GitHub](https://github.com/maxklenk), [LinkedIn](https://www.linkedin.com/in/maxklenk/), [Gitcoin](https://gitcoin.co/maxklenk))
- Adrian Weniger ([GitHub](https://github.com/Addminus), [LinkedIn](https://www.linkedin.com/in/adrian-weniger-8a35b6132/), [Gitcoin](https://gitcoin.co/addminus))
- Philipp Zentner ([GitHub](https://github.com/philippzentner), [LinkedIn](https://www.linkedin.com/in/philippzentner/), [Gitcoin](https://gitcoin.co/philippzentner))
# contracts
