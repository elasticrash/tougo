//needs primitives.js
/*global CreatePoint */
//returns true if a point is inside a particular polygon
var geometrical = function () {
    return {
        PointInPolygon: function (poly, x, y) {
            "use strict";
            var c = false;
            var l = poly.length;
            var i = -1;
            var j;
            for (j = l - 1; ++i < l; j = i) {
                if (((poly[i].y <= y && y < poly[j].y) || (poly[j].y <= y && y < poly[i].y)) &&
                    (x < (poly[j].x - poly[i].x) * (y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)) {
                    c = !c;
                }
            }
            return c === true;
        },
        //a polygon simplification algorithm I wrote 2 years ago based on a tolerance value
        Simplify: function (Polygon, tolerance) {
            var simplefiedPolygon = [];
            if (Polygon.geometry.length > 2) {
                simplefiedPolygon[0] = Polygon.geometry[0];

                var ivertex = 0;
                var ipoint = 0;
                var c = 0;
                var point1 = [];
                var point2 = [];

                Polygon.geometry.forEach(function (vertex) {
                    if (c < Polygon.geometry.length - 2) {
                        point1 = {
                            x: Polygon.geometry[ivertex].x,
                            y: Polygon.geometry[ivertex].y
                        };

                        point2 = {
                            x: Polygon.geometry[c + 2].x,
                            y: Polygon.geometry[c + 2].y
                        };

                        var MidPoints = [];

                        var j;
                        for (j = 0; j < (c + 1 - ivertex); j += 1) {
                            MidPoints[j] = Polygon.geometry[ivertex + j + 1];
                        }

                        var D = Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2));
                        var y1my2 = (point1.y - point2.y);
                        var x2mx1 = (point2.x - point1.x);
                        var C = (point2.y * point1.x) - (point1.y * point2.x);

                        var run = 1;

                        var dist;
                        MidPoints.forEach(function (midp) {
                            dist = Math.abs(midp.x * y1my2 + midp.y * x2mx1 + C) / D;
                            if (dist > tolerance) {
                                run = -1;
                            }
                        });

                        if (run === -1) {
                            ipoint += 1;
                            ivertex = c + 1;
                            simplefiedPolygon[ipoint] = Polygon.geometry[c + 1];
                        }
                    }
                    c += 1;
                });
                simplefiedPolygon[ipoint + 1] = Polygon.geometry[Polygon.geometry.length - 2];
                simplefiedPolygon[ipoint + 2] = Polygon.geometry[Polygon.geometry.length - 1];

            }
            else {
                simplefiedPolygon[0] = Polygon.geometry[0];
                simplefiedPolygon[1] = Polygon.geometry[1];
            }
            return simplefiedPolygon;

        },
        // get the intersection of 2 lines
        intersection: function (PointA, PointB, PointC, PointD) {
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

            cross = primitives.CreatePoint(crossx, crossy);

            return cross;
        },
        // checks if the intersection point from the previous function is within certain line segments
        IsIntersectionWithinLineLimits: function (PointA, PointB, PointC, PointD, cross, equals) {
            var Ax = [PointA.x, PointB.x];
            var Ay = [PointA.y, PointA.y];

            var Bx = [PointC.x, PointD.x];
            var By = [PointC.y, PointD.y];

            if (!equals) {
                if (cross.x > Bx.min() && cross.x < Bx.max() && cross.x > Ax.min() && cross.x < Ax.max()) {
                    if ((cross.y > By.min() && cross.y < By.max()) || (cross.y > Ay.min() && cross.y < Ay.max())) {
                        return true;
                    }
                }
            } else {
                if (cross.x >= Bx.min() && cross.x <= Bx.max() && cross.x >= Ax.min() && cross.x <= Ax.max()) {
                    if ((cross.y >= By.min() && cross.y <= By.max()) || (cross.y >= Ay.min() && cross.y <= Ay.max())) {
                        return true;
                    }
                }
            }

            return false;
        },
        //simple 2D distance function
        distance: function (PointA, PointB) {
            return Math.sqrt(Math.pow(PointB.x - PointA.x, 2) + Math.pow(PointB.y - PointA.y, 2));
        },
        //scale and offset
        transform: function (oldGeometries, Boxobj, width, height) {
            var TransformedGeometries = [];

            var lw = Boxobj.Xmax - Boxobj.Xmin;
            var ly = Boxobj.Ymax - Boxobj.Ymin;

            lw = lw < ly ? lw : ly;

            width = width < height ? width : height;

            var Geometries;
            oldGeometries.forEach(function (oldgeom) {
                Geometries = [];
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

                var transformed_geom = oldgeom;
                transformed_geom.geometry = Geometries;
                TransformedGeometries.push(transformed_geom);
            });

            return TransformedGeometries;
        },
        //get the bounding box of a geometry
        getBoundingBox: function (Geometries) {
            var alllinesx = [];
            var alllinesy = [];
            Geometries.forEach(function (geom) {
                geom.geometry.forEach(function (vertex) {
                    alllinesx.push(parseFloat(vertex.x));
                    alllinesy.push(parseFloat(vertex.y));
                });
            });

            return {
                Xmin: Math.min.apply(null, alllinesx),
                Xmax: Math.max.apply(null, alllinesx),
                Ymin: Math.min.apply(null, alllinesy),
                Ymax: Math.max.apply(null, alllinesy)
            };
        },
        //get the area of a polygon
        GetArea: function (Polygon) {
            var p1 = 0;
            var p2 = 0;
            Polygon.geometry.forEachPair(function (vertices) {
                p1 += (vertices[0].x * vertices[1].y);
                p2 += (vertices[0].y * vertices[1].x);
            });
            var area = p1 - p2;
            return area * 0.5;
        },
        //gets the centroid of a polygon
        GetCentroid: function (Polygon) {
            var cx = 0;
            var cy = 0;
            Polygon.geometry.forEachPair(function (vertices) {
                cx = cx + (vertices[0].x + vertices[1].x) * (vertices[0].x * vertices[1].y - vertices[1].x * vertices[0].y);
                cy = cy + (vertices[0].y + vertices[1].y) * (vertices[0].x * vertices[1].y - vertices[1].x * vertices[0].y);
            });
            cx = 1 / (6 * this.GetArea(Polygon)) * cx;
            cy = 1 / (6 * this.GetArea(Polygon)) * cy;
           return {x: cx, y: cy};
        },
        //extends a line segments equally from both sides
        extendLineBothSides: function (PointA, PointB, dist) {
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
            result[0] = primitives.CreatePoint(a, b);
            result[1] = primitives.CreatePoint(c, d);

            return result;
        },
        //gets a list of nodes from a polygon geometry
        getPolygonNodes: function (Polygon) {
            var nodes = [];
            Polygon.geometry.forEach(function (vertex) {
                var point = primitives.CreatePoint(vertex.x, vertex.y);
                nodes.push({type: "point", geometry: point});
            });

            return nodes;
        },
        //gets a list of nodes from a geometry collection
        getAllNodes: function (Geometries) {
            var nodes = [];

            var p = 0;
            Geometries.forEach(function (geom) {
                if (geom.type !== "point") {
                    geom.geometry.forEach(function (item) {
                        var point = primitives.CreatePoint(item.x, item.y);
                        nodes[p] = {type: "point", geometry: point};
                        p += 1;
                    });
                }
            });
            return nodes;
        },
        //Gets the Azimuth Angle From 2 Points
        AzimuthAngle: function (PointA, PointB) {
            var dy = PointB.y - PointA.y;
            var dx = PointB.x - PointA.x;
            return (Math.PI * 0.5) - Math.atan2(dy, dx);
        },
        //trying stuff
        PointToLine: function (PointA, PointB, PointPt) {
            var x = PointB.x - PointA.x;
            var y = PointB.y - PointA.y;
            var len = Math.pow(x, 2) + Math.pow(y, 2);
            var dx = x * (PointPt.x - PointA.x) + y * (PointPt.y - PointA.y);

            return primitives.CreatePoint(PointA.x + dx * x / len, PointA.y + dx * y / len);
        },
        // three points on same line
        betweenPoints: function (PointA, PointB, PointC) {
            return (PointC.x <= Math.max(PointA.x, PointB.x)) && (PointC.x >= Math.min(PointA.x, PointB.x)) && (PointC.y <= Math.max(PointA.y, PointB.y)) && (PointC.y >= Math.min(PointA.y, PointB.y));
        },
        //whether a point is left or right from a line
        isLeft: function (a, b, c) {
            "use strict";
            return ((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) > 0;
        }
    }
}();