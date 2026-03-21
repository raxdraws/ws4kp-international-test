import { elemForEach } from './utils/elem.mjs';
import getCurrentWeather from './currentweather.mjs';
import { currentDisplay } from './navigation.mjs';
import { getConditionText } from './utils/weather.mjs';
import settings from './settings.mjs';

// constants
const degree = String.fromCharCode(176);

// local variables
let interval;
let screenIndex = 0;

// start drawing conditions
// reset starts from the first item in the text scroll list
const start = () => {
	// store see if the context is new

	// set up the interval if needed
	if (!interval) {
		interval = setTimeout(incrementInterval, 4000);
	}

	// draw the data
	drawScreen();
};

const stop = (reset) => {
	if (reset) screenIndex = 0;
};

// increment interval, roll over
const incrementInterval = () => {
	// test current screen
	const display = currentDisplay();
	if (!display?.okToDrawCurrentConditions) {
		stop(display?.elemId === 'progress');
		// We still need to keep the loop going!
		clearTimeout(interval);
		interval = setTimeout(incrementInterval, 4000);
		return;
	}
	screenIndex = (screenIndex + 1) % (screens.length);
	// draw new text
	drawScreen();
};

const drawScreen = async () => {
	// get the conditions
	const data = await getCurrentWeather();

	// nothing to do if there's no data yet
	if (!data) return;

	const conditionText = screens[screenIndex](data);

	// If the condition text is empty (e.g. empty ticker text), immediately skip to the next screen
	if (conditionText === '') {
		incrementInterval();
	} else {
		const isTicker = screenIndex === screens.length - 1;
		const duration = drawCondition(conditionText, isTicker);
		clearTimeout(interval);
		interval = setTimeout(incrementInterval, duration);
	}
};

// the "screens" are stored in an array for easy addition and removal
const screens = [
	// station name
	(data) => {
		let sanitizedText = 'Conditions at ';
		// Typically an airport with "International" at the second position
		if (data.city.split(' ').length > 2 && data.city.split(' ')[1].toLowerCase() === 'international') {
			sanitizedText += `${data.city.split(' ')[0]} Intl. ${data.city.split(' ')[2]} `;
		// or a very long city name...this will
		// truncate very long airports too, like
		// "John F. Kennedy International Airport"
		} else if (data.city.length > 20) {
			sanitizedText += `${data.city.slice(0, 18)}...`;
		} else {
			sanitizedText += `${data.city} `;
		}
		return sanitizedText;
	},

	// condition
	(data) => `Condition: ${getConditionText(data.TextConditions)}`,

	// temperature
	(data) => {
		const text = `Temp: ${data.Temperature}${degree}${data.TemperatureUnit}`;
		return text;
	},

	// humidity
	(data) => `Humidity: ${data.Humidity}%   Dewpoint: ${data.DewPoint}${degree}${data.TemperatureUnit}`,

	// barometric pressure
	(data) => `Barometric Pressure: ${data.Pressure} ${data.PressureUnit}`,

	// wind
	(data) => {
		let text = data.WindSpeed > 0
			? `Wind: ${data.WindDirection} ${data.WindSpeed} ${data.WindUnit}`
			: 'Wind: Calm';

		if (data.WindGust > 0) {
			text += `   Gusts to ${data.WindGust}`;
		}
		return text;
	},

	// visibility
	(data) => {
		const distance = `${data.Ceiling} ${data.CeilingUnit}`;
		return `Visib: ${data.Visibility} ${data.VisibilityUnit}   Ceiling: ${data.Ceiling === 0 ? 'Unlimited' : distance}`;
	},

	// custom ticker text
	() => settings.tickerText.value || '',
];

// internal draw function with preset parameters
const drawCondition = (text, isTicker) => {
	let displayDuration = 4000;
	elemForEach('.weather-display .scroll .fixed', (elem) => {
		// Remove old text-layers with exit
		const layers = elem.querySelectorAll('.text-layer');
		layers.forEach((layer) => {
			layer.classList.remove('active');
			layer.classList.add('exit');
			layer.addEventListener('transitionend', () => {
				layer.remove();
			}, { once: true });
		});

		// Create new layer with wrapped content
		const newLayer = document.createElement('div');
		newLayer.className = 'text-layer';
		const content = document.createElement('div');
		content.className = 'text-content';
		content.textContent = text;
		newLayer.appendChild(content);
		elem.appendChild(newLayer);

		// Force reflow
		// eslint-disable-next-line no-void
		void newLayer.offsetWidth;

		// Trigger wipe
		newLayer.classList.add('active');

		if (isTicker) {
			const scrollWidth = content.offsetWidth;
			const containerWidth = elem.offsetWidth;
			if (scrollWidth > containerWidth) {
				content.classList.add('sliding-ticker');
				const scrollTime = (scrollWidth / 150) * 1000; // 150px per sec
				displayDuration = Math.max(4000, scrollTime + 1000);
				// Override standard 0.2s wipe
				content.style.transition = 'none';
				content.style.clipPath = 'inset(0 0% 0 0)';

				// Use transition for sliding instead of keyframes to easily use dynamic values
				content.style.transform = 'translateX(0)';
				// Add a small delay so it's readable before it starts scrolling
				setTimeout(() => {
					content.style.transition = `transform ${scrollTime / 1000}s linear`;
					content.style.transform = `translateX(-${scrollWidth - containerWidth + 20}px)`; // +20px padding
				}, 1000);

			}
		}
	});

	return displayDuration;
};
document.addEventListener('DOMContentLoaded', () => {
	start();
});
