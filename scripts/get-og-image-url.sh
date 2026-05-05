#!/usr/bin/env bash

url=$(curl -sS http://localhost:3000/organize-react-projects \
  | rg -o 'http://localhost:3000/organize-react-projects/opengraph-image-[^" ]+' \
  | head -n 1)

if [[ -z "$url" ]]; then
  echo "No OG image URL found." >&2
  exit 1
fi

echo "$url"
open "$url"
