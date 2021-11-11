# Coding Style Guide

This document describes coding standards for `lifi-web`

## Overview

Guidelines are based on few principles:

1. Explicit is better than Implicit
2. Clear is better than Clever
3. API should be easy to use, but hard to misuse
4. You write code once, but read multiple times
5. Premature optimization is the root of all evil
6. Modularity

## Instructions

### Naming

1. Boolean variables should be prefixed with `is`, `should`, `are` as appropriate
2. Event handler names should start with `on` or `handle`. Examples: `onPageChange`, `handlePageChange`
3. State naming conventions with React hooks (i.e. useState)
   props naming: do not use verbs to define actions

### Coding guidelines

1. Optimise for code to be read, not written
2. Prefer `function` for declaring functions over arrow syntax `() => {}`. Use arrow syntax for one-liners when you don't need to specify `return` keyword
3. Use `const` for variable declaration unless you need have mutable variable
4. Avoid global state
