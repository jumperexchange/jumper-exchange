<div align="center">

[![license](https://img.shields.io/github/license/jumperexchange/jumper-exchange)](/LICENSE)
[![Crowdin](https://badges.crowdin.net/jumper-exchange/localized.svg)](https://crowdin.com/project/jumper-exchange)
[![Follow on Twitter](https://img.shields.io/twitter/follow/JumperExchange.svg?label=follow+Jumper.Exchange)](https://twitter.com/JumperExchange)

</div>

# Jumper.Exchange

This is the [jumper.exchange](https://jumper.exchange) repository that gets deployed to `develop.jumper.exchange`, `staging.jumper.exchange` and `jumper.exchange`.

## Getting Started

In the root directory run the following commands to get started:

```
pnpm install
```

to install all dependencies, and choose one of these start commands to start the development vite server and to start building packages in watch mode.

```
pnpm dev
pnpm dev:local
pnpm dev:staging
pnpm dev:production
```

Please refer to the following descriptions of the dev serve scripts:

    dev - starts the app using the backend develop stage
    dev:local - starts the app using a locally running backend
    dev:staging - starts the app using the backend staging stage
    dev:production - starts the app using the backend production stage

### Husky Scripts

In addition to these commands you should also run

```
yarn add husky
```

if you plan to commit to this repository please use all necessary husky hooks. If you have trouble running a script try modifying the permissions for the scripts with

```
chmod ug+x .husky/
```

to mark them as executables.

### lint-staged

The idea of invoking `tsc --noEmit` from bash instead of yarn comes from here: [github issue](https://github.com/lint-staged/lint-staged/issues/825#issuecomment-674575655)
It fixes some problems we had with lint-staged ignoring our tsconfig and not working properly.

## Contributing Translations

We appreciate your interest in helping translate our project!

If you'd like to contribute translations, please visit our Crowdin project page at [Crowdin Jumper Exchange](https://crowdin.com/project/jumper-exchange) and [Crowdin LI.FI Widget](https://crowdin.com/project/lifi-widget).
Register on Crowdin and you can start translating the project into your preferred language.
Your contributions will help make our project accessible to a wider audience around the world.

Thank you for your support!
