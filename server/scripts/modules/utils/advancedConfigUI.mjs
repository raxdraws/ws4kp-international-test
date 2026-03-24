import advancedConfigs from './advancedConfig.mjs';

export const createAdvancedConfigUI = () => {
    // Add button and modal
    const button = document.createElement('button');
    button.textContent = 'Advanced Configurations';
    button.id = 'btnAdvancedConfigs';
    button.style.marginTop = '10px';
    button.style.cursor = 'pointer';

    document.querySelector('#settings').appendChild(button);

    // Modal
    const modalHTML = `
        <div id="advancedConfigModal" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:600px; max-height:80vh; overflow-y:auto; background:white; color:black; padding:20px; border:2px solid #333; z-index:9999; box-shadow:0px 0px 10px rgba(0,0,0,0.5);">
            <h2 style="margin-top:0;">Advanced Configurations</h2>

                        <label>
                Custom Logo URL (square image):
                <input type="text" id="ac-custom-logo" style="width:100%;" placeholder="https://example.com/my-logo.png" />
            </label><br/><br/>

            <label>
                <input type="checkbox" id="ac-use-gemini" /> Use Google Gemini for Local Forecast Text
            </label><br/>
            <label>
                Gemini API Key: <input type="password" id="ac-gemini-key" style="width:100%;" />
            </label><br/><br/>

                        <label>
                OpenWeatherMap API Key (for Comparator): <input type="text" id="ac-owm-key" style="width:100%;" />
            </label><br/><br/>

            <label>
                Meteored API Key (for Comparator): <input type="text" id="ac-meteored-key" style="width:100%;" />
            </label><br/><br/>

            <label>
                <input type="checkbox" id="ac-enable-meteo" /> Enable MeteoChile Hazards
            </label><br/><br/>

            <label>
                Custom Travel Cities (JSON array of objects with Name, Latitude, Longitude):
                <textarea id="ac-travel-cities" style="width:100%; height:100px; font-family:monospace;"></textarea>
            </label><br/><br/>

            <label>
                Custom Regional Cities (JSON array of objects with city, lat, lon):
                <textarea id="ac-regional-cities" style="width:100%; height:100px; font-family:monospace;"></textarea>
            </label><br/><br/>

            <label>
                Custom Observation Stations (JSON object of key: {id, city, state, lat, lon}):
                <textarea id="ac-observation-stations" style="width:100%; height:100px; font-family:monospace;"></textarea>
            </label><br/><br/>

            <div style="text-align:right;">
                <button id="ac-save">Save</button>
                <button id="ac-cancel">Cancel</button>
            </div>
        </div>
        <div id="advancedConfigOverlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9998;"></div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.querySelector('#advancedConfigModal');
    const overlay = document.querySelector('#advancedConfigOverlay');

    button.addEventListener('click', () => {
        // Load settings into UI
        document.querySelector('#ac-custom-logo').value = advancedConfigs.get('customLogoUrl') || '';
        document.querySelector('#ac-custom-logo').value = advancedConfigs.get('customLogoUrl') || '';
        document.querySelector('#ac-use-gemini').checked = advancedConfigs.get('useGemini') || false;
        document.querySelector('#ac-gemini-key').value = advancedConfigs.get('geminiApiKey') || '';
        document.querySelector('#ac-owm-key').value = advancedConfigs.get('owmApiKey') || '';
        document.querySelector('#ac-meteored-key').value = advancedConfigs.get('meteoredApiKey') || '';
        document.querySelector('#ac-enable-meteo').checked = advancedConfigs.get('enableMeteoChile') || false;
        document.querySelector('#ac-travel-cities').value = advancedConfigs.get('travelCities') || '';
        document.querySelector('#ac-regional-cities').value = advancedConfigs.get('regionalCities') || '';
        document.querySelector('#ac-observation-stations').value = advancedConfigs.get('observationsStations') || '';

        modal.style.display = 'block';
        overlay.style.display = 'block';
    });

    const closeModal = () => {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    };

    document.querySelector('#ac-cancel').addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    document.querySelector('#ac-save').addEventListener('click', () => {
        // Save
        advancedConfigs.set('customLogoUrl', document.querySelector('#ac-custom-logo').value);
        advancedConfigs.set('useGemini', document.querySelector('#ac-use-gemini').checked);
        advancedConfigs.set('geminiApiKey', document.querySelector('#ac-gemini-key').value);
        advancedConfigs.set('owmApiKey', document.querySelector('#ac-owm-key').value);
        advancedConfigs.set('meteoredApiKey', document.querySelector('#ac-meteored-key').value);
        advancedConfigs.set('enableMeteoChile', document.querySelector('#ac-enable-meteo').checked);
        advancedConfigs.set('travelCities', document.querySelector('#ac-travel-cities').value);
        advancedConfigs.set('regionalCities', document.querySelector('#ac-regional-cities').value);
        advancedConfigs.set('observationsStations', document.querySelector('#ac-observation-stations').value);

        closeModal();
        alert('Advanced configurations saved. Please reload or click Refresh on the player to apply.');
    });
};
