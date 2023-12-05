<div align="center">

[![license](https://img.shields.io/badge/license-Apache%202-blue)](/LICENSE.md)
[![Crowdin](https://badges.crowdin.net/jumper-exchange/localized.svg)](https://crowdin.com/project/jumper-exchange)
[![Follow on Twitter](https://img.shields.io/twitter/follow/JumperExchange.svg?label=follow+Jumper.Exchange)](https://twitter.com/JumperExchange)

</div>

# Jumper.Exchange

This is the [jumper.exchange](https://jumper.exchange) repository that gets deployed to `develop.jumper.exchange`, `staging.jumper.exchange` and `jumper.exchange`.

## Getting Started

In the root directory run the following commands to get started:

```
yarn
```

to install all dependencies, and choose one of these start commands to start the development vite server and to start building packages in watch mode.

```
yarn dev
yarn dev:local
yarn dev:testnet
yarn dev:staging
yarn dev:production
```

Please refer to the following descriptions of the dev serve scripts:

    dev - starts the app using the backend develop stage
    dev:local - starts the app using a locally running backend
    dev:testnet - starts the app in a testnet only mode using the backend staging stage
    dev:staging - starts the app using the backend staging stage
    dev:production - starts the app using the backend production stage

### Husky Scripts

In addition to these commands you should also run

```
yarn husky install
```

if you plan to commit to this repository to use all necessary husky hooks. If you have trouble running a script try modifying the permissions for the scripts with

```
chmod ug+x .husky/
```

to mark them as executables

### lint-staged

small comment on the lint-staged config. The idea of invoking `tsc --noEmit` from bash instead of yarn comes from here: [github issue](https://github.com/lint-staged/lint-staged/issues/825#issuecomment-674575655)
It fixes some problems we had with lint-staged ignoring our tsconfig and not working properly.
