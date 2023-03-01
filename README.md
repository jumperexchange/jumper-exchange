# Jumper.exchange

Lerna Monorepo for all jumper.exchange related things

## Basic Usage

In the root directory run the following commands to get started:

```
yarn bootstrap
```

to install all dependencies, and

```
yarn dev
```

to start the development vite server and to start building packages in watch mode.

## Project Structure

### packages/dapp/

This is the jumper.exchange page that gets deployed to `develop.jumper.exchange`, `staging.jumper.exchange` and `jumper.exchange`. This is a vite.js app

### packages/shared/

This is a collection of shared atoms/molecules/organisms that can be used across the entire project to ensure a unified UI/UX

### packages/<other_folders>

NOT EXISTING YET. Sub-apps of the transferto page. These componentized sub-apps will be resuable accross this project and could also be used in different external projects.
