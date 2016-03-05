var pokedata = {
	"moves": {
		"tackle": {
			"name": "Tackle",
			"damage": 40,
			"type": "normal"
		},
		"thundershock": {
			"name": "ThunderShock",
			"damage": 50,
			"type": "electric"
		}
	},
	"pokemon": {
		"pikachu": {
			"name": "Pikachu",
			"type": "electric",
			"moves": [
				["tackle"],
				["tackle", "thundershock"]
			],
			"hp": 35,
			"atk": 55,
			"def": 40,
			"spa": 50,
			"spd": 50,
			"spe": 90
		},
		"rattata": {
			"name": "Rattata",
			"type": "normal",
			"moves": [
				["tackle"]
			],
			"hp": 30,
			"atk": 56,
			"def": 35,
			"spa": 25,
			"spd": 35,
			"spe": 72
		}
	}
};