# transferto.xyz

Lerna Monorepo for all transferto.xyz related things

## Basic Usage 

In the root directory run the following commands to get started
```
yarn bootstrap
```
to install all dependencies, and

```
yarn start
```

to start the transferto page.


## Project Structure

### packages/transferto/

This is the transferto page that gets deployed to `develop.transferto.xyz`, `staging.transferto.xyz` and `transferto.xyz`. This is a next.js app

### packages/shared/

This is a collection of shared atoms/molecules/organisms that can be used across the entire project to ensure a unified UI/UX

### packages/<other_folders>

NOT EXISTING YET. Sub-apps of the transferto page. These componentized sub-apps will be resuable accross this project and could also be used in different external projects.
