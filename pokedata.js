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
        "kick": {
			"name": "Kick",
			"damage": 77,
			"type": "Footy"
		},
         "headbutt": {
			"name": "Headbutt",
			"damage": 5,
			"type": "normal"
		},
         "solve_rubiks_cube": {
			"name": "Solve Rubiks Cube",
			"damage": 111,
			"type": "Mental"
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
<<<<<<< Updated upstream
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
=======
        "trippymon": {
			"name": "Trippymon",
			"type": "steam-powered",
			"moves": [
				["head-butt"],
                ["head-butt", "solve_rubiks_cube"]
			],
			"hp": 10,
			"atk": 2,
			"def": 100,
			"spa": 100,
			"spd": 100,
			"spe": 100
>>>>>>> Stashed changes
		}
	},
    
};