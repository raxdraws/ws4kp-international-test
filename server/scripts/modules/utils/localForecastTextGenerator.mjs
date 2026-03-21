import advancedConfigs from './advancedConfig.mjs';
import { directionToNSEW } from './calc.mjs';

import ConversionHelpers from './conversionHelpers.mjs';

async function generateLocalForecast(dateStamp, hourlyData, _weatherParameters) {
	if (advancedConfigs.get('useGemini') && advancedConfigs.get('geminiApiKey')) {
		try {
			const prompt = `Write a short local weather forecast for ${dateStamp} morning and night based on this data. Make it sound like a 90s weather channel broadcast. Data: ${JSON.stringify(hourlyData.slice(0, 5))}. Return ONLY valid JSON with structure: {"date": "DAY", "periods": {"morning": {"period": "MORNING", "text": "Forecast here..."}, "night": {"period": "NIGHT", "text": "Forecast here..."}}}`;

			const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${advancedConfigs.get('geminiApiKey')}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
			});

			const data = await response.json();
			if (data.candidates && data.candidates[0].content) {
			    let text = data.candidates[0].content.parts[0].text;
			    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
			    return text;
			}
		} catch (e) {
			console.error("Gemini failed, falling back to local generation", e);
		}
	}

	const dayDate = new Date(dateStamp);
	const dayStr = dayDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

	const dailyData = hourlyData.filter((entry) => new Date(entry.time).toDateString() === dayDate.toDateString());

	const morningForecast = processForecast(dailyData, 'MORNING');
	const nightForecast = processForecast(dailyData, 'NIGHT');

	const forecast = {
		date: dayStr,
		periods: {
			morning: morningForecast,
			night: nightForecast,
		},
	};

	return JSON.stringify(forecast, null, 2);
}

export {
	// eslint-disable-next-line import/prefer-default-export
	generateLocalForecast,
};
