#! /usr/bin/env bash

npx swagger-typescript-api generate \
  --path 'http://localhost:3001/swagger-json' \
  --api-class-name='JumperBackend' \
  --name="jumper-backend.ts" \
  --output="src/types/" \
