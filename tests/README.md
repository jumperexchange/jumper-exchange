# Playwright E2E Tests

This project uses [Playwright](https://playwright.dev/) for end-to-end (E2E) testing and [`pnpm`](https://pnpm.io/) as the package manager.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (latest LTS version recommended)
- [`pnpm`](https://pnpm.io/installation)

## Installation

Clone the repository and install dependencies using `pnpm`:

```sh
pnpm install
```

## Install Playwright Browsers

After installing dependencies, install the necessary browsers:

```sh
pnpm exec playwright install
```
## Run the local env
```sh
pnpm dev  
```

## Running Tests
```sh 
 npx playwright test --headed 
```


### Run a Specific Test File

```sh
pnpm playwright test <path_to_test_file>
```


## Generating and Viewing Reports

After running tests, view the HTML report:

```sh
pnpm playwright show-report 
```

## Run tests over VS Code plugin : 
 - Install "Playwright Test for VSCode" extension 
 - Click on the "Test" icon from side bar 
 - Choose the test you want to run and click on the "Play" icon
