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
		},
         "headbutt": {
			"name": "Headbutt",
			"damage": 5,
			"type": "normal"
		}
        
	},
	"pokemon": {
		"pikachu": {
			"name": "Pikachu",
			"type": "electric",
			"moves": [
				["tackle"],
				["tackle", "thundershock"],
                ["tackle", "thundershock", "kick"]
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
		},
		"diglett": {
			"name": "Diglett",
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
		},
		"pidgey": {
			"name": "Pidgey",
			"type": "flying",
			"moves": [
				["tackle"]
			],
			"hp": 40,
			"atk": 45,
			"def": 40,
			"spa": 35,
			"spd": 35,
			"spe": 56
		},
		"eevee": {
			"name": "Eevee",
			"type": "normal",
			"moves": [
				["tackle"]
			],
			"hp": 55,
			"atk": 55,
			"def": 50,
			"spa": 45,
			"spd": 65,
			"spe": 55

		}
	},
    
};