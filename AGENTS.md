# AGENTS.md

Guidance for coding agents working in `/Users/shawn/dev/projects/blog`.

## Repository Summary

- This is my blog, built with Next.js

## Required Validation After Changes

At the end of every run, run the following commands in order:

1. `pnpm run lint`
2. `pnpm run typecheck`

If all of these succeed, run:

4. `pnpm run format:fix`

Then summarize changes for the user.

## Preferences

Comments should be kept brief and should only be written when the code doesn't
clearly explain what it is doing. Don't go overboard with them.
