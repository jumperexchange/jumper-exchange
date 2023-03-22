# Guide for @lifi/sdk

## Installation

### Step 1
Configure '@lifi/sdk' for developing

1. Clone [@lifi/sdk](https://github.com/lifinance/sdk)
2. Open terminal into downloaded `@lifi/sdk`
3. Run `yarn` for installing dependencies
4. Run `yarn link` (console should appear)
```
➜  lifi-sdk git:(main) yarn link
success Registered "@lifi/sdk".
info You can now run `yarn link "@lifi/sdk"` in the projects
where you want to use this package and it will be used instead.
```
### Step 2
Go to your project lifi-web and run command `yarn sdk:link`
<br>
We added script in package.json which run same command `yarn sdk:link`
```
➜  lifi-web git:(main) yarn sdk:link
success Using linked package for "@lifi/sdk".
```

## Usage
You are able to run watch mode for `@lifi/sdk`.
1. Open terminal into `@lifi/sdk`
2. Run command `yarn watch`
```
➜  lifi-sdk git:(main) yarn watch
$ tsc -w -p ./tsconfig.json
Starting compilation in watch mode...

Found 0 errors. Watching for file changes.
```


## Revert @lifi/sdk
If you would like to use the node_module again, run in lifi-web project `yarn sdk:unlink`
That script is removing link to `@lifi/sdk` also re-install package
```
➜  lifi-web git:(main) yarn sdk:unlink
$ yarn unlink '@lifi/sdk' && yarn sdk:update
success Removed linked package "@lifi/sdk".
```


## Merge request guide when have changes in @lifi/sdk

1. Develop sdk changes locally, as described above
1. Create branch in @lifi/sdk (e.g. `LF-91-new-step-sdk`)
1. Link the PR in the `package.json` file of the frontend, so the CI can use the updated sdk:
    ```
    "@lifi/sdk": "github:lifinance/sdk#LF-91-new-step-sdk"
    ```
1. Create merge requests for both sdk and frontend (wait for CI, review)
1. Merging
   1. Release a new version of the sdk package
   1. Set the new version in the `package.json` of the frontend
1. Unlink @lifi/sdk `yarn sdk:unlink`
1. Test it locally + wait for CI
1. Merge the PR
