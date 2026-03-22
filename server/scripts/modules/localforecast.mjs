// display text based local forecast

import STATUS from './status.mjs';
import WeatherDisplay from './weatherdisplay.mjs';
import { registerDisplay } from './navigation.mjs';
import { generateLocalForecast } from './utils/localForecastTextGenerator.mjs';

// 3 days, morning night; including the current day's morning/night
class LocalForecast extends WeatherDisplay {
	constructor(navId, elemId) {
		super(navId, elemId, 'Local Forecast', true);

		// set timings
		this.timing.baseDelay = 5000;
	}

	async getData(_weatherParameters) {
		if (!super.getData(_weatherParameters)) return;

		try {
			// get today + 2 more days hourly forecasts
			const days = Object.keys(_weatherParameters.forecast).slice(0, 3);
			const daysWeatherData = Object.values(_weatherParameters.forecast).slice(0, 3);

			const localForecastTextByDay = [];

			for (let index = 0; index < daysWeatherData.length; index++) {
				const result = await generateLocalForecast(days[index], daysWeatherData[index].hours, _weatherParameters);
				try {
					localForecastTextByDay.push(JSON.parse(result));
				} catch (e) {
					console.error('Failed to parse local forecast result', e);
					// push a fallback object so it doesn't crash the render
					localForecastTextByDay.push({
						date: days[index],
						periods: {
							morning: { period: 'MORNING', text: 'FORECAST UNAVAILABLE' },
							night: { period: 'NIGHT', text: 'FORECAST UNAVAILABLE' },
						},
					});
				}
			}

			const conditions = [];

			localForecastTextByDay.forEach((forecast) => {
				if (forecast.periods) {
					const page = Object.values(forecast.periods).map((forecastText) => ({
						DayName: forecast.date,
						Text: forecastText.text || '',
					}));
					conditions.push(...page);
				}
			});

			// read each text
			this.screenTexts = conditions.map((condition) => {
				// process the text
				let text = `${condition.DayName.toUpperCase()} `;
				const conditionText = condition.Text;
				text += conditionText.toUpperCase().replace('...', ' ');
				return text;
			});

			// fill the forecast texts
			const templates = this.screenTexts.map((text) => this.fillTemplate('forecast', { text }));
			const forecastsElem = this.elem.querySelector('.forecasts');
			forecastsElem.innerHTML = '';
			forecastsElem.append(...templates);

			// increase each forecast height to a multiple of container height
			this.pageHeight = forecastsElem.parentNode.scrollHeight;
			templates.forEach((forecast) => {
				const newHeight = Math.ceil(forecast.scrollHeight / this.pageHeight) * this.pageHeight;
				forecast.style.height = `${newHeight}px`;
			});

			this.timing.totalScreens = forecastsElem.scrollHeight / this.pageHeight;
			this.calcNavTiming();
			this.setStatus(STATUS.loaded);
		} catch (error) {
			console.error('Error generating Local Forecast', error);
			this.setStatus(STATUS.failed);
		}
	}

	async drawCanvas() {
		super.drawCanvas();

		const top = -this.screenIndex * this.pageHeight;
		this.elem.querySelector('.forecasts').style.top = `${top}px`;

		this.finishDraw();
	}
}

// register display
registerDisplay(new LocalForecast(7, 'local-forecast'));
