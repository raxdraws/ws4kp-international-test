with open('server/scripts/modules/settings.mjs', 'r') as f:
    code = f.read()

# Fix dependency cycle
# `settings.mjs` imports `btnNavigateRefreshClick` from `../index.mjs`, which imports `settings.mjs`.
# And `settings.mjs` imports `navigation.mjs` through somewhere? No, `navigation.mjs` imports `settings.mjs`.
# We should probably remove `btnNavigateRefreshClick` import if possible, but that would break `experimentalFeaturesChange`.
# For now we can ignore the import/no-cycle or disable it for that line.
import re
code = code.replace("import btnNavigateRefreshClick from '../index.mjs';", "// eslint-disable-next-line import/no-cycle\nimport btnNavigateRefreshClick from '../index.mjs';")
with open('server/scripts/modules/settings.mjs', 'w') as f:
    f.write(code)
