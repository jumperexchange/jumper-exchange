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
pnpm test:install
```

## Run the local env
```sh
pnpm dev  
```

## Building Cache

Build the Synpress cache for wallet setup (required for some tests):

```sh
pnpm build:cache
```

## Qase Test Management Integration

This project integrates with [Qase TestOps](https://qase.io/) for enhanced test reporting and management. To use Qase features, you need to set up your API token.

### Setting up Qase API Token

#### Permanent Setup (Recommended)

**For zsh:**
```sh
echo 'export QASE_TESTOPS_API_TOKEN="your-api-token-here"' >> ~/.zshrc
source ~/.zshrc
```

**For bash:**
```sh
echo 'export QASE_TESTOPS_API_TOKEN="your-api-token-here"' >> ~/.bashrc
source ~/.bashrc
```

#### Local Setup (Current Session Only)

```sh
export QASE_TESTOPS_API_TOKEN="your-api-token-here"
```

### Getting Your Qase API Token

The Qase API token can be found in our 1Password Manager. If you don't have access to it, please contact the QA department for access.

## Running Tests

### Run all tests
```sh
pnpm test
```

### Run tests with headed browser (visible)
```sh
pnpm test:e2e-real
```

### Run tests with Qase reporting
```sh
pnpm test:qase
```

### Run a Specific Test File

```sh
pnpm test <path_to_test_file>
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
