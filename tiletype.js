var TileType = function (name, tilesetx, tilesety, passable) {
	this.name = name;
	this.tilesetx = tilesetx;
	this.tilesety = tilesety;
	this.passable = passable;
}

var Sign = function (text) {
	this.text = text;
	this.name = "sign";
	this.tilesetx = 2;
	this.tilesety = 1;
	this.passable = false;
}