#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

LIMIT_ORDER_SWAGGER_URL="${NEXT_PUBLIC_LIMIT_ORDER_BACKEND_URL:-http://localhost:8080}/openapi/json"

# curl to /tmp/limit-order-swagger.json
curl -s "$LIMIT_ORDER_SWAGGER_URL" > /tmp/limit-order-swagger.json

# generate api
npx swagger-typescript-api generate \
  --path '/tmp/limit-order-swagger.json' \
  --api-class-name='JumperLimitOrder' \
  --name="jumper-limit-order.ts" \
  --output="src/types/"

# patch generated file with the request parameters
# -0777 slurps the whole file so `or die` fires when the pattern is absent anywhere
perl -i -0777 -pe "s|// \@ts-nocheck|// \@ts-nocheck\nimport config from '\@/config/env-config';| or die \"Patch failed: '// \@ts-nocheck' not found in generated file\\n\"" src/types/jumper-limit-order.ts
perl -i -0777 -pe "s|headers: \{\},|headers: { Referer: config.NEXT_PUBLIC_SITE_URL },|g or die \"Patch failed: 'headers: {}' not found in generated file\\n\"" src/types/jumper-limit-order.ts
perl -i -0777 -pe 's|referrerPolicy: "no-referrer"|referrerPolicy: "strict-origin-when-cross-origin"|g or die "Patch failed: '\''referrerPolicy: \"no-referrer\"'\'' not found in generated file\n"' src/types/jumper-limit-order.ts

# format
npx prettier --write src/types/jumper-limit-order.ts
