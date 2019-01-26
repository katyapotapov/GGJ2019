(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }
 if(typeof module === 'object' && module && module.exports) {
  module.exports = data;
 }})("level",
{ "height":20,
 "infinite":false,
 "layers":[
        {
         "data":[85, 85, 85, 85, 86, 86, 86, 86, 86, 86, 86, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 86, 86, 86, 86, 86, 86, 86, 86, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 86, 86, 86, 85, 85, 85, 85, 85, 85, 88, 85, 87, 87, 87, 85, 86, 86, 86, 86, 85, 85, 86, 86, 88, 85, 85, 85, 85, 85, 88, 88, 88, 88, 86, 86, 86, 85, 86, 86, 86, 86, 87, 88, 85, 85, 85, 86, 85, 85, 85, 85, 87, 86, 86, 86, 86, 86, 86, 85, 85, 88, 86, 86, 86, 86, 86, 86, 85, 85, 85, 85, 86, 86, 86, 86, 86, 86, 85, 85, 85, 87, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 86, 86, 85, 85, 86, 86, 86, 85, 85, 87, 85, 86, 85, 85, 85, 85, 85, 85, 85, 85, 85, 86, 86, 86, 86, 86, 86, 85, 85, 85, 85, 86, 86, 85, 85, 85, 85, 85, 85, 85, 85, 86, 86, 86, 85, 86, 85, 85, 85, 85, 85, 85, 86, 85, 85, 85, 85, 85, 85, 85, 85, 85, 86, 86, 86, 86, 85, 85, 85, 85, 85, 85, 85, 86, 85, 85, 85, 85, 85, 85, 85, 85, 86, 86, 86, 86, 85, 85, 85, 86, 85, 85, 87, 85, 86, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 86, 86, 87, 88, 86, 86, 85, 85, 85, 85, 85, 85, 87, 87, 87, 85, 85, 85, 85, 85, 85, 85, 86, 86, 86, 86, 86, 85, 85, 85, 85, 85, 87, 87, 88, 85, 85, 85, 85, 85, 85, 85, 87, 88, 85, 86, 86, 86, 86, 86, 85, 85, 88, 88, 88, 85, 85, 85, 85, 88, 85, 85, 87, 86, 87, 85, 86, 86, 85, 86, 86, 85, 87, 87, 87, 85, 85, 85, 85, 88, 88, 85, 85, 87, 86, 86, 86, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 86, 85, 88, 88, 88, 85, 85, 87, 85, 85, 86, 86, 86, 86, 85, 85, 85, 85, 85, 86, 86, 85, 88, 88, 88, 85, 85, 85, 85, 85, 85, 85, 85, 85, 86, 86, 86, 86, 86, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 86, 86, 86, 86, 86, 85, 85, 85],
         "height":20,
         "name":"Background",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":20,
         "x":0,
         "y":0
        }, 
        {
         "data":[350, 351, 351, 351, 351, 351, 351, 351, 351, 351, 351, 351, 351, 351, 351, 351, 351, 351, 351, 352, 370, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 372, 370, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 372, 370, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 372, 370, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 372, 370, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 372, 370, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 372, 370, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 372, 370, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 372, 370, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 372, 370, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 372, 370, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 372, 370, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 372, 370, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 372, 370, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 372, 370, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 372, 370, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 372, 370, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 372, 370, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 372, 390, 391, 391, 391, 391, 391, 391, 391, 391, 391, 391, 391, 391, 391, 391, 391, 391, 391, 391, 392],
         "height":20,
         "name":"Main",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":20,
         "x":0,
         "y":0
        }, 
        {
         "draworder":"topdown",
         "name":"Objects",
         "objects":[
                {
                 "height":64,
                 "id":3,
                 "name":"player",
                 "rotation":0,
                 "type":"player",
                 "visible":true,
                 "width":64,
                 "x":128,
                 "y":160
                }],
         "opacity":1,
         "type":"objectgroup",
         "visible":true,
         "x":0,
         "y":0
        }],
 "nextobjectid":4,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tiledversion":"1.1.5",
 "tileheight":32,
 "tilesets":[
        {
         "columns":20,
         "firstgid":1,
         "image":"tileset01.png",
         "imageheight":640,
         "imagewidth":640,
         "margin":0,
         "name":"ground",
         "spacing":0,
         "tilecount":400,
         "tileheight":32,
         "tilewidth":32
        }],
 "tilewidth":32,
 "type":"map",
 "version":1,
 "width":20
});