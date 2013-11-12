function PointInPolygon(poly, x, y){
    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i) 
        ((poly[i].y <= y && y < poly[j].y) || (poly[j].y <= y && y < poly[i].y)) &&
        (x < (poly[j].x - poly[i].x) * (y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x) &&
        (c = !c);
    if (c == true) 
        return true;
    else 
        return false;
}

function Simplify(polygon, tolerance){
    var simplefiedPolygon = new Array();
    
    simplefiedPolygon[0] = polygon[0];
    
    var ivertex = 0;
    var ipoint = 0;
    
    for (var c = 0; c < polygon.length - 2; c++) {
        var point1 = new Array();
        
        point1 = {
            x: polygon[ivertex].x,
            y: polygon[ivertex].y
        };
        
        var point2 = new Array();
        point2 = {
            x: polygon[c + 2].x,
            y: polygon[c + 2].y
        };
        
        var MidPoints = new Array();
        
        for (var j = 0; j < (c + 1 - ivertex); j++) {
            MidPoints[j] = polygon[ivertex + j + 1];
        }
        
        var D = Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2));
        var y1my2 = (point1.y - point2.y);
        var x2mx1 = (point2.x - point1.x);
        var C = (point2.y * point1.x) - (point1.y * point2.x);
        
        var run = 1;
        
        for (var i = 0; i < MidPoints.length; i++) {
            var dist = Math.abs(MidPoints[i].x * y1my2 + MidPoints[i].y * x2mx1 + C) / D;
            if (dist > tolerance) {
                run = -1;
            }
        }
        
        if (run == -1) {
            ipoint++;
            ivertex = c + 1;
            simplefiedPolygon[ipoint] = polygon[c + 1];
        }
    }
    simplefiedPolygon[ipoint + 1] = polygon[polygon.length - 2];
    simplefiedPolygon[ipoint + 2] = polygon[polygon.length - 1];
    
    return simplefiedPolygon;
}

function intersection(PointA, PointB, PointC, PointD){
    var cross;
    
    var xD1 = PointB.x - PointA.x;
    var xD2 = PointD.x - PointC.x;
    var yD1 = PointB.y - PointA.y;
    var yD2 = PointD.y - PointC.y;
    var xD3 = PointA.x - PointC.x;
    var yD3 = PointA.y - PointC.y;
    
    var len1 = Math.sqrt(Math.pow(xD1, 2) + Math.pow(yD1, 2));
    var len2 = Math.sqrt(Math.pow(xD2, 2) + Math.pow(yD2, 2));
    
    var dot = (xD1 * xD2 + yD1 * yD2); // dot product  
    var deg = dot / (len1 * len2);
    
    var div = yD2 * xD1 - xD2 * yD1;
    var ua = (xD2 * yD3 - yD2 * xD3) / div;
    var ub = (xD1 * yD3 - yD1 * xD3) / div;
    
    var crossx = PointA.x + ua * xD1;
    var crossy = PointA.y + ua * yD1;
    
    cross = CreatePoint(crossx,crossy);
    
    return cross;
}
function IsIntersectionWithinLineLimits(PointA, PointB, PointC, PointD, cross){
    if (cross.x >= PointC.x && cross.x <= PointD.x && cross.x >= PointA.x && cross.x <= PointB.x) {
        if (cross.y >= PointC.y && cross.y <= PointD.y || cross.y <= PointC.y && cross.y >= PointD.y) {
            return true;
        }
    }
    if (cross.x <= PointC.x && cross.x >= PointD.x && cross.x <= PointA.x && cross.x >= PointB.x) {
        if (cross.y >= PointC.y && cross.y <= PointD.y || cross.y <= PointC.y && cross.y >= PointD.y) {
            return true;
        }
    }
    return false;
}

function distance(PointA, PointB){
    var dist;
    return dist = Math.sqrt(Math.pow(PointB.x - PointA.x, 2) + Math.pow(PointB.y - PointA.y, 2));
}

function transform(oldGeometries, Boxobj, width, height){
    var TransformedGeometries = new Array();
    
    var lw = Boxobj.Xmax - Boxobj.Xmin;
	var ly = Boxobj.Ymax - Boxobj.Ymin;
    
    if (lw < ly) {
        lw = lw;
    }
    else {
        lw = ly;
    }
	
	    if (width < height) {
			width = width;
		}
		else {
			width = height;
		}
    
    for (var i = 0; i < oldGeometries.length; i++) {
        var Geometries = new Array();

		if (oldGeometries[i].type == "point") {
			Geometries = {
				x: parseFloat(((oldGeometries[i].geometry.x - Boxobj.Xmin) / lw) * width),
				y: parseFloat(height - ((oldGeometries[i].geometry.y - Boxobj.Ymin) / lw) * width)
			};
		}
		else {
			for (var j = 0; j < oldGeometries[i].geometry.length; j++) {
				Geometries[j] = {
					x: parseFloat(((oldGeometries[i].geometry[j].x - Boxobj.Xmin) / lw) * width),
					y: parseFloat(height - ((oldGeometries[i].geometry[j].y - Boxobj.Ymin) / lw) * width)
				};
			}
		}
        TransformedGeometries[i] = {
            type: oldGeometries[i].type,
            geometry: Geometries
        };
    }
    return TransformedGeometries;
}

function CreatePoint(x, y){
	
	x = x*1000;
	y = y*1000;
	
	x = Math.round(x);
	y = Math.round(y);
	
    var Point = {
        x: x/1000,
        y: y/1000
    };
    return Point;
}

function CreatePolygon(xyArray){
    var Polygon = new Array();
	var t=0;
    for (var i = 0; i < xyArray.length; i = i + 2) {
        Polygon[t] = {
            x: xyArray[i],
            y: xyArray[i + 1]
        };
		t++;
    }
    return Polygon;
}
function getBoundingBox(Geometries)
{
	var alllinesx = new Array();
	var alllinesy = new Array();
	var p = 0;
	for (var i = 1; i < Geometries.length; i++) {
	
		for (var j = 0; j < Geometries[i].geometry.length; j++) {
			alllinesx[p] = parseFloat(Geometries[i].geometry[j].x);
			alllinesy[p] = parseFloat(Geometries[i].geometry[j].y);
			p++;
		}
	}
	
	BBox = {
		Xmin: Math.min.apply(null, alllinesx),
		Xmax: Math.max.apply(null, alllinesx),
		Ymin: Math.min.apply(null, alllinesy),
		Ymax: Math.max.apply(null, alllinesy)
	};
	return BBox;
}
function GetArea(Polygon)
{
	var area = 0;
	
	for (var i=0; i < Polygon.length-1; i++)
	{
		area = area + Polygon[i].x*Polygon[i+1].y-Polygon[i+1].x*Polygon[i].y;
	}
	return area*0.5;
}
function GetCentroid(Polygon)
{
	var Centroid = new Array();
	var cx = 0;
	var cy =0;
	for (var i=0; i < Polygon.length-1; i++)
	{
		cx = cx +(Polygon[i].x+Polygon[i+1].x)*(Polygon[i].x*Polygon[i+1].y-Polygon[i+1].x*Polygon[i].y);
		cy = cy +(Polygon[i].y+Polygon[i+1].y)*(Polygon[i].x*Polygon[i+1].y-Polygon[i+1].x*Polygon[i].y);
	}
	cx = 1/(6*GetArea(Polygon))*cx;
	cy = 1/(6*GetArea(Polygon))*cy;
	Centroid = {x:cx,y:cy};
	return Centroid;
}
function extendLineBothSides(PointA, PointB, dist)
{
	var slope = (PointB.y-PointA.y)/ (PointB.x-PointA.x)
	var intercept = PointA.y-PointA.x*slope;
	
	var a,b,c,d;
	
	var result = new Array();
	if (PointA.x > PointB.x) {
		a = parseFloat(PointA.x)+dist;
		b = slope * (a)+intercept;
		c = parseFloat(PointB.x)-dist;
		d = slope * (c)+intercept;
	}
	else
	{
		a = parseFloat(PointB.x)+dist;
		b = slope * (a)+intercept;
		c = parseFloat(PointA.x)-dist;
		d = slope * (c)+intercept;
	}
	result[0] = CreatePoint(a,b);
	result[1] = CreatePoint(c,d);
	
	return result;
}
function getPolygonNodes(Polygon)
{
	var nodes = new Array();
		for (var i=0; i < Polygon.length; i++)
	{
		var point = CreatePoint(Polygon[i].x, Polygon[i].y);
		nodes[i] = {type: "point", geometry: point}
	}
	
	return nodes;
}
function getAllNodes(Geometries)
{
	var nodes = new Array();
	
	var p = 0;
		for (var i = 0; i < Geometries.length; i++) {
		if (Geometries.type != "point") {
			for (var j = 0; j < Geometries[i].geometry.length; j++) {
				var point = CreatePoint(Geometries[i].geometry[j].x, Geometries[i].geometry[j].y);
				nodes[p] = {type: "point", geometry: point};
				p++;
			}
		}
	}
	return nodes;
}
function CreateCircle(point, radius, segments)
{
	var seg = Math.PI * 2 / segments;
    var PTS = new Array();
    
    var y = 0;
    for (var i = 0; i < segments; i++)
    {
        var theta = seg * i;
        PTS[y] = point.x + Math.cos( theta ) * radius;
        PTS[y+1] = point.y + Math.sin( theta ) * radius;
        
        y=y+2;
     }
    PTS[segments*2] = point.x + Math.cos( 0 ) * radius;
    PTS[segments*2+1] = point.y + Math.sin( 0 ) * radius;
	
	return CreatePolygon(PTS);
}