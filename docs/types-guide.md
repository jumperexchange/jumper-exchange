# Guide for @lifinance/types

## Installation

### Step 1
Configure '@lifinance/types' for developing

1. Clone [@lifinance/types](https://github.com/lifinance/types)
2. Open terminal into downloaded `@lifinance/types`
3. Run `yarn` for installing dependencies
4. Run `yarn link` (console should appear)
```
➜  lifi-types git:(main) yarn link
success Registered "@lifinance/types".
info You can now run `yarn link "@lifinance/types"` in the projects
where you want to use this package and it will be used instead.
```
### Step 2
Go to your project lifi-web or lifi-backend and run command `yarn types:link`
<br>
We added script in package.json which run same command `yarn types:link`
```
➜  lifi-backend git:(main) yarn types:link
success Using linked package for "@lifinance/types".
```

## Usage
You are able to run watch mode for `@lifinance/types`.
1. Open terminal into `@lifinance/types`
2. Run command `yarn watch`
```
➜  lifi-types git:(main) yarn watch
$ tsc -w -p ./tsconfig.json
Starting compilation in watch mode...

Found 0 errors. Watching for file changes.
```


## Revert @lifinance/types
If you would like to use the node_module again, run in lifi-backend/web project `yarn types:unlink`
That script is removing link to `@lifinance/types` also re-install package
```
➜  lifi-backend git:(main) yarn types:unlink
$ yarn unlink '@lifinance/types' && yarn types:update
success Removed linked package "@lifinance/types".
```


## Merge request guide when have changes in @lifinance/types

1. Develop types changes locally, as descibed above
1. Create branch in @lifinance/types (e.g. `LF-91-new-step-types`)
1. Link the PR in the `package.json` file of the fronend/backend, so the CI can use the updated types:
    ```
    "@lifinance/types": "github:lifinance/types#LF-91-new-step-types"
    ```
1. Create merge requests for both types and frontend/backend (wait for CI, review)
1. Merging
   1. Release a new version of the types package
   1. Set the new version in the `package.json` of the frontend/backend
1. Unlink @lifinance/types `yarn types:unlink`
1. Test it locally + wait for CI
1. Merge the PR
