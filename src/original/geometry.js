//needs primitives.js
/*global CreatePoint */
//returns true if a point is inside a particular polygon
function PointInPolygon(poly, x, y) {
    "use strict";
    var c  = false;
    var l = poly.length;
    var i = -1;
    var j;
    for (j = l - 1; ++i < l; j = i){
        if(((poly[i].y <= y && y < poly[j].y) || (poly[j].y <= y && y < poly[i].y)) &&
        (x < (poly[j].x - poly[i].x) * (y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)) {
            c = !c;
        }
      }
    if (c === true) {
        return true;
      }
    else{
        return false;
      }
}

//a polygon simplification algorithm I wrote 2 years ago based on a tolerance value
function Simplify(polygon, tolerance) {
    var simplefiedPolygon = [];

    simplefiedPolygon[0] = polygon[0];

    var ivertex = 0;
    var ipoint = 0;
    var c;
    var point1 = [];
    var point2 = [];

    for (c = 0; c < polygon.length - 2; c+=1) {

        point1 = {
            x: polygon[ivertex].x,
            y: polygon[ivertex].y
        };

        point2 = {
            x: polygon[c + 2].x,
            y: polygon[c + 2].y
        };

        var MidPoints = [];

        var j;
        for (j = 0; j < (c + 1 - ivertex); j+=1) {
            MidPoints[j] = polygon[ivertex + j + 1];
        }

        var D = Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2));
        var y1my2 = (point1.y - point2.y);
        var x2mx1 = (point2.x - point1.x);
        var C = (point2.y * point1.x) - (point1.y * point2.x);

        var run = 1;

        var i;
        var dist;
        for (i = 0; i < MidPoints.length; i+=1) {
            dist = Math.abs(MidPoints[i].x * y1my2 + MidPoints[i].y * x2mx1 + C) / D;
            if (dist > tolerance) {
                run = -1;
            }
        }

        if (run === -1) {
            ipoint+=1;
            ivertex = c + 1;
            simplefiedPolygon[ipoint] = polygon[c + 1];
        }
    }
    simplefiedPolygon[ipoint + 1] = polygon[polygon.length - 2];
    simplefiedPolygon[ipoint + 2] = polygon[polygon.length - 1];

    return simplefiedPolygon;
}

// get the intersection of 2 lines
function intersection(PointA, PointB, PointC, PointD) {
    var cross;

    var xD1 = PointB.x - PointA.x;
    var xD2 = PointD.x - PointC.x;
    var yD1 = PointB.y - PointA.y;
    var yD2 = PointD.y - PointC.y;
    var xD3 = PointA.x - PointC.x;
    var yD3 = PointA.y - PointC.y;

    var div = yD2 * xD1 - xD2 * yD1;
    var ua = (xD2 * yD3 - yD2 * xD3) / div;

    var crossx = PointA.x + ua * xD1;
    var crossy = PointA.y + ua * yD1;

    cross = CreatePoint(crossx, crossy);

    return cross;
}

// checks if the intersection point from the previous function is within certain line segments
function IsIntersectionWithinLineLimits(PointA, PointB, PointC, PointD, cross){
    if (cross.x >= PointC.x && cross.x <= PointD.x && cross.x >= PointA.x && cross.x <= PointB.x) {
        if ((cross.y >= PointC.y && cross.y <= PointD.y) || (cross.y <= PointC.y && cross.y >= PointD.y)) {
            return true;
        }
    }
    if (cross.x <= PointC.x && cross.x >= PointD.x && cross.x <= PointA.x && cross.x >= PointB.x) {
        if ((cross.y >= PointC.y && cross.y <= PointD.y) || (cross.y <= PointC.y && cross.y >= PointD.y)) {
            return true;
        }
    }
    return false;
}

//simple 2D distance function
function distance(PointA, PointB){
    return Math.sqrt(Math.pow(PointB.x - PointA.x, 2) + Math.pow(PointB.y - PointA.y, 2));
}

//scale and offset
function transform(oldGeometries, Boxobj, width, height) {
    var TransformedGeometries = [];

    var lw = Boxobj.Xmax - Boxobj.Xmin;
    var ly = Boxobj.Ymax - Boxobj.Ymin;

    lw = lw < ly ? lw : ly;

    width = width < height ? width : height;

    var Geometries;
    var i;
    oldGeometries.forEach(function (oldgeom) {
        Geometries = [];
        i = oldGeometries.indexOf(oldgeom);
        if (oldgeom.type === "point") {
            Geometries = {
                x: parseFloat(((oldgeom.geometry.x - Boxobj.Xmin) / lw) * width),
                y: parseFloat(height - ((oldgeom.geometry.y - Boxobj.Ymin) / lw) * width)
            };
        }
        else {
            var j;
            oldgeom.geometry.forEach(function (item) {
                j = oldgeom.geometry.indexOf(item);
                Geometries[j] = {
                    x: parseFloat(((item.x - Boxobj.Xmin) / lw) * width),
                    y: parseFloat(height - ((item.y - Boxobj.Ymin) / lw) * width)
                };
            });
        }

        TransformedGeometries[i] = {
            type: oldgeom.type,
            geometry: Geometries
        };
    });

    return TransformedGeometries;
}

//get the bounding box of a geometry
function getBoundingBox(Geometries) {
    var alllinesx = [];
    var alllinesy = [];
    var p = 0;
    Geometries.forEach(function (geom) {
        geom.geometry.forEach(function (item) {
            alllinesx[p] = parseFloat(item.x);
            alllinesy[p] = parseFloat(item.y);
            p+=1;
        });
    });

    var BBox = {
        Xmin: Math.min.apply(null, alllinesx),
        Xmax: Math.max.apply(null, alllinesx),
        Ymin: Math.min.apply(null, alllinesy),
        Ymax: Math.max.apply(null, alllinesy)
    };
    return BBox;
}

//get the area of a polygon
function GetArea(Polygon) {
    var p1 = 0;
    var p2 = 0;
    var area = 0;
    var i;
    Polygon.geometry.forEach(function (vertex) {
        i = Polygon.geometry.indexOf(vertex);
        if (i < Polygon.geometry.length - 1) {
            p1 += (vertex.x * Polygon.geometry[i + 1].y);
            p2 += (vertex.y * Polygon.geometry[i + 1].x);
        }
    });
    area = p1 -p2;
    return area * 0.5;
}

//gets the centroid of a polygon
function GetCentroid(Polygon) {
    var Centroid = [];
    var cx = 0;
    var cy = 0;
    var i;
    for (i = 0; i < Polygon.length - 1; i+=1) {
        cx = cx + (Polygon[i].x + Polygon[i + 1].x) * (Polygon[i].x * Polygon[i + 1].y - Polygon[i + 1].x * Polygon[i].y);
        cy = cy + (Polygon[i].y + Polygon[i + 1].y) * (Polygon[i].x * Polygon[i + 1].y - Polygon[i + 1].x * Polygon[i].y);
    }
    cx = 1 / (6 * GetArea(Polygon)) * cx;
    cy = 1 / (6 * GetArea(Polygon)) * cy;
    Centroid = {x: cx, y: cy};
    return Centroid;
}

//extends a line segments equally from both sides
function extendLineBothSides(PointA, PointB, dist) {
    var slope = (PointB.y - PointA.y) / (PointB.x - PointA.x);
    var intercept = PointA.y - PointA.x * slope;

    var a, b, c, d;

    var result = [];
    if (PointA.x > PointB.x) {
        a = parseFloat(PointA.x) + dist;
        b = slope * (a) + intercept;
        c = parseFloat(PointB.x) - dist;
        d = slope * (c) + intercept;
    }
    else {
        a = parseFloat(PointB.x) + dist;
        b = slope * (a) + intercept;
        c = parseFloat(PointA.x) - dist;
        d = slope * (c) + intercept;
    }
    result[0] = CreatePoint(a, b);
    result[1] = CreatePoint(c, d);

    return result;
}

//gets a list of nodes from a polygon geometry
function getPolygonNodes(Polygon)
{
 var nodes = [];
    var i;
  for (i=0; i < Polygon.length; i+=1) {
      var point = CreatePoint(Polygon[i].x, Polygon[i].y);
      nodes[i] = {type: "point", geometry: point};
  }

 return nodes;
}
//gets a list of nodes from a geometry collection
function getAllNodes(Geometries) {
    var nodes = [];

    var p = 0;
    Geometries.forEach(function (geom) {
        if (geom.type !== "point") {
            geom.geometry.forEach(function (item) {
                var point = CreatePoint(item.x, item.y);
                nodes[p] = {type: "point", geometry: point};
                p+=1;
            });
        }
    });
    return nodes;
}

//Gets the Azimuth Angle From 2 Points
function AzimuthAngle(PointA, PointB) {
    var dy = PointB.y - PointA.y;
    var dx = PointB.x - PointA.x;
    var angle = (Math.PI * 0.5) - Math.atan2(dy, dx);
    return angle;
}

//trying stuff
function PointToLine(PointA, PointB, PointPt) {
    var x = PointB.x - PointA.x;
    var y = PointB.y - PointA.y;
    var len = Math.pow(x, 2) + Math.pow(y, 2);
    var dx = x * (PointPt.x - PointA.x) + y * (PointPt.y - PointA.y);

    return CreatePoint(PointA.x + dx * x / len, PointA.y + dx * y / len);
}

// three points on same line
function betweenPoints(PointA, PointB, PointC) {
    return (PointC.x <= Math.max(PointA.x, PointB.x)) && (PointC.x >= Math.min(PointA.x, PointB.x)) && (PointC.y <= Math.max(PointA.y, PointB.y)) && (PointC.y >= Math.min(PointA.y, PointB.y));
}
