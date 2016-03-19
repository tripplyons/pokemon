var usingsave = (typeof (Storage) !== "undefined") && localStorage.getItem("playerpokename");

var pokecentermus = new Audio("pokecenter.mp3");
pokecentermus.addEventListener("ended", function (e) {
	pokecentermus.play();
}, false);
var route1mus = new Audio("route-1.mp3");
route1mus.addEventListener("ended", function (e) {
	route1mus.play();
}, false);
var battlemusic = new Audio("wild-battle.mp3");
battlemusic.addEventListener("ended", function (e) {
	battlemusic.play();
}, false);

var currentmap;

var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;
var ACTION = 4;
var ONE = 5;
var TWO = 6;
var THREE = 7;
var P = 8;
var KEYNUM = 9;

var caught = false;

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
var currentmapindex = 0;
var money = 0;

var playerpoke = new Pokemon("pikachu", 5);

var playerx = 14;
var playery = 9;

var checkpointx = 14;
var checkpointy = 9;

var playerdir = DOWN;

var pc = [];

var resettinggame = "false";
if (usingsave) {
	storedresettinggame = localStorage.getItem("resettinggame");
	if (typeof (storedresettinggame) !== "undefined" && storedresettinggame != null) {
		console.log("SET", storedresettinggame);
		resettinggame = storedresettinggame;
	}
	if (resettinggame === "false") {
		console.log("USING SAVE");
		money = parseInt(localStorage.getItem("money"));

		playerpoke = new Pokemon(localStorage.getItem("playerpokename"), parseInt(localStorage.getItem("playerpokelevel")), parseInt(localStorage.getItem("playerpokeexp")));

		playerx = parseInt(localStorage.getItem("playerx"));
		playery = parseInt(localStorage.getItem("playery"));

		checkpointx = parseInt(localStorage.getItem("checkpointx"));
		checkpointy = parseInt(localStorage.getItem("checkpointy"));

		var storeddir = localStorage.getItem("playerdir");
		if (typeof (storeddir) !== "undefined" && storeddir != null) {
			playerdir = parseInt(localStorage.getItem("playerdir"));
		}

		var storedhp = localStorage.getItem("playerpokehp");
		if (typeof (storedhp) !== "undefined" && storedhp != null) {
			this.playerpoke.hp = storedhp;
		}

		var storedpc = localStorage.getItem("pc");
		if (typeof (storedpc) !== "undefined" && storedpc != null) {
			storedpc = JSON.parse(storedpc);
			var i = 0;
			while (i < storedpc.length) {
				pc.push(new Pokemon(storedpc[i].name, storedpc[i].level, storedpc[i].exp));
				i++;
			}
			console.log(pc);
		}
	} else {
		usingsave = false;
		localStorage.setItem("resettinggame", "false");
	}
}
console.log(playerpoke);
var keys = [];
for (var i = 0; i < KEYNUM; i++) {
	keys.push(false);
}
var savecounter = 0;
var savecountdown = 300;
var pickingmove = false;
// [sprite, x, y, text, poke, beaten]
var battlingaftertrainertext = false;
var currenttrainerbattleindex = null;
var canvaswidth;
var canvasheight;
var shownTilesWidth;
var shownTilesHeight;
//console.log(playerx, playery);
var waitingforonblocksave = false;
var grasspokes = [
	new Pokemon("rattata", 3),
	new Pokemon("rattata", 4),
	new Pokemon("rattata", 5),
	new Pokemon("pidgey", 3),
	new Pokemon("pidgey", 4),
	new Pokemon("pidgey", 5)
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
			if (currenttrainerbattleindex != null) {
				console.log("TRAINER WIN");
				currentmap.trainers[currenttrainerbattleindex][5] = true;
			}

			winlevel = null;
		} else {
			if (caught) {
				caught = false;

				textbeingshown = "Caught the wild pokemon.";
			} else {
				money = Math.round(money / 2);
				playerx = checkpointx;
				playery = checkpointy;
				playerdir = DOWN;
				playerpoke.hp = playerpoke.stats["hp"];
				textbeingshown = "You lost. Returned to checkpoint.";
			}
		}
		if (typeof (currenttrainerbattleindex) !== "undefined") {
			currenttrainerbattleindex = null;
		}
	}
	if (name === "battle") {
		currentmap.music.pause();
		battlemusic.currentTime = 0;
		battlemusic.play();
		textbeingshown = "A battle has started!";
		pickingmove = false;
		state = "battle";
	}
	if (name === "overworld") {
		battlemusic.pause();
		battlemusic.currentTime = 0;
		currentmap.music.play();
		state = "overworld";
	}
}

var justpressed = [];
for (var i = 0; i < KEYNUM; i++) {
	justpressed.push(false);
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
		if (!keys[ACTION]) {
			justpressed[ACTION] = true;
		}

		keys[ACTION] = true;
	}
	if (e.keyCode === 49) {
		if (!keys[ONE]) {
			justpressed[ONE] = true;
		}

		keys[ONE] = true;
	}
	if (e.keyCode === 50) {
		if (!keys[TWO]) {
			justpressed[TWO] = true;
		}

		keys[TWO] = true;
	}
	if (e.keyCode === 51) {
		if (!keys[THREE]) {
			justpressed[THREE] = true;
		}

		keys[THREE] = true;
	}
	if (e.keyCode === 80) {
		if (!keys[P]) {
			justpressed[P] = true;
		}

		keys[P] = true;
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
	}
	if (e.keyCode === 49) {
		keys[ONE] = false;
		justpressed[ONE] = false;
	}
	if (e.keyCode === 50) {
		keys[TWO] = false;
		justpressed[TWO] = false;
	}
	if (e.keyCode === 51) {
		keys[THREE] = false;
		justpressed[THREE] = false;
	}
	if (e.keyCode === 80) {
		keys[P] = false;
		justpressed[P] = false;
	}
});

var playermovecamerainterval = 0.0625;

window.onload = function () {
	var savedtext = document.getElementById("saved");
	var save = function () {
		console.log("SAVE");
		FX.fadeOut(savedtext, {
			duration: savecountdown / fps * 1000 / 4,
			complete: function () {}
		});
		if (typeof (Storage) !== "undefined") {
			localStorage.setItem("playerpokename", playerpoke.name);
			localStorage.setItem("playerpokelevel", playerpoke.level.toString());
			localStorage.setItem("playerpokeexp", playerpoke.exp.toString());
			localStorage.setItem("playerpokehp", playerpoke.hp.toString());
			localStorage.setItem("playerx", playerx.toString());
			localStorage.setItem("playery", playery.toString());
			localStorage.setItem("money", money.toString());
			localStorage.setItem("checkpointx", checkpointx.toString());
			localStorage.setItem("checkpointy", checkpointy.toString());
			localStorage.setItem("playerdir", playerdir.toString());
			localStorage.setItem("trainersbeaten", JSON.stringify(maps.map(function (arg1) {
				return arg1.trainers.map(function (arg2) {
					return arg2[5];
				})
			})));
			localStorage.setItem("mapindex", currentmapindex.toString());
			localStorage.setItem("pc", JSON.stringify(pc.map(function (arg) {
				return {
					name: arg.name,
					level: arg.level,
					exp: arg.exp
				};
			})));
		}

		savecounter = savecountdown;
	}
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	canvaswidth = parseInt(getStyle(canvas, "width"));
	canvasheight = parseInt(getStyle(canvas, "height"));

	shownTilesWidth = canvaswidth / tilesize;
	shownTilesHeight = canvasheight / tilesize;
	playerscreenx = canvaswidth / 2 - tilesize / 2;
	playerscreeny = canvasheight / 2 - tilesize / 2;

	var tileset = new Image();
	tileset.src = "tiles.png";

	var Teleporter = function (tilesetx, tilesety, telemap, telex, teley) {
		this.tilesetx = tilesetx;
		this.tilesety = tilesety;
		this.telemap = telemap;
		this.telex = telex;
		this.teley = teley;
		this.passable = true;
		this.name = "teleporter";
	}

	var basedatamap = {
		".": new TileType("grass", 1, 0, true),
		"#": new TileType("tallgrass", 2, 0, true),
		"/": new TileType("treetopleft", 3, 0, false),
		"\\": new TileType("treetopright", 4, 0, false),
		"{": new TileType("treemidleft", 3, 1, false),
		"}": new TileType("treemidright", 4, 1, false),
		"[": new TileType("treebottomleft", 3, 2, false),
		"]": new TileType("treebottomright", 4, 2, false),
		"(": new TileType("treebothleft", 5, 0, false),
		")": new TileType("treebothright", 6, 0, false)
	};

	// TREE:
	//  /\
	//  {}
	//  []
	//
	// TWO TREE TOP TO TRUNK CONNECTOR
	//  ()
	var routedata = ["}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{",
					 ")()()()()()()()()()()()()()()()(",
					 "}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{",
					 ")()()()[][][][][][][][]()()()()(",
					 "}{}{}{}.....abcde......{}{}{}{}{}{",
					 ")()()().....fghij......()()()()()(",
					 "}{}{}{}.....klmno......{}{}{}{}{}{",
					 ")()()().....pqrst......()()()()()(",
					 "}{}{}{}.....uvwxy......{}{}{}{}{}{",
					 ")()()()........@.......[]()()()()(",
					 "}{}{}{}.####.....####...*{}{}{}{}{",
					 ")()()().####.....####...*()()()()(",
					 "}{}{}{}.####.....####...*{}{}{}{}{",
					 ")()()().####.....####../\\()()()(",
					 "}{}{}{}................{}{}{}{}{",
					 ")()()()/\\/\\/\\/\\/\\/\\/\\/\\()()()()(",
					 "}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{",
					 ")()()()()()()()()()()()()()()()(",
					 "}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{"];

	var garySprite = new Image();
	garySprite.src = "gary.png";
	var route = new Map(tileset, routedata, mergeoptions(basedatamap, {
		"@": new Sign("Welcome to Pokemon! We have signs!"),
		//		"$": new Sign("Here is another sign! It is long!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"),
		"*": new Teleporter(1, 0, 1, 8, 4),
		"a": new TileType("a", 0, 3, false),
		"b": new TileType("b", 1, 3, false),
		"c": new TileType("c", 2, 3, false),
		"d": new TileType("d", 3, 3, false),
		"e": new TileType("e", 4, 3, false),
		"f": new TileType("f", 0, 4, false),
		"g": new TileType("g", 1, 4, false),
		"h": new TileType("h", 2, 4, false),
		"i": new TileType("i", 3, 4, false),
		"j": new TileType("j", 4, 4, false),
		"k": new TileType("k", 0, 5, false),
		"l": new TileType("l", 1, 5, false),
		"m": new TileType("m", 2, 5, false),
		"n": new TileType("n", 3, 5, false),
		"o": new TileType("o", 4, 5, false),
		"p": new TileType("p", 0, 6, false),
		"q": new TileType("q", 1, 6, false),
		"r": new TileType("r", 2, 6, false),
		"s": new TileType("s", 3, 6, false),
		"t": new TileType("t", 4, 6, false),
		"u": new TileType("u", 0, 7, false),
		"v": new TileType("v", 1, 7, false),
		"w": new Teleporter(2, 7, 2, 7, 7),
		"x": new TileType("x", 3, 7, false),
		"y": new TileType("y", 4, 7, false),
	}), route1mus, [[garySprite, 11, 8, "Hello!", new Pokemon("eevee", 5), false]]);

	var towndata = ["}{}{}{}{}{}{}{}{}{}{}{}{}{}{",
					")()()()()()()()()()()()()()()(",
					"}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{",
					")()()()[][][][][][][]()()()()(",
					"}{}{}{}*.............{}{}{}{}{",
					")()()()/\\/\\/\\/\\/\\/\\/\\()()()()(",
					"}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{",
					")()()()()()()()()()()()()()()(",
					"}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{"];

	var town = new Map(tileset, towndata, mergeoptions(basedatamap, {
		"*": new Teleporter(1, 0, 0, 23, 11)
	}), route1mus);

	var pokecenterdata = ["###############",
						  "###############",
						  "#...#######...#",
						  "....#######....",
						  "...............",
						  "##.............",
						  "##.........##..",
						  "...........##..",
						  "#......*......#"]
	var pokecenter = new Map(new Image(), pokecenterdata, {
		".": new PassingDataTile(true),
		"#": new PassingDataTile(false),
		"*": new Teleporter(0, 0, 0, 14, 9)
	}, pokecentermus, [], [new ActionEvent(7, 3, function () {
		playerpoke.hp = playerpoke.stats.hp;
	})], "pokecenter.png");

	var maps = [route, town, pokecenter];

	var setmap = function (index) {
		currentmap.music.pause();
		currentmap.music.currentTime = 0;
		currentmapindex = index;
		currentmap = maps[currentmapindex];
		currentmap.music.play();
	}

	if (usingsave) {
		var trainersbeaten = JSON.parse(localStorage.getItem("trainersbeaten"));
		console.log(trainersbeaten);
		if (typeof (trainersbeaten) !== "undefined" && trainersbeaten != null) {
			console.log("SET TRAINERS BEATEN");
			for (var i = 0; i < maps.length; i++) {
				for (var j = 0; j < maps[i].trainers.length; j++) {
					maps[i].trainers[j][5] = trainersbeaten[i][j];
				}
			}
		}

		var storedmapindex = localStorage.getItem("mapindex");
		if (typeof (storedmapindex) !== "undefined" && storedmapindex != null) {
			currentmapindex = parseInt(storedmapindex);
		}
	}

	currentmap = maps[currentmapindex];


	setstate("overworld");



	var draw = function () {
		if (state === "overworld") {
			ctx.fillStyle = "#000000";
			ctx.fillRect(0, 0, canvaswidth, canvasheight);
			currentmap.draw(ctx);

			for (var i = 0; i < currentmap.trainers.length; i++) {
				if (currentmap.trainers[i][2] < playery) {
					ctx.drawImage(currentmap.trainers[i][0], Math.round((currentmap.trainers[i][1] - playerx) * tilesize + playerscreenx), Math.round((currentmap.trainers[i][2] - playery) * tilesize + playerscreeny) - 12);
				}
			}
			ctx.drawImage(playeranimimg[directiontable[playerdir] + playeranim[currentanimindex]], playerscreenx, playerscreeny - 6);

			for (var i = 0; i < currentmap.trainers.length; i++) {
				if (currentmap.trainers[i][2] >= playery) {
					ctx.drawImage(currentmap.trainers[i][0], Math.round((currentmap.trainers[i][1] - playerx) * tilesize + playerscreenx), Math.round((currentmap.trainers[i][2] - playery) * tilesize + playerscreeny) - 12);
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
			(playerdir === DOWN && playery === currentmap.data.length - 1) ||
			(playerdir === LEFT && playerx === 0) ||
			(playerdir === RIGHT && playerx === currentmap.data[0].length - 1))
			return;
		if ((playerdir === DOWN && currentmap.trainerat(playerx, Math.floor(playery) + 1)) ||
			(playerdir === UP && currentmap.trainerat(playerx, Math.ceil(playery) - 1)) ||
			(playerdir === LEFT && currentmap.trainerat(Math.ceil(playerx) - 1, playery)) ||
			(playerdir === RIGHT && currentmap.trainerat(Math.floor(playerx) + 1, playery)))
			return;
		if (!((playerdir === DOWN && currentmap.get(playerx, Math.floor(playery) + 1).passable) ||
				(playerdir === UP && currentmap.get(playerx, Math.ceil(playery) - 1).passable) ||
				(playerdir === LEFT && currentmap.get(Math.ceil(playerx) - 1, playery).passable) ||
				(playerdir === RIGHT && currentmap.get(Math.floor(playerx) + 1, playery).passable)))
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
			if (playerx > currentmap.data[0].length - 1) {
				playerx = currentmap.data[0].length - 1;
			}
			if (playery > currentmap.data.length - 1) {
				playery = currentmap.data.length - 1;
			}
		}
	}

	var onblock = function () {
		return playerx.toPrecision(6) % 1.0 === 0 && playery.toPrecision(6) % 1.0 === 0;
	}

	var directionplayer = function (dir) {
		if (onblock()) {
			if (currentmap.get(playerx, playery).name === "tallgrass" && Math.floor(Math.random() * 7) === 0) {
				var encounter = grasspokes[Math.floor(Math.random() * grasspokes.length)];
				currentbattle = new Battle(playerpoke, encounter, true);
				setstate("battle");
			} else {
				playerdir = dir;
			}
		}
	}

	tileset.onload = function () {
		setInterval(function () {
			if (justpressed[ACTION]) {
				console.log("ACTION");
			}

			//			console.log("TICK");
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
						if (playerstopping) {
							playerstopping = false;
							playermoving = false;
						}

						if (currentmap.get(playerx, playery).name === "teleporter") {
							var tele = currentmap.get(playerx, playery);
							setmap(tele.telemap);
							playerx = tele.telex;
							playery = tele.teley;
						}
					}
				} else {
					if (justpressed[ACTION]) {
						justpressed[ACTION] = false;
						textbeingshown = null;
						if (battlingaftertrainertext) {
							battlingaftertrainertext = false;
							setstate("battle");
						}
					}
				}

				if (playerdir === UP && justpressed[ACTION] && onblock() && currentmap.get(playerx, playery - 1).name === "sign") {
					justpressed[ACTION] = false;
					textbeingshown = currentmap.get(playerx, playery - 1).text;
				}
				if (justpressed[ACTION] && onblock()) {
					justpressed[ACTION] = false;
					if (playerdir === UP && currentmap.trainerat(playerx, playery - 1)) {
						var trainer = currentmap.trainerat(playerx, playery - 1);
						textbeingshown = trainer.trainer[3];
						if (!trainer.trainer[5]) {
							var opposing = Object.create(trainer.trainer[4]);
							currentbattle = new Battle(playerpoke, opposing, false);
							battlingaftertrainertext = true;
							currenttrainerbattleindex = trainer.index;
						}

					}
					if (playerdir === DOWN && currentmap.trainerat(playerx, playery + 1)) {
						var trainer = currentmap.trainerat(playerx, playery + 1);
						textbeingshown = trainer.trainer[3];
						if (!trainer.trainer[5]) {
							var opposing = Object.create(trainer.trainer[4]);
							currentbattle = new Battle(playerpoke, opposing, false);
							battlingaftertrainertext = true;
							currenttrainerbattleindex = trainer.index;
						}
					}
					if (playerdir === LEFT && currentmap.trainerat(playerx - 1, playery)) {
						var trainer = currentmap.trainerat(playerx - 1, playery);
						textbeingshown = trainer.trainer[3];
						if (!trainer.trainer[5]) {
							var opposing = Object.create(trainer.trainer[4]);
							currentbattle = new Battle(playerpoke, opposing, false);
							battlingaftertrainertext = true;
							currenttrainerbattleindex = trainer.index;
						}
					}
					if (playerdir === RIGHT && currentmap.trainerat(playerx + 1, playery)) {
						var trainer = currentmap.trainerat(playerx + 1, playery);
						textbeingshown = trainer.trainer[3];
						if (!trainer.trainer[5]) {
							var opposing = Object.create(trainer.trainer[4]);
							currentbattle = new Battle(playerpoke, opposing, false);
							battlingaftertrainertext = true;
							currenttrainerbattleindex = trainer.index;
						}
					}

					var eventloc = null;
					if (playerdir === UP) {
						eventloc = {
							x: playerx,
							y: playery - 1
						};
					}
					if (playerdir === DOWN) {
						eventloc = {
							x: playerx,
							y: playery + 1
						};
					}
					if (playerdir === LEFT) {
						eventloc = {
							x: playerx - 1,
							y: playery
						};
					}
					if (playerdir === RIGHT) {
						eventloc = {
							x: playerx + 1,
							y: playery
						};
					}

					console.log(eventloc);
					var event = currentmap.eventat(eventloc.x, eventloc.y);
					if (event) {
						event.action();
					}
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
			} else if (state === "battle") {
				currentbattle.update();
			}
		}, dt);
	}

}