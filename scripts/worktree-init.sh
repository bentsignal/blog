NEW_WT="$PWD"
MAIN_REPO="$(dirname "$(git rev-parse --path-format=absolute --git-common-dir 2>/dev/null)")"
if [ -n "$MAIN_REPO" ] && [ "$MAIN_REPO" != "$NEW_WT" ]; then
  cd "$MAIN_REPO"
  for f in .env .env.local; do
    if [ -f "$f" ]; then
      cp "$f" "$NEW_WT/$f"
      echo "copied $f"
    fi
  done
  cd "$NEW_WT"
fi

ni

WT_NAME="$(basename "$NEW_WT" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | sed 's/^-*//;s/-*$//')"
PORTLESS_WORKTREE_ID="$(printf '%s\n' "$WT_NAME" | sed -E 's/^.*-([a-f0-9]{8})$/\1/')"

if grep -q '^PORTLESS_WORKTREE_ID=' .env 2>/dev/null; then
  sed -i '' "s|^PORTLESS_WORKTREE_ID=.*|PORTLESS_WORKTREE_ID=$PORTLESS_WORKTREE_ID|" .env
else
  printf '\nPORTLESS_WORKTREE_ID=%s\n' "$PORTLESS_WORKTREE_ID" >> .env
fi
echo "updated PORTLESS_WORKTREE_ID to $PORTLESS_WORKTREE_ID"

nr dev
