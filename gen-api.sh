#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

BACKEND_SWAGGER_URL=http://localhost:3001/swagger-json

# curl to /tmp/swagger.json
curl -s "$BACKEND_SWAGGER_URL" > /tmp/swagger.json

# Keep endpoints that are public
jq '
  .paths |= with_entries(
    .value |= with_entries(
      select(
        (.value.tags // [] | index("Public"))
        and
        (.value.tags // [] | index("Development") | not)
      )
    )
    | select(.value != {})
  )
' /tmp/swagger.json > /tmp/swagger-filtered.json

# generate api
npx swagger-typescript-api generate \
  --path '/tmp/swagger-filtered.json' \
  --api-class-name='JumperBackend' \
  --name="jumper-backend.ts" \
  --output="src/types/"

# patch generated file with the request parameters
# -0777 slurps the whole file so `or die` fires when the pattern is absent anywhere
perl -i -0777 -pe "s|// \@ts-nocheck|// \@ts-nocheck\nimport config from '\@/config/env-config';| or die \"Patch failed: '// \@ts-nocheck' not found in generated file\\n\"" src/types/jumper-backend.ts
perl -i -0777 -pe "s|headers: \{\},|headers: { Referer: config.NEXT_PUBLIC_SITE_URL },|g or die \"Patch failed: 'headers: {}' not found in generated file\\n\"" src/types/jumper-backend.ts
perl -i -0777 -pe 's|referrerPolicy: "no-referrer"|referrerPolicy: "strict-origin-when-cross-origin"|g or die "Patch failed: '\''referrerPolicy: \"no-referrer\"'\'' not found in generated file\n"' src/types/jumper-backend.ts

# format
npx prettier --write src/types/jumper-backend.ts
