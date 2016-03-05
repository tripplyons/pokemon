var Battle = function (playerpoke, opposing, catchable) {
	this.playerpoke = playerpoke;
	this.opposing = opposing;
	this.catchable = catchable;

	//	console.log()
};

Battle.prototype.draw = function (ctx) {
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvaswidth, canvasheight);
	ctx.drawImage(battlebg, 0, 0);

	ctx.drawImage(this.playerpoke.back, 32, 96);
	ctx.drawImage(this.opposing.front, 300, 32);
	ctx.fillStyle = "#505050";
	ctx.fillRect(264, 136, 200, 64);
	ctx.fillRect(16, 32, 200, 64);
	ctx.fillStyle = "#20D020";
	ctx.fillRect(280, 152, this.playerpoke.hp / this.playerpoke.stats["hp"] * 168, 32);
	ctx.fillRect(32, 48, this.opposing.hp / this.opposing.stats["hp"] * 168, 32);
	ctx.fillStyle = "#F0F0F0";
	ctx.font = "12px monospace";
	ctx.fillText(pokedata["pokemon"][this.playerpoke.name]["name"] + "  LV. " + this.playerpoke.level, 268, 148);
	ctx.fillText(pokedata["pokemon"][this.opposing.name]["name"] + "  LV. " + this.opposing.level, 20, 44);
	ctx.fillStyle = "#5080F0";
	if (this.playerpoke.level < 100) {
		ctx.fillRect(280, 188, this.playerpoke.exp / ((this.playerpoke.level + 1) * (this.playerpoke.level + 1) * (this.playerpoke.level + 1)) * 168, 8)
	}
};

Battle.prototype.update = function () {
	if (keys[ACTION] && !pressingaction) {
		pressingaction = true;
		if (!pickingmove) {
			textbeingshown = null;
			pickingmove = true;
			textbeingshown = "";
			for (var i = 0; i < this.playerpoke.moves.length; i++) {
				textbeingshown += i + 1;
				textbeingshown += ": ";
				textbeingshown += pokedata["moves"][this.playerpoke.moves[i]].name;
				if (i !== this.playerpoke.moves.length - 1) {
					textbeingshown += " | ";
				}
			}
		}
	}
	if (pickingmove) {
		if (keys[ONE] && !pressingone) {
			pressingone = true;
			this.doTurn(0);
		}
		if (this.playerpoke.moves.length > 1 && keys[TWO] && !pressingtwo) {
			pressingtwo = true;
			this.doTurn(1);
		}
		if (this.playerpoke.moves.length > 2 && keys[THREE] && !pressingthree) {
			pressingthree = true;
			this.doTurn(2);
		}
	}
};

Battle.prototype.doTurn = function (moveNo) {
	if (this.playerpoke.stats["spe"] >= this.opposing.stats["spe"]) {
		this.opposing.takeDamage(this.playerpoke, this.playerpoke.moves[moveNo]);
		if (this.opposing.hp !== 0) {
			this.playerpoke.takeDamage(this.opposing, this.opposing.moves[Math.floor(Math.random() * this.opposing.moves.length)]);
			if (this.playerpoke.hp === 0) {
				setstate("overworld");
			}
		} else {
			winlevel = this.opposing.level;
			setstate("overworld");
		}
	} else {
		this.playerpoke.takeDamage(this.opposing, this.opposing.moves[Math.floor(Math.random() * this.opposing.moves.length)]);
		if (this.playerpoke.hp !== 0) {
			this.opposing.takeDamage(this.playerpoke, this.playerpoke.moves[moveNo]);
			if (this.opposing.hp === 0) {
				winlevel = this.opposing.level;
				setstate("overworld");
			}
		} else {
			setstate("overworld");
		}
	}
};