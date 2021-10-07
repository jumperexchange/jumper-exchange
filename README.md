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


## Main Contributors

- Max Klenk ([GitHub](https://github.com/maxklenk), [LinkedIn](https://www.linkedin.com/in/maxklenk/), [Gitcoin](https://gitcoin.co/maxklenk))
- Adrian Weniger ([GitHub](https://github.com/Addminus), [LinkedIn](https://www.linkedin.com/in/adrian-weniger-8a35b6132/), [Gitcoin](https://gitcoin.co/addminus))
- Philipp Zentner ([GitHub](https://github.com/philippzentner), [LinkedIn](https://www.linkedin.com/in/philippzentner/), [Gitcoin](https://gitcoin.co/philippzentner))
