// Handles advanced configurations

const KEY = 'AdvancedConfigs';

class AdvancedConfigs {
	constructor() {
		this.load();
	}

	load() {
		const saved = localStorage.getItem(KEY);
		if (saved) {
			try {
				this.configs = JSON.parse(saved);
			} catch (e) {
				this.configs = this.getDefaults();
			}
		} else {
			this.configs = this.getDefaults();
		}
	}

	save() {
		localStorage.setItem(KEY, JSON.stringify(this.configs));
	}

	getDefaults() {
		return {
			useGemini: false,
			geminiApiKey: '',
			owmApiKey: '',
			meteoredApiKey: '',
			travelCities: '',
			regionalCities: '',
			observationsStations: '',
			enableMeteoChile: false,
			customLogoUrl: '',
		};
	}

	get(key) {
		return this.configs[key];
	}

	set(key, value) {
		this.configs[key] = value;
		this.save();
	}
}

const advancedConfigs = new AdvancedConfigs();
export default advancedConfigs;
