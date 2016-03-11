// datamap is a hashmap of characters on a map to TileTypes
var Map = function (tileset, data, datamap, trainers, events, bgsrc) {
	this.tileset = tileset;
	this.data = data;
	this.datamap = datamap;
	this.trainers = trainers || [];
	this.events = events || [];
	this.bg = new Image();
	if (bgsrc) {
		this.bg.src = bgsrc;
	}
}

Map.prototype.draw = function (ctx) {
	ctx.drawImage(this.bg, -playerx * tilesize + playerscreenx, -playery * tilesize + playerscreeny);
	var starttilex = Math.floor(playerx) - Math.floor(shownTilesWidth / 2) - 1;
	var starttiley = Math.floor(playery) - Math.floor(shownTilesHeight / 2) - 1;
	if (starttilex < 0) {
		starttilex = 0;
	}
	if (starttiley < 0) {
		starttiley = 0;
	}
	for (var row = starttiley; row < starttiley + shownTilesHeight + 2 && row < this.data.length; row++) {
		for (var col = starttilex; col < starttilex + shownTilesWidth + 2 && col < this.data[0].length; col++) {
			if (!this.data[row][col].passingdatatile) {
				ctx.drawImage(this.tileset, this.datamap[this.data[row][col]].tilesetx * tilesize, this.datamap[this.data[row][col]].tilesety * tilesize, tilesize, tilesize, Math.round((col - playerx) * tilesize + playerscreenx), Math.round((row - playery) * tilesize + playerscreeny), tilesize, tilesize);
			}

		}
	}
}

Map.prototype.get = function (x, y) {
	return this.datamap[this.data[y][x]];
}

Map.prototype.trainerat = function (x, y) {
	for (var i = 0; i < this.trainers.length; i++) {
		if (this.trainers[i][1] === Math.round(x) && this.trainers[i][2] === Math.round(y)) {
			return {
				index: i,
				trainer: this.trainers[i]
			};
		}
	}
	return null;
}

Map.prototype.eventat = function (x, y) {
	for (var i = 0; i < this.events.length; i++) {
		if (this.events[i].x === Math.round(x) && this.events[i].y === Math.round(y)) {
			return this.events[i];
		}
	}
	return null;
}