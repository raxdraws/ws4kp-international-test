import re

with open('README.md', 'r') as f:
    readme = f.read()

jules_section = """## Use of Artificial Intelligence

This project was extensively analyzed, debugged, and enhanced using **Jules AI**, an advanced AI software engineering agent. Jules AI was utilized to:
- Dynamically build and integrate new application features, such as the customizable sliding ticker, Advanced Configurations UI, and multi-language localization.
- Automate the parsing and restructuring of TrueType/WOFF binary fonts to procedurally generate composite accented characters for international support.
- Autonomously search for, diagnose, and resolve critical repository bugs, including resolving Z-index issues with canvas rendering, fixing broken `setTimeout` asynchronous loops, and patching runtime UI `TypeError` crashes.
- Draft pull requests, generate code documentation, and seamlessly refactor legacy ECMAScript code into modernized modules.
"""

# Replace the previous Gemini-specific AI section if it exists
match = re.search(r'## Use of Artificial Intelligence[\s\S]*?(?=\n##|\Z)', readme)

if match:
    readme = readme.replace(match.group(0), jules_section.strip() + "\n")
else:
    readme += "\n" + jules_section

with open('README.md', 'w') as f:
    f.write(readme)
