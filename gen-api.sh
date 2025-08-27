#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

BACKEND_SWAGGER_URL=http://localhost:3001/swagger-json

# curl to /tmp/swagger.json
curl -s "$BACKEND_SWAGGER_URL" > /tmp/swagger.json

# Keep endpoints that are public
jq '.paths |= with_entries(select(.value | tojson | contains("\"Public\"")))' /tmp/swagger.json > /tmp/swagger-filtered.json

# generate api
npx swagger-typescript-api generate \
  --path '/tmp/swagger-filtered.json' \
  --api-class-name='JumperBackend' \
  --name="jumper-backend.ts" \
  --output="src/types/"
