// datamap is a hashmap of characters on a map to TileTypes
var Map = function (tileset, data, datamap) {
	this.tileset = tileset;
	this.data = data;
	this.datamap = datamap;
}

Map.prototype.draw = function (ctx) {
	var starttilex = Math.floor(playerx) - Math.floor(shownTilesWidth / 2) - 1;
	var starttiley = Math.floor(playery) - Math.floor(shownTilesHeight / 2) - 1;
	if(starttilex < 0) {
		starttilex = 0;
	}
	if(starttiley < 0) {
		starttiley = 0;
	}
	for (var row = starttiley; row < starttiley + shownTilesHeight + 2 && row < this.data.length; row++) {
		for (var col = starttilex; col < starttilex + shownTilesWidth + 2 && col < this.data[0].length; col++) {
			ctx.drawImage(this.tileset, this.datamap[this.data[row][col]].tilesetx * tilesize, this.datamap[this.data[row][col]].tilesety * tilesize, tilesize, tilesize, Math.round((col - playerx) * tilesize + playerscreenx), Math.round((row - playery) * tilesize + playerscreeny), tilesize, tilesize);
			
		}
	}
}

Map.prototype.get = function(x, y) {
	return this.datamap[this.data[y][x]];
}