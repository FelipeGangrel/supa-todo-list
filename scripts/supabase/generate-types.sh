#!/usr/bin/env bash

source .env.local

echo $SUPABASE_PROJECT_ID

# if types folder doesn't exist, create it
if [ ! -d "./src/types" ]; then
  mkdir ./src/types
fi

pnpm supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > ./src/types/supabase.ts
pnpm lint --fix