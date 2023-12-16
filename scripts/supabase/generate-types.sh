#!/bin/sh

source .env.local

# if types folder doesn't exist, create it
if [ ! -d "./src/types" ]; then
  mkdir ./src/types
fi

npx supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > ./src/types/supabase.ts