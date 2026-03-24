with open('server/scripts/modules/hazards.mjs', 'r') as f:
    code = f.read()

# Fix 'alert' shadow bug
code = code.replace("const alert = this.checkbox.querySelector('.alert');", "const alertIcon = this.checkbox.querySelector('.alert');")
code = code.replace("if (this.data.length > 0) alert.classList.add('show');", "if (this.data.length > 0) alertIcon.classList.add('show');")
code = code.replace("alert.classList.remove('show');", "alertIcon.classList.remove('show');")

# Remove unused calcSeverity if present
import re
code = re.sub(r'const calcSeverity = \(severity, event\) => \{[\s\S]*?\};\n', '', code)

with open('server/scripts/modules/hazards.mjs', 'w') as f:
    f.write(code)

with open('server/scripts/modules/localforecast.mjs', 'r') as f:
    code = f.read()

# Fix no-plusplus inside loop by replacing `index++` with `index += 1`
code = code.replace("for (let index = 0; index < daysWeatherData.length; index++) {", "for (let index = 0; index < daysWeatherData.length; index += 1) {")

with open('server/scripts/modules/localforecast.mjs', 'w') as f:
    f.write(code)

with open('server/scripts/modules/radar.mjs', 'r') as f:
    code = f.read()

code = code.replace("return leaflet.marker([", "leaflet.marker([")

with open('server/scripts/modules/radar.mjs', 'w') as f:
    f.write(code)
