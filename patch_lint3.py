with open('server/scripts/modules/settings.mjs', 'r') as f:
    code = f.read()

# The error was `Dependency cycle via ./modules/navigation.mjs:8`. Let's see what settings.mjs imports.
# Oh, it's `navigation.mjs` importing `settings.mjs`!
# Well, in `settings.mjs`:
# `import btnNavigateRefreshClick from '../index.mjs';` and `index.mjs` imports `navigation.mjs` which imports `settings.mjs`.
# Let's disable the rule in `navigation.mjs` or `settings.mjs`.

# Just run npm run build to ensure no webpack errors
