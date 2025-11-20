<div align="center">

[![license](https://img.shields.io/github/license/jumperexchange/jumper-exchange)](/LICENSE)
[![Crowdin](https://badges.crowdin.net/jumper-exchange/localized.svg)](https://crowdin.com/project/jumper-exchange)
[![Follow on Twitter](https://img.shields.io/twitter/follow/JumperExchange.svg?label=follow+Jumper.Exchange)](https://twitter.com/JumperExchange)

</div>

# Jumper.Exchange

This is the [jumper.exchange](https://jumper.exchange) repository that gets deployed to `develop.jumper.exchange`, `staging.jumper.exchange` and `jumper.exchange`.

## Getting Started

In the root directory run the following commands to get started:

```sh
pnpm install
```

to install all dependencies, and choose one of these start commands to start the development vite server and to start building packages in watch mode.

```sh
pnpm dev
pnpm dev:local
pnpm dev:staging
pnpm dev:production
```

## Tools

Most recent parts of the code rely on API generated from our backend's swagger configuration. With the backend running locally (on localhost:3001), you can generate the latest version of the API using:

```sh
pnpm api
```

The generated file requires linting, this should be automatic.

## Lint and checks

We use [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/lint-staged/lint-staged) to run checks and linting on your code before you commit.

Husky should be installed automatically when you run `pnpm install`.

### lint-staged

The idea of invoking `tsc --noEmit` from bash instead of yarn comes from here: [github issue](https://github.com/lint-staged/lint-staged/issues/825#issuecomment-674575655)
It fixes some problems we had with lint-staged ignoring our tsconfig and not working properly.

## Contributing Translations

We appreciate your interest in helping translate our project!

If you'd like to contribute translations, please visit our Crowdin project page at [Crowdin Jumper Exchange](https://crowdin.com/project/jumper-exchange) and [Crowdin LI.FI Widget](https://crowdin.com/project/lifi-widget).
Register on Crowdin and you can start translating the project into your preferred language.
Your contributions will help make our project accessible to a wider audience around the world.

Thank you for your support!
