var Ccanvas;
var Cgeometry;
var CzBox;
function drawing(Geometries, fill, fillcolor, canvas){
    if (canvas.getContext) {
        var lines = canvas.getContext("2d");
        lines.beginPath();
        
        for (var i = 0; i < Geometries.length; i++) {
            if (Geometries[i].type != "point") {
            
                for (var j = 0; j < Geometries[i].geometry.length; j++) {
                
                    if (j == 0) {
                        lines.moveTo(Geometries[i].geometry[j].x, Geometries[i].geometry[j].y);
                    }
                    else {
                        lines.lineTo(Geometries[i].geometry[j].x, Geometries[i].geometry[j].y);
                    }
                }
            }
            if (Geometries[i].type == "point") {
                lines.moveTo(Geometries[i].geometry.x, Geometries[i].geometry.y);
                lines.arc(Geometries[i].geometry.x, Geometries[i].geometry.y, 4, Math.PI * 2, 0, true);
            }
        }
        if (fill == true) {
            lines.fillStyle = '#' + fillcolor;
            lines.fill();
        }
        lines.strokeStyle = '#' + fillcolor;
        lines.stroke();
        lines.closePath();
    }
}

function getpixelsize(width){
    var lw = CzBox.Xmax - CzBox.Xmin;
    
    var pixel = Math.round((lw / width) * 100) / 100;
    
    return pixel;
}

function createZoomBox(A, B, bxy){
    var ZBox = {
        Xmin: A.x + bxy,
        Xmax: B.x - bxy,
        Ymin: B.y + bxy,
        Ymax: A.y - bxy
    };
    return ZBox;
}

function createPanBox(Static_CzBox){

    var lx = mousedownC.x - center.x;
    var ly = mousedownC.y - center.y;
    
    var ZBox = {
        Xmin: Static_CzBox.Xmin + lx,
        Xmax: Static_CzBox.Xmax + lx,
        Ymin: Static_CzBox.Ymin + ly,
        Ymax: Static_CzBox.Ymax + ly
    };
    return ZBox;
}

function zoomin(){
    $('#canvas').unbind('click', zout);
    $('#canvas').bind('click', zin);
}

function zoomout(){
    $('#canvas').unbind('click', zin);
    $('#canvas').bind('click', zout)
}

function zin(){
    clearcanvas();
    var Zbox = createZoomBox(CreatePoint(CzBox.Xmin, CzBox.Ymax), CreatePoint(CzBox.Xmax, CzBox.Ymin), getZoomValue());
    CzBox = Zbox;
    var gitem = transform(Cgeometry, CzBox, canvas.width, canvas.height);
    drawing(gitem, false, "00f", canvas);
}

function zout(){
    clearcanvas();
    var Zbox = createZoomBox(CreatePoint(CzBox.Xmin, CzBox.Ymax), CreatePoint(CzBox.Xmax, CzBox.Ymin), -getZoomValue());
    CzBox = Zbox;
    var gitem = transform(Cgeometry, CzBox, canvas.width, canvas.height);
    drawing(gitem, false, "00f", canvas);
}

function getZoomValue(){
    var zx = (CzBox.Xmax - CzBox.Xmin) / 8;
    var zy = (CzBox.Ymax - CzBox.Ymin) / 8;
    
    if (zx > zy) {
        return zy;
    }
    else {
        return zx;
    }
}

var mousedownC = new Array();
function pan(){
    $('#canvas').unbind('click', zin);
    $('#canvas').unbind('click', zout);
	$('#canvas').unbind('mousedown', select);
    
    $('#canvas').mousedown(function(){
        mousedownC = center;
        Static_CzBox = CzBox;
        $('#canvas').mousemove(function(event){
            clearcanvas();
            
            var Zbox = createPanBox(Static_CzBox);
            var gitem = transform(Cgeometry, Zbox, canvas.width, canvas.height);
            drawing(gitem, false, "00f", canvas);
            
            $('#canvas').mouseup(function(event){
                $('#canvas').unbind('mousedown');
                $('#canvas').unbind('mousemove');
                CzBox = Zbox;
            });
            
        })
    });
}

function currentLocation(ev,canvas){
    var pixel = getpixelsize(canvas.width);
    
		
    if (typeof ev.offsetX === 'undefined') {
	
		var eoffsetX = ev.clientX - $(ev.target).offset().left + window.pageXOffset;
        var eoffsetY = ev.clientY - $(ev.target).offset().top + window.pageYOffset;
		
        var xt = CzBox.Xmin + (eoffsetX) * pixel;
        var yt = eoffsetY * pixel;
    }
    else {
        var xt = CzBox.Xmin + (ev.offsetX) * pixel;
        var yt = CzBox.Ymin + (canvas.height - ev.offsetY) * pixel;
    }
    
    x = Math.round(xt * 100) / 100;
    y = Math.round(yt * 100) / 100;
	
	var currentPoints = CreatePoint(x,y);
	return currentPoints;
}
function select(){
	
	$('#canvas').mousedown(function(ev){
			var cur = currentLocation(ev,this);
			 loop: for (var i = 0; i < Cgeometry.length; i++) {
			 	if (Cgeometry[i].type != "point") {
			 		if (PointInPolygon(Cgeometry[i].geometry, cur.x, cur.y)) {
						var g = new Array();
						g[0] = Cgeometry[i];
						var lg = transform(g,CzBox,canvas.width,canvas.height);
						drawing(lg, true, "8D638B", this);
						break loop;
			 		}
			 	}
			 }	
		});
}
function clearcanvas(){
    Ccanvas.width = Ccanvas.width;
}
