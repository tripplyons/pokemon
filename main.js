var usingsave = (typeof (Storage) !== "undefined") && localStorage.getItem("playerpokename");


var overworldmusic = new Audio("route-1.mp3");
overworldmusic.play();
overworldmusic.addEventListener("ended", function (e) {
	overworldmusic.play();
}, false);
var battlemusic = new Audio("wild-battle.mp3");
battlemusic.addEventListener("ended", function (e) {
	battlemusic.play();
}, false);

var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;
var ACTION = 4;
var ONE = 5;
var TWO = 6;
var THREE = 7;

var winlevel = null;
var currentbattle = null;
var tilesize = 32;
var money;
var playerpoke;
var playerx;
var playery;
var checkpointx;
var checkpointy;
var playerdir;
var garySprite = new Image();
garySprite.src = "gary.png";
var trainers = [[garySprite, 11, 4, "Hello!", new Pokemon("eevee", 5), false]];
if (usingsave) {
	console.log("USING SAVE");
	money = parseInt(localStorage.getItem("money"));

	playerpoke = new Pokemon(localStorage.getItem("playerpokename"), parseInt(localStorage.getItem("playerpokelevel")), parseInt(localStorage.getItem("playerpokeexp")));

	playerx = parseInt(localStorage.getItem("playerx"));
	playery = parseInt(localStorage.getItem("playery"));

	checkpointx = parseInt(localStorage.getItem("checkpointx"));
	checkpointy = parseInt(localStorage.getItem("checkpointy"));

	playerdir = parseInt(localStorage.getItem("playerdir"));
	console.log(playerdir);
	if (typeof (playerdir) === "undefined" || playerdir == null ||isNaN(playerdir)) {
		console.log("FIX PLAYERDIR");
		playerdir = DOWN;
		console.log(playerdir);
	}
	
	var trainersbeaten = JSON.parse(localStorage.getItem("trainersbeaten"));
	if(typeof (trainersbeaten) !== "undefined" && trainersbeaten != null) {
		console.log("SET TRAINERS BEATEN");
		for(var i=0; i<trainersbeaten.length; i++) {
			trainers[i][5] = trainersbeaten[i];
		}
	}
} else {
	money = 0;

	playerpoke = new Pokemon("pikachu", 5);

	playerx = 7;
	playery = 4;

	checkpointx = 7;
	checkpointy = 4;

	playerdir = DOWN;
}
console.log(playerpoke);
var keys = [
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	false
];
var savecounter = 0;
var savecountdown = 600;
var pickingmove = false;
// [sprite, x, y, text, poke, beaten]
var battlingaftertrainertext = false;
var currenttrainerbattleindex = null;
var oldkeys = keys;
var canvaswidth;
var canvasheight;
var shownTilesWidth;
var shownTilesHeight;
//console.log(playerx, playery);
var waitingforonblocksave = false;
var grasspokes = [
	new Pokemon("rattata", 3),
	new Pokemon("rattata", 4),
	new Pokemon("rattata", 5)
];
//console.log(playerpoke);
var playerscreenx;
var playerscreeny;
var playerstopping = false;
var fps = 60;
var dt = Math.round(1000 / fps);
// DT in Seconds
var dts = dt / 1000;
var playermoving = false;
var playeranim = ["1", "2", "1", "3"];
var pressingaction = false;
var pressingone = false;
var pressingtwo = false;
var pressingthree = false;
var amountperanimframe = 4;
var newarr = [];
for (var i = 0; i < playeranim.length; i++) {
	for (var j = 0; j < amountperanimframe; j++) {
		newarr.push(playeranim[i]);
	}
}
playeranim = newarr;
var currentanimindex = 0;
var state;

var battlebg = new Image();
battlebg.src = "battlebg.png";
var menu = new Image();
menu.src = "menu.png";

var textbeingshown = null;

var directiontable = [
	"u",
	"d",
	"l",
	"r"
];

var playeranimimg = {};
for (var i = 0; i < 4; i++) {
	for (var j = 1; j <= 3; j++) {
		playeranimimg[directiontable[i] + j.toString()] = new Image();
		playeranimimg[directiontable[i] + j.toString()].src = directiontable[i] + j.toString() + ".png";
	}
}

var setstate = function (name) {
	if (state === "battle") {
		for (var i = 0; i < grasspokes.length; i++) {
			grasspokes[i].hp = grasspokes[i].stats["hp"];
		}
		if (winlevel) {
			console.log("WON");
			var oldlevel = playerpoke.level;

			var moneywon = Math.round(winlevel * 5 + (Math.random() * 5 + 8));
			textbeingshown = "Gained $" + moneywon.toString();
			var expearned = Math.round((115 * winlevel) / 7);
			playerpoke.getExp(expearned);

			if (playerpoke.level !== oldlevel) {
				textbeingshown += " and leveled up " + (playerpoke.level - oldlevel).toString() + " level";
				if (playerpoke.level - oldlevel !== 1) {
					textbeingshown += "s";
				}
			}

			textbeingshown += "!";

			money += moneywon;
			if (typeof (currenttrainerbattleindex) !== "undefined") {
				console.log("TRAINER WIN");
				trainers[currenttrainerbattleindex][5] = true;
			}

			winlevel = null;
		} else {
			money = Math.round(money / 2);
			playerx = checkpointx;
			playery = checkpointy;
			playerdir = DOWN;
			playerpoke.hp = playerpoke.stats["hp"];
			textbeingshown = "You lost. Returned to checkpoint.";
		}
		if (typeof (currenttrainerbattleindex) !== "undefined") {
			currenttrainerbattleindex = null;
		}
	}
	if (name === "battle") {
		overworldmusic.pause();
		battlemusic.play();
		pressingaction = keys[ACTION];
		textbeingshown = "A battle has started!";
		pickingmove = false;
		state = "battle";
	}
	if (name === "overworld") {
		battlemusic.pause();
		battlemusic.currentTime = 0;
		overworldmusic.play();
		state = "overworld";
	}
}

document.addEventListener("keydown", function (e) {
	e = e || window.event;
	if (e.keyCode === 38) {
		keys[UP] = true;
	}
	if (e.keyCode === 40) {
		keys[DOWN] = true;
	}
	if (e.keyCode === 37) {
		keys[LEFT] = true;
	}
	if (e.keyCode === 39) {
		keys[RIGHT] = true;
	}
	if (e.keyCode === 32) {
		keys[ACTION] = true;
	}
	if (e.keyCode === 49) {
		keys[ONE] = true;
	}
	if (e.keyCode === 50) {
		keys[TWO] = true;
	}
	if (e.keyCode === 51) {
		keys[THREE] = true;
	}
});
document.addEventListener("keyup", function (e) {
	e = e || window.event;
	if (e.keyCode === 38) {
		keys[UP] = false;
	}
	if (e.keyCode === 40) {
		keys[DOWN] = false;
	}
	if (e.keyCode === 37) {
		keys[LEFT] = false;
	}
	if (e.keyCode === 39) {
		keys[RIGHT] = false;
	}
	if (e.keyCode === 32) {
		keys[ACTION] = false;
		pressingaction = false;
	}
	if (e.keyCode === 49) {
		keys[ONE] = false;
		pressingone = false;
	}
	if (e.keyCode === 50) {
		keys[TWO] = false;
		pressingtwo = false;
	}
	if (e.keyCode === 51) {
		keys[THREE] = false;
		pressingthree = false;
	}
});

var playermovecamerainterval = 0.0625;

window.onload = function () {
	var save = function () {
		console.log("SAVE");
		if (typeof (Storage) !== "undefined") {
			localStorage.setItem("playerpokename", playerpoke.name);
			localStorage.setItem("playerpokelevel", playerpoke.level.toString());
			localStorage.setItem("playerpokeexp", playerpoke.exp.toString());
			localStorage.setItem("playerx", playerx.toString());
			localStorage.setItem("playery", playery.toString());
			localStorage.setItem("money", money.toString());
			localStorage.setItem("checkpointx", checkpointx.toString());
			localStorage.setItem("checkpointy", checkpointy.toString());
			localStorage.setItem("playerdir", playerdir.toString());
			localStorage.setItem("trainersbeaten", JSON.stringify(trainers.map(function (arg) {
				return arg[5];
			})));
		}

		savecounter = savecountdown;
	}
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	canvaswidth = parseInt(getStyle(canvas, "width"));
	canvasheight = parseInt(getStyle(canvas, "height"));
	var tileset = new Image();
	tileset.src = "tiles.png";
	shownTilesWidth = canvaswidth / tilesize;
	shownTilesHeight = canvasheight / tilesize;
	playerscreenx = canvaswidth / 2 - tilesize / 2;
	playerscreeny = canvasheight / 2 - tilesize / 2;


	// TREE:
	//  /\
	//  {}
	//  []
	//
	// TWO TREE TRUNK TO TOP CONNECTOR
	//  ()
	var data = ["}{}{}{}{}{}{}{}{}{}{}{}{}{}{",
				")()()()()()()()()()()()()()(",
				"}{}{}{}{}{}{}{}{}{}{}{}{}{}{",
				")()()()[][][][][][][]()()()(",
			    "}{}{}{}...@......$...{}{}{}{",
			    ")()()()....../\\......()()()(",
			    "}{}{}{}.####.{}.####.{}{}{}{",
			    ")()()().####.().####.()()()(",
			    "}{}{}{}.####.{}.####.{}{}{}{",
			    ")()()().####.[].####.()()()(",
			    "}{}{}{}..............{}{}{}{",
			    ")()()()/\\/\\/\\/\\/\\/\\/\\()()()(",
				"}{}{}{}{}{}{}{}{}{}{}{}{}{}{",
				")()()()()()()()()()()()()()(",
				"}{}{}{}{}{}{}{}{}{}{}{}{}{}{"];

	var datamap = {
		".": new TileType("grass", 1, 0, true),
		"#": new TileType("tallgrass", 2, 0, true),
		"/": new TileType("treetopleft", 3, 0, false),
		"\\": new TileType("treetopright", 4, 0, false),
		"{": new TileType("treemidleft", 3, 1, false),
		"}": new TileType("treemidright", 4, 1, false),
		"[": new TileType("treebottomleft", 3, 2, false),
		"]": new TileType("treebottomright", 4, 2, false),
		"(": new TileType("treebothleft", 5, 0, false),
		")": new TileType("treebothright", 6, 0, false),
		"@": new Sign("Welcome to Pokemon! We have signs!"),
		"$": new Sign("Here is another sign! It is long!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
	};

	var map = new Map(tileset, data, datamap);

	setstate("overworld");

	var trainerat = function (x, y) {
		for (var i = 0; i < trainers.length; i++) {
			if (trainers[i][1] === Math.round(x) && trainers[i][2] === Math.round(y)) {
				return {
					index: i,
					trainer: trainers[i]
				};
			}
		}
		return null;
	}

	var draw = function () {
		if (state === "overworld") {
			ctx.fillStyle = "#000000";
			ctx.fillRect(0, 0, canvaswidth, canvasheight);
			map.draw(ctx);

			for (var i = 0; i < trainers.length; i++) {
				if (trainers[i][2] < playery) {
					ctx.drawImage(trainers[i][0], Math.round((trainers[i][1] - playerx) * tilesize + playerscreenx), Math.round((trainers[i][2] - playery) * tilesize + playerscreeny) - 12);
				}
			}
			ctx.drawImage(playeranimimg[directiontable[playerdir] + playeranim[currentanimindex]], playerscreenx, playerscreeny - 6);

			for (var i = 0; i < trainers.length; i++) {
				if (trainers[i][2] >= playery) {
					ctx.drawImage(trainers[i][0], Math.round((trainers[i][1] - playerx) * tilesize + playerscreenx), Math.round((trainers[i][2] - playery) * tilesize + playerscreeny) - 12);
				}
			}

			ctx.fillStyle = "#202020";
			ctx.font = "32px monospace";
			ctx.fillText("$" + money.toString() + "", 16, 40);
			ctx.fillStyle = "#505050";
			ctx.fillRect(344, 8, 128, 48);
			ctx.fillStyle = "#20D020";
			ctx.fillRect(352, 16, this.playerpoke.hp / this.playerpoke.stats["hp"] * 112, 32);
		} else if (state === "battle") {
			currentbattle.draw(ctx);
		}

		if (textbeingshown) {
			ctx.drawImage(menu, 16, 208);
			ctx.fillStyle = "#202020";
			ctx.font = "12px monospace";
			ctx.fillText(textbeingshown, 48, 236, 384);
		}
	}



	var moveplayer = function () {
		if ((playerdir === UP && playery === 0) ||
			(playerdir === DOWN && playery === map.data.length - 1) ||
			(playerdir === LEFT && playerx === 0) ||
			(playerdir === RIGHT && playerx === map.data[0].length - 1))
			return;
		if ((playerdir === DOWN && trainerat(playerx, Math.floor(playery) + 1)) ||
			(playerdir === UP && trainerat(playerx, Math.ceil(playery) - 1)) ||
			(playerdir === LEFT && trainerat(Math.ceil(playerx) - 1, playery)) ||
			(playerdir === RIGHT && trainerat(Math.floor(playerx) + 1, playery)))
			return;
		if (!((playerdir === DOWN && map.get(playerx, Math.floor(playery) + 1).passable) ||
				(playerdir === UP && map.get(playerx, Math.ceil(playery) - 1).passable) ||
				(playerdir === LEFT && map.get(Math.ceil(playerx) - 1, playery).passable) ||
				(playerdir === RIGHT && map.get(Math.floor(playerx) + 1, playery).passable)))
			return;
		if (playermoving) {
			if (playerdir === UP) {
				playery -= playermovecamerainterval;
			}
			if (playerdir === DOWN) {
				playery += playermovecamerainterval;
			}
			if (playerdir === LEFT) {
				playerx -= playermovecamerainterval;
			}
			if (playerdir === RIGHT) {
				playerx += playermovecamerainterval;
			}

			if (playerx < 0) {
				playerx = 0;
			}
			if (playery < 0) {
				playery = 0;
			}
			if (playerx > map.data[0].length - 1) {
				playerx = map.data[0].length - 1;
			}
			if (playery > map.data.length - 1) {
				playery = map.data.length - 1;
			}
		}
	}

	var onblock = function () {
		return playerx.toPrecision(6) % 1.0 === 0 && playery.toPrecision(6) % 1.0 === 0;
	}

	var directionplayer = function (dir) {
		if (onblock()) {
			if (map.get(playerx, playery).name === "tallgrass" && Math.floor(Math.random() * 7) === 0) {
				var encounter = grasspokes[Math.floor(Math.random(grasspokes.length))];
				currentbattle = new Battle(playerpoke, encounter, true);
				setstate("battle");
			} else {
				playerdir = dir;
			}
		}
	}

	tileset.onload = function () {
		setInterval(function () {
			if (textbeingshown) {
				console.log(textbeingshown);
			}
			draw();

			if (state === "overworld") {
				if (!textbeingshown) {
					if (keys[UP]) {
						directionplayer(UP);
						if (playerdir === UP) {
							playermoving = true;
						}
					} else if (playerdir === UP) {
						playerstopping = true;
					}
					if (keys[DOWN]) {
						directionplayer(DOWN);
						if (playerdir === DOWN) {
							playermoving = true;
						}
					} else if (playerdir === DOWN) {
						playerstopping = true;
					}
					if (keys[LEFT]) {
						directionplayer(LEFT);
						if (playerdir === LEFT) {
							playermoving = true;
						}
					} else if (playerdir === LEFT) {
						playerstopping = true;
					}
					if (keys[RIGHT]) {
						directionplayer(RIGHT);
						if (playerdir === RIGHT) {
							playermoving = true;
						}
					} else if (playerdir === RIGHT) {
						playerstopping = true;
					}


					if (playermoving) {
						currentanimindex++;
						if (currentanimindex === playeranim.length) {
							currentanimindex = 0;
						}
					}

					moveplayer();

					if (onblock()) {
						currentanimindex = 0;
					}

					if (onblock() && playerstopping) {
						playerstopping = false;
						playermoving = false;
					}
				} else {
					if (keys[ACTION] && !pressingaction) {
						pressingaction = true;
						textbeingshown = null;
						if (battlingaftertrainertext) {
							battlingaftertrainertext = false;
							setstate("battle");
						}
					}
				}

				if (playerdir === UP && keys[ACTION] && onblock() && map.get(playerx, playery - 1).name === "sign" && !pressingaction) {
					pressingaction = true;
					textbeingshown = map.get(playerx, playery - 1).text;
				}
				if (!pressingaction && keys[ACTION] && onblock()) {
					if (playerdir === UP && trainerat(playerx, playery - 1)) {
						pressingaction = true;
						var trainer = trainerat(playerx, playery - 1);
						textbeingshown = trainer.trainer[3];
						if (!trainer.trainer[5]) {
							var opposing = trainer.trainer[4];
							currentbattle = new Battle(playerpoke, opposing, false);
							battlingaftertrainertext = true;
							currenttrainerbattleindex = trainer.index;
						}

					}
					if (playerdir === DOWN && trainerat(playerx, playery + 1)) {
						pressingaction = true;
						var trainer = trainerat(playerx, playery + 1);
						textbeingshown = trainer.trainer[3];
						if (!trainer.trainer[5]) {
							var opposing = trainer.trainer[4];
							currentbattle = new Battle(playerpoke, opposing, false);
							battlingaftertrainertext = true;
							currenttrainerbattleindex = trainer.index;
						}
					}
					if (playerdir === LEFT && trainerat(playerx - 1, playery)) {
						pressingaction = true;
						var trainer = trainerat(playerx - 1, playery);
						textbeingshown = trainer.trainer[3];
						if (!trainer.trainer[5]) {
							var opposing = trainer.trainer[4];
							currentbattle = new Battle(playerpoke, opposing, false);
							battlingaftertrainertext = true;
							currenttrainerbattleindex = trainer.index;
						}
					}
					if (playerdir === RIGHT && trainerat(playerx + 1, playery)) {
						pressingaction = true;
						var trainer = trainerat(playerx + 1, playery);
						textbeingshown = trainer.trainer[3];
						if (!trainer.trainer[5]) {
							var opposing = trainer.trainer[4];
							currentbattle = new Battle(playerpoke, opposing, false);
							battlingaftertrainertext = true;
							currenttrainerbattleindex = trainer.index;
						}
					}
				}
			} else if (state === "battle") {
				currentbattle.update();
			}

			if (waitingforonblocksave && onblock()) {
				waitingforonblocksave = false;
				save();
			}

			if (savecounter <= 0) {
				if (onblock()) {
					save();
				} else {
					waitingforonblocksave = true;
				}
			}

			savecounter--;
		}, dt);
	}

}