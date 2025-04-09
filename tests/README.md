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

## Using Qase Reporter

The project uses [Qase](https://qase.io/) for test management and reporting. To use the Qase reporter:

1. **Setup**:
   - Retrieve your Qase API Token from 1Password
   - The file `/tests/.env.qase` already exists with the required key
   - Enter your API token value in the file (the file is gitignored for security)

2. **Running Tests with Qase**:
   - By default, tests run locally without uploading to Qase
   - To enable Qase reporting, use:
     ```sh
     QASE_MODE=testops npx playwright test
     ```

3. **Viewing Results**:
   - After test execution, results are automatically uploaded to Qase
   - Access the Qase dashboard to view test results, trends, and reports

4. **Configuration**:
   - The Qase reporter is configured in `playwright.config.ts`
   - Test results include screenshots and videos for failed tests
   - Test cases are automatically created/updated in Qase based on test names

## Run tests over VS Code plugin : 
 - Install "Playwright Test for VSCode" extension 
 - Click on the "Test" icon from side bar 
 - Choose the test you want to run and click on the "Play" icon
