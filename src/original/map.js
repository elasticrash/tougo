var wmsDisplay = function(canvasId) {
    var globalLayerList = [];

    //Requested tile dimensions
    var tileWidth = 254;
    var tileHeight = 254;

    //TODO Get from Json file and proj4js
    //this is the bounding box of the system used (2100 for this example)
    var LocalSystemMaxX = 1056496;
    var LocalSystemMinX = -34387;
    var LocalSystemMinY = 3691163;
    var LocalSystemMaxY = 4641211;

    //TODO This Solution is not mine, not elegant at all needs replacing
    //This is the West and North Boundaries of the projection (pointless in most cases)
    var WestEnd = -5120900;
    var NorthEnd = 9998100;

    //The tile width in meter
    var tileWidthInMeters;
    var tileHeightInMeters;

    //Our Canvas Object
    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext("2d");


    //get The pixelSize of the Requested Level, closure pattern
    var mapAttributes = function(zoomLevel) {
        //Initial Scale Level
        var currentScale = 6;
        //Predefined ZoomLevels
        var MapZoomObject = [
            {
                scale: 300000000,
                pixelSize: 79375.1587503175
            },
            {
                scale: 100000000,
                pixelSize: 26458.386250105796
            },
            {
                scale: 30000000,
                pixelSize: 7937.51587503175
            },
            {
                scale: 10000000,
                pixelSize: 2645.8386250105796
            },
            {
                scale: 3000000,
                pixelSize: 793.751587503175
            },
            {
                scale: 1000000,
                pixelSize: 264.583862501058
            },
            {
                scale: 300000,
                pixelSize: 79.3751587503175
            },
            {
                scale: 100000,
                pixelSize: 26.4583862501058
            },
            {
                scale: 50000,
                pixelSize: 13.2291931250529
            },
            {
                scale: 20000,
                pixelSize: 5.29167725002117
            },
            {
                scale: 10000,
                pixelSize: 2.64583862501058
            },
            {
                scale: 5000,
                pixelSize: 1.32291931250529
            },
            {
                scale: 2500,
                pixelSize: 0.661459656252646
            },
            {
                scale: 1000,
                pixelSize: 0.264583862501058
            },
            {
                scale: 500,
                pixelSize: 0.132291931250529
            },
            {
                scale: 250,
                pixelSize: 0.0661459656252645
            },
            {
                scale: 125,
                pixelSize: 0.03307298281263225
            },
            {
                scale: 62.5,
                pixelSize: 0.016536491406316123
            },
            {
                scale: 31.25,
                pixelSize: 0.008268245703158062
            },
            {
                scale: 15.625,
                pixelSize: 0.004134122851579031
            },
            {
                scale: 7.8125,
                pixelSize: 0.0020670614257895154
            },
            {
                scale: 3.90625,
                pixelSize: 0.0010335307128947577
            },
            {
                scale: 1.953125,
                pixelSize: 0.0005167653564473789
            }
        ];

        //current PixelSize
        var currentPixelSize;

        return {
            getPixelSize: function(zoomLevel){
                currentPixelSize = MapZoomObject[zoomLevel].pixelSize;
            },
            changeCurrentScaleBy:function(inc){
                currentScale+=inc;
            },
            getCurrentScale:function(){
                return currentScale;
            },
            getCurrentPixelSize:function(){
                return currentPixelSize;
            }
        };
    }();

    //The pixelSize of the current Level
    mapAttributes.getPixelSize(mapAttributes.getCurrentScale());

    //Initial and Current map Upper Left Point
    //Initial and Current map Lower Left Point
    var mapULPoint = {
        x: 440000,
        y: 4300000
    };
    var mapLLPoint = {
        x: mapULPoint.x + ctx.canvas.width * mapAttributes.getCurrentPixelSize(),
        y: mapULPoint.y - ctx.canvas.height * mapAttributes.getCurrentPixelSize()
    };

    //event for coordinates
    var canvasLeft = canvas.offsetLeft;
    var canvasTop = canvas.offsetTop;

    function writeMessage(canvas, message) {
        ctx.fillStyle="#FFFFFF";
        ctx.fillRect(1,1,250,33);
        ctx.font = '16pt Calibri';
        ctx.fillStyle = 'black';
        ctx.fillText(message, 10, 25);
    }

    function CalculateCursonPosition(event){
        var x = event.pageX - canvasLeft;
        var y = event.pageY - canvasTop;
        return {
            x: Math.round((mapULPoint.x + x * mapAttributes.getCurrentPixelSize())*100)/100,
            y: Math.round((mapULPoint.y - y * mapAttributes.getCurrentPixelSize())*100)/100
        };
    }

    var pan_tool = false;
    var pan_point;

    canvas.addEventListener('mousemove', function(evt) {
        var local = CalculateCursonPosition(evt);
        writeMessage(canvas, "x: " + local.x + " y: "+ local.y);
        if(pan_tool) {
            var moveDifferencePoint = {
                x: local.x - pan_point.x,
                y: local.y - pan_point.y
            };
            pan_point = CalculateCursonPosition(evt);
            mapULPoint.x = mapULPoint.x - moveDifferencePoint.x;
            mapULPoint.y = mapULPoint.y - moveDifferencePoint.y;
            mapLLPoint.x = mapLLPoint.x - moveDifferencePoint.x;
            mapLLPoint.y = mapLLPoint.y - moveDifferencePoint.y;
            FullRefresh();
        }
    }, false);

    //function expression for replacing characters
    var Replacer = function (StringForReplace) {
        var replacer = {};
        replacer.commaWithDot = function () {
            if (StringForReplace) {
                return StringForReplace.toString().replace(",", ".");
            }
            return "";
        };
        return replacer;
    };

    //Draw the Tile on The Canvas
    function drawTiles(tileAttributes) {
        if (tileAttributes.serviceUrl.indexOf("WMS::") !== -1) {
            var layerObject = tileAttributes.serviceUrl.split("::");
            tileAttributes.serviceUrl = layerObject[2];

            var image = new Image();
            image.src = tileAttributes.serviceUrl;
            image.onload = function () {
                ctx.drawImage(image, tileAttributes.sx, tileAttributes.sy, tileWidth, tileWidth);
            };
            return;
        }
    }

    //Iterates the tiles and sends them to drawTiles to be drawned
    function iterateTiles(tiles) {
        var tileNameComponents;
        if (globalLayerList.length > 0) {
            var CoordinateXOfTile;
            var CoordinateYOfTile;
            tiles.forEach(function (tile) {
                globalLayerList.forEach(function (layer, j){
                    if (layer.visible === true) {
                        if (mapAttributes.getCurrentScale() <= layer.MinVisibleScale &&
                            mapAttributes.getCurrentScale() >= layer.MaxVisibleScale) {
                            var tileAttributes = {};

                            tileNameComponents = tile.split("~");
                            tileAttributes.row = parseInt(tileNameComponents[0]);
                            tileAttributes.col = parseInt(tileNameComponents[1]);
                            CoordinateXOfTile = WestEnd + tileAttributes.col * tileWidthInMeters;
                            CoordinateYOfTile = NorthEnd - tileAttributes.row * tileHeightInMeters;
                            tileAttributes.sx = -Math.round(((mapULPoint.x - CoordinateXOfTile) / tileWidthInMeters) * tileWidth);
                            tileAttributes.sy = Math.round(((mapULPoint.y - CoordinateYOfTile) / tileHeightInMeters) * tileHeight);

                            tileAttributes.serviceUrl = "WMS::"
                            + j + "::"
                            + layer.LayerSource
                            + "&REQUEST=GetMap&WIDTH="
                            + tileWidth + "&HEIGHT="
                            + tileHeight + "&BBOX="
                            + new Replacer(CoordinateXOfTile).commaWithDot() + ","
                            + new Replacer(CoordinateYOfTile - tileHeightInMeters).commaWithDot() + ","
                            + new Replacer(CoordinateXOfTile + tileWidthInMeters).commaWithDot() + ","
                            + new Replacer(CoordinateYOfTile).commaWithDot();

                            drawTiles(tileAttributes);
                        }
                    }
                });
            });
        }
    }

    //TODO needs simplifying and change of logic but it works
    //Basically it calculate how many tiles are in your canvas area...
    function mapCalculations() {
        var returnObject = {};

        tileWidthInMeters = tileWidth * mapAttributes.getCurrentPixelSize();
        tileHeightInMeters = tileHeight * mapAttributes.getCurrentPixelSize();
        returnObject.howManyTilesFromWE = Math.floor((mapULPoint.x - WestEnd) / tileWidthInMeters);
        returnObject.distanceFromOriginWE = WestEnd + returnObject.howManyTilesFromWE * tileWidthInMeters;
        returnObject.howManyTilesFromNE = Math.floor((NorthEnd - mapULPoint.y) / tileHeightInMeters);
        returnObject.distanceFromOriginNE = NorthEnd - returnObject.howManyTilesFromNE * tileHeightInMeters;
        returnObject.noOfTilesAtWidth = Math.floor((NorthEnd - mapLLPoint.y) / tileHeightInMeters) - returnObject.howManyTilesFromNE + 1;
        returnObject.noOfTilesAtHeight = Math.floor((mapLLPoint.x - WestEnd) / tileWidthInMeters) - returnObject.howManyTilesFromWE + 1;
        returnObject.howManyPixelsFromWE = -Math.round(Math.abs((returnObject.distanceFromOriginWE - mapULPoint.x) / mapAttributes.getCurrentPixelSize()));
        returnObject.howManyPixelsFromNE = -Math.round(Math.abs((mapULPoint.y - returnObject.distanceFromOriginNE) / mapAttributes.getCurrentPixelSize()));

        return returnObject;
    }

    //Creates a List with the tiles that fall within your canvas object
    function tileCalculation() {
        var results = mapCalculations();
        var i;
        var j;
        var howManyTilesFromNE = results.howManyTilesFromNE;
        var howManyTilesFromWE = results.howManyTilesFromWE;
        var uselessTilesFromNorthMinusOne = Math.floor((NorthEnd - LocalSystemMaxY) / tileHeightInMeters) - 1;
        var uselessTilesFromWestMinusOne = Math.floor((LocalSystemMinX - WestEnd) / tileWidthInMeters) - 1;
        var uselessTilesFromNorthPlusOne = Math.floor((NorthEnd - LocalSystemMinY) / tileHeightInMeters) + 1;
        var uselessTilesFromWestPlusOne = Math.floor((LocalSystemMaxX - WestEnd) / tileWidthInMeters) + 1;
        var tileList = [];
        if ((results.noOfTilesAtWidth * results.noOfTilesAtHeight) === 0) {
            return;
        }
        for (i = 0; i < results.noOfTilesAtWidth; i += 1) {
            howManyTilesFromWE = results.howManyTilesFromWE;
            if ((howManyTilesFromNE >= uselessTilesFromNorthMinusOne) && (howManyTilesFromNE <= uselessTilesFromNorthPlusOne)) {
                for (j = 0; j < results.noOfTilesAtHeight; j += 1) {
                    if ((howManyTilesFromWE >= uselessTilesFromWestMinusOne) && (howManyTilesFromWE <= uselessTilesFromWestPlusOne)) {
                        tileList[tileList.length] = howManyTilesFromNE + "~" + howManyTilesFromWE;
                    }
                    howManyTilesFromWE += 1;
                }
            }
            howManyTilesFromNE += 1;
        }
        iterateTiles(tileList);
    }

    //Useful but not used for the time, to generate random ids
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    // Create the navigation (tree-like) sidebar
    function Create_Tree_And_Events() {
        var mguid = guid();
        globalLayerList.forEach(function(layer){
            $('#tree').append("<div class='checkbox'><li><input id='"
            + mguid
            + "' type='checkbox' value='"
            + layer.LayerName
            + "' >"
            + layer.LayerName
            + "</div>");
        });
    }

    function GetMapMidPoint(){
        return {
            x: (mapULPoint.x + mapLLPoint.x)/2,
            y: (mapULPoint.y + mapLLPoint.y)/2
        };
    }

    function RecalculateCanvasBBox(midpoint){
        mapULPoint.x = midpoint.x - (canvas.width/2*mapAttributes.getCurrentPixelSize());
        mapULPoint.y = midpoint.y + (canvas.height/2*mapAttributes.getCurrentPixelSize());
        mapLLPoint.x = midpoint.x + (canvas.width/2*mapAttributes.getCurrentPixelSize());
        mapLLPoint.y = midpoint.y - (canvas.height/2*mapAttributes.getCurrentPixelSize());
    }

    //Toolbar Events
    function Toolbar_Events(){
        $('#tool_pan').on("click", function () {
            canvas.addEventListener("mousedown", function (evt) {
                pan_point = CalculateCursonPosition(evt);
                pan_tool = true;
            }, false);
            canvas.addEventListener("mouseup", function (evt) {
                pan_tool = false;
                $('#tool_pan').removeEventListener('click');
                canvas.removeEventListener('mousedown');

            }, false);
        });
        $('#tool_zoom_in').on("click", function () {
            mapAttributes.changeCurrentScaleBy(1);
            mapAttributes.getPixelSize(mapAttributes.getCurrentScale());
            var midpoint = GetMapMidPoint();
            RecalculateCanvasBBox(midpoint);
            FullRefresh();
        });
        $('#tool_zoom_out').on("click", function () {
            mapAttributes.changeCurrentScaleBy(-1);
            mapAttributes.getPixelSize(mapAttributes.getCurrentScale());
            var midpoint = GetMapMidPoint();
            RecalculateCanvasBBox(midpoint);
            FullRefresh();
        });
    }

    //PUBLIC FUNCTIONS
    function CreateLayer(layerName, layerType, url) {
        Toolbar_Events();
        return {
            LayerName: layerName,
            LayerType: layerType,
            LayerSource: url
        };
    }

    function AddLayer(layer) {
        if (layer) {
            if (layer.LayerType) {
                layer.visible = true;
                layer.MinVisibleScale = 22;
                layer.MaxVisibleScale = 0;
                globalLayerList[globalLayerList.length] = layer;
            }
            FullRefresh();
            Create_Tree_And_Events();
        }
    }

    function FullRefresh() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        tileCalculation();
    }

    return {
        CreateLayer : CreateLayer,
        AddLayer: AddLayer,
        FullRefresh: FullRefresh
    };
};