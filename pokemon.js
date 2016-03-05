var Pokemon = function (name, level) {
	this.name = name;
	this.level = level;
	this.moves = this.getMoves();
	this.stats = this.getStats();
	this.hp = this.stats["hp"];
	this.front = new Image();
	this.front.src = "pokesprites/" + this.name + ".png";
	this.back = new Image();
	this.back.src = "pokesprites/" + this.name + "-back.png";
	this.exp = 0;
}

Pokemon.prototype.getMoves = function () {
	var possmoves = pokedata["pokemon"][this.name]["moves"];
	var index = Math.floor(this.level / 5);

	if (index >= possmoves.length) {
		return possmoves[possmoves.length - 1];
	}
	return possmoves[index];
}

Pokemon.prototype.getStats = function () {
	var thispoke = pokedata["pokemon"][this.name];

	function calcStat(name) {
		return ((2 * thispoke[name] + 25) * this.level) / 100 + 5
	}

	return {
		"hp": Math.round(((2 * thispoke["hp"] + 25) * this.level) / 100 + 10 + this.level),
		"atk": Math.round(calcStat.apply(this, ["atk"])),
		"def": Math.round(calcStat.apply(this, ["def"])),
		"spa": Math.round(calcStat.apply(this, ["spa"])),
		"spd": Math.round(calcStat.apply(this, ["spd"])),
		"spe": Math.round(calcStat.apply(this, ["spe"]))
	};
}

Pokemon.prototype.takeDamage = function (otherpoke, move) {
	var damage = ((2 * otherpoke.level + 10) / 250) * (otherpoke.stats["atk"] / this.stats["def"]) * pokedata["pokemon"][otherpoke.name]["atk"] + 2;
	if (pokedata["pokemon"][otherpoke.name]["type"] === pokedata["moves"][move]["type"]) {
		damage *= 1.5;
	}
	damage = Math.round(damage);

	this.hp -= damage;
	if (this.hp < 0) {
		this.hp = 0;
	}
	return damage;
}

Pokemon.prototype.getExp = function (expAmount) {
	if(this.level === 100) {
		return;
	}
	this.exp += expAmount;
	while(this.exp >= (this.level+1)*(this.level+1)*(this.level+1)) {
		this.level += 1;
		this.exp -= this.level*this.level*this.level;
	}

	if (this.level >= 100) {
		this.level = 100;
		this.exp = 0;
	}

	this.moves = this.getMoves();
	this.stats = this.getStats();
}