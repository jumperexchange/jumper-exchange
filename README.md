# Cross Chain Wallet Dashboard

![Screenshot](https://raw.githubusercontent.com/zenkteam/cross-layer-wallet-overview/main/public/icon192.png)

This projects helps you to keep track of your liquidity across chains.

## Used Technologies

### Paywall using [Unlock](https://unlock-protocol.com/)

![unlock](https://user-images.githubusercontent.com/3898310/120112229-47827b00-c175-11eb-9e14-e6ebafab1e60.png)

We have integrated a paywall using Unlock, to make users pay if they want to view multiple wallets at the same time.

### Social Proof Notification based on data from [theGraph](https://thegraph.com/explorer/subgraph/unlock-protocol/unlock)

![social-proof](https://user-images.githubusercontent.com/3898310/120111996-5288db80-c174-11eb-9114-53f7d315cbd5.png)

To increase the willingness to pay, we show little social proof notifications about other users who bought the upgrade. We get those information from theGraph and show users a link to etherscan so they can check that the notifications are not fake.

### Hosting via IPFS using [Textile Buckets](https://docs.textile.io/buckets/) and [Cloudflare](https://www.cloudflare.com/)

```
https://dashboard-textile.cryptopixels.org/
                \/
  TXT _dnslink dnslink=/ipns/bafz...xvjq
      CNAME gateway-int.ipfs.io
                \/
    Textile Bucket (IPFS + IPNS)
```
The Website is hosted decentral using a textile bucket, which we make more accessible via a custom domain by integration Cloudflare CDN.

Setup:
- Textile provides a custom url for your bucket, based on the ipns name of your bucket ([ipns].textile.space):
  https://bafzbeia3zldi5h554pjqicc35krfylfpw3xvwrluwc4bh3zqio62lfxvjq.textile.space/
- To serve your files via a cloudflare, you have to set the following DNS entries:
```
TXT    _dnslink.subdomain = dnslink=/ipns/bafzbeia3zldi5h554pjqicc35krfylfpw3xvwrluwc4bh3zqio62lfxvjq
CNAME        subdomain    = gateway-int.ipfs.io
```

### Wallet Balances via different RPCs



### Coin Prices via [Coingecko](https://www.coingecko.com/)





## Setup

Use [nvm](https://github.com/nvm-sh/nvm) to run the app with an up-to-date node verion: `nvm use`.

[EditorConfig](https://editorconfig.org/) defines basic formatting, use a [plugin](https://editorconfig.org/#download) for your IDE.

```
yarn install
yarn start
```

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


## Contributors

- Max Klenk ([GitHub](https://github.com/maxklenk), [LinkedIn](https://www.linkedin.com/in/maxklenk/), [Gitcoin](https://gitcoin.co/maxklenk))
- Adrian Weniger ([GitHub](https://github.com/Addminus), [LinkedIn](https://www.linkedin.com/in/adrian-weniger-8a35b6132/))
- Philipp Zentner ([GitHub](https://github.com/philippzentner), [LinkedIn](https://www.linkedin.com/in/philippzentner/), [Gitcoin](https://gitcoin.co/philippzentner))
