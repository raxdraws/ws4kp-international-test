import re

# Update advancedConfig.mjs
with open('server/scripts/modules/utils/advancedConfig.mjs', 'r') as f:
    code = f.read()

code = code.replace("geminiApiKey: '',", "geminiApiKey: '',\n\t\t\towmApiKey: '',\n\t\t\tmeteoredApiKey: '',")

with open('server/scripts/modules/utils/advancedConfig.mjs', 'w') as f:
    f.write(code)

# Update advancedConfigUI.mjs
with open('server/scripts/modules/utils/advancedConfigUI.mjs', 'r') as f:
    code = f.read()

new_fields = """            <label>
                OpenWeatherMap API Key (for Comparator): <input type="text" id="ac-owm-key" style="width:100%;" />
            </label><br/><br/>

            <label>
                Meteored API Key (for Comparator): <input type="text" id="ac-meteored-key" style="width:100%;" />
            </label><br/><br/>
"""

code = code.replace("<label>\n                <input type=\"checkbox\" id=\"ac-enable-meteo\"", new_fields + "\n            <label>\n                <input type=\"checkbox\" id=\"ac-enable-meteo\"")

code = code.replace("document.querySelector('#ac-gemini-key').value = advancedConfigs.get('geminiApiKey') || '';", "document.querySelector('#ac-gemini-key').value = advancedConfigs.get('geminiApiKey') || '';\n        document.querySelector('#ac-owm-key').value = advancedConfigs.get('owmApiKey') || '';\n        document.querySelector('#ac-meteored-key').value = advancedConfigs.get('meteoredApiKey') || '';")

code = code.replace("advancedConfigs.set('geminiApiKey', document.querySelector('#ac-gemini-key').value);", "advancedConfigs.set('geminiApiKey', document.querySelector('#ac-gemini-key').value);\n        advancedConfigs.set('owmApiKey', document.querySelector('#ac-owm-key').value);\n        advancedConfigs.set('meteoredApiKey', document.querySelector('#ac-meteored-key').value);")

with open('server/scripts/modules/utils/advancedConfigUI.mjs', 'w') as f:
    f.write(code)
