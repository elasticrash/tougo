//needs primitives.js and geometry.js
//create nodes at line intersections
function breaklinear(Geometries, tolerance){
    var points = [];
    var p= 0;
    for (var i = 0; i < Geometries.length; i++) {
        for (var j = 0; j < Geometries[i].geometry.length - 1; j++) {
            loop: for (var k = i; k < Geometries.length; k++) {
                for (var l = 0; l < Geometries[k].geometry.length - 1; l++) {

                    var a, b, c, d, e, f, g, h;

                    a = Geometries[i].geometry[j].x;
                    b = Geometries[i].geometry[j].y;
                    c = Geometries[i].geometry[j + 1].x;
                    d = Geometries[i].geometry[j + 1].y;

                    e = Geometries[k].geometry[l].x;
                    f = Geometries[k].geometry[l].y;
                    g = Geometries[k].geometry[l + 1].x;
                    h = Geometries[k].geometry[l + 1].y;

                    var PointAt = CreatePoint(a, b);
                    var PointBt = CreatePoint(c, d);
                    var PointCt = CreatePoint(e, f);
                    var PointDt = CreatePoint(g, h);

                    var LineA = extendLineBothSides(PointAt, PointBt, tolerance);
                    var PointA = LineA[0];
                    var PointB = LineA[1];
                    var LineB = extendLineBothSides(PointCt, PointDt, tolerance);
                    var PointC = LineB[0];
                    var PointD = LineB[1];

                    if (PointA.x === PointB.x && PointA.y === PointB.y) {
                        break loop;
                    }
                    else {
                        var PointIN = intersection(PointA, PointB, PointC, PointD);
                        if (IsIntersectionWithinLineLimits(PointA, PointB, PointC, PointD, PointIN) === true) {
                            points[p] = {
                                type: "point",
                                geometry: PointIN
                            };
                            p+=1;
                        }
                    }
                }
            }
        }
    }

    return points;
}


//delete duplicate points
function deleteduplicatePoints(Geometries) {
    var points = [];
    var p = 0;
    var i = 0;
    var j;
    Geometries.forEach(function (geom) {
        if (geom.type === "point") {
            j = 0;
            Geometries.forEach(function (altgeom) {
                if (geom.geometry.x == altgeom.geometry.x && geom.geometry.y === altgeom.geometry.y) {
                    if (i != j && geom.geometry.x != 0 && geom.geometry.y != 0) {
                        altgeom.geometry.x = 0;
                        altgeom.geometry.y = 0;
                    }
                }
                j += 1;
            });
            if (geom.geometry.x !== 0) {
                var point = CreatePoint(geom.geometry.x, geom.geometry.y);
                points[p] = {type: "point", geometry: point};
                p += 1;
            }
        }
        i += 1;
    });
    return points;
}
//get the lines from a collection
function getlines(Geometries){
	var lines = [];
    var tlines = [];
    Geometries.forEach(function (geom) {
        if (geom.type != "point") {
            geom.geometry.forEachPair(function (vertices) {
                    var Polygon = [];
                    Polygon[0] = CreatePoint(vertices[0].x, vertices[0].y);
                    Polygon[1] = CreatePoint(vertices[1].x, vertices[1].y);
                    tlines = {
                        type: "line",
                        geometry: Polygon
                    };
                    lines.push(tlines);
            });
        }
	});
	return lines;
}

//trim any geometry that does not participate in the creation of a polygon
function removeDangles(Lines, tolerance){
	var dangles = 1;

	while (dangles > 0) {
		var nodes = deleteduplicatePoints(getAllNodes(Lines));
		var intersections = deleteduplicatePoints(breaklinear(Lines, tolerance));
		var alone = [];
		var p = 0;
        var i;
        var j;
		for (i = 0; i < nodes.length; i++) {
			var danglePoint = 0;
			for (j = 0; j < intersections.length; j++) {
				var stream = [];
				stream[0] = intersections[j].geometry.x - tolerance;
				stream[1] = parseFloat(intersections[j].geometry.y) + tolerance;
				stream[2] = parseFloat(intersections[j].geometry.x) + tolerance;
				stream[3] = parseFloat(intersections[j].geometry.y) + tolerance;
				stream[4] = parseFloat(intersections[j].geometry.x) + tolerance;
				stream[5] = intersections[j].geometry.y - tolerance;
				stream[6] = intersections[j].geometry.x - tolerance;
				stream[7] = intersections[j].geometry.y - tolerance;
				
				if (PointInPolygon(CreatePolygon(stream), nodes[i].geometry.x, nodes[i].geometry.y)) {
					danglePoint++;
					break;
				}
			}
			
			if (danglePoint === 0) {
				alone[p] = nodes[i];
				p++;
			}
		}
		if (alone.length === 0) {
			dangles = 0;
		}			
		for (i = 0; i < alone.length; i++) {
			for (j = 0; j < Lines.length; j++) {
			
				var A = CreatePoint(Lines[j].geometry[0].x, Lines[j].geometry[0].y);
				var B = CreatePoint(Lines[j].geometry[1].x, Lines[j].geometry[1].y);
				
				if (alone[i].geometry.x === A.x && alone[i].geometry.y === A.y) {
					Lines.splice(j, 1);
					continue;
				}
				if (alone[i].geometry.x === B.x && alone[i].geometry.y === B.y) {
					Lines.splice(j, 1);
					continue;
				}
			}
		}
	}
	
	return Lines;
}

//Convert a geometry to points
function convertToPoints(Geometries) {
    var points = [];

    for (var i = 0; i < Geometries.length; i++) {
        if (Geometries[i].type != "point") {
            for (var j = 0; j < Geometries[i].geometry.length - 1; j++) {
                var p = CreatePoint(Geometries[i].geometry[j].x, Geometries[i].geometry[j].y);
                points.push({
                    type: "point",
                    geometry: p
                });
            }
        }
    }
    return points;
}
//get anchor points
function getAnchorPoints(Geometries) {
    var anchor = [];
    var anchorCount;
    for (var i = 0; i < Geometries.length; i++) {
        if (Geometries[i].type === "point") {
            anchorCount = 0;
            for (var j = 0; j < Geometries.length; j++) {
                if (Geometries[i].geometry.x === Geometries[j].geometry.x && Geometries[i].geometry.y === Geometries[j].geometry.y) {
                    if (i != j && Geometries[i].geometry.x != 0 && Geometries[i].geometry.y != 0) {
                        anchorCount++;
                    }
                }
            }
        }
        if (anchorCount > 2) {
            var p = CreatePoint(Geometries[i].geometry.x, Geometries[i].geometry.y);
            anchor.push({
                type: "point",
                geometry: p
            });
        }
    }
    return anchor;
}

function getConnectedLineNumbers(Lines, tolerance) {
    var all_point = getAllNodes(Lines);
    var points_no_duplicates = deleteduplicatePoints(getAllNodes(Lines));
    var PC = [];
    points_no_duplicates.forEach(function (pnt) {
        var pntcount = 0;
        all_point.forEach(function (pnt2) {
            if (pnt.geometry.x === pnt2.geometry.x && pnt.geometry.y === pnt2.geometry.y) {
                pntcount++;
            }
        });
        pnt.pntCount = pntcount;
        PC.push(pnt);
    });

    return PC;
}

function connectEverything(nodes) {

    var lines = [];
    nodes.forEach(function (node_init) {
        nodes.forEach(function (node_clone) {
            if (node_init.geometry.x !== node_clone.geometry.x && node_init.geometry.y !== node_clone.geometry.y) {
                var feature=[];
                feature[0] = CreatePoint(node_init.geometry.x, node_init.geometry.y);
                feature[1] = CreatePoint(node_clone.geometry.x, node_clone.geometry.y);
                var nlines = {
                    type: "line",
                    geometry: feature
                };
                lines.push(nlines);
            }
        });
    });
    return lines;
}

function cleanupIntersectingFeatures(lines, original_lines) {
    var cleaned_lines = [];
    lines.forEach(function (line) {
        var allfalse = false;
        var j;
        for (j = 0; j < original_lines.length; j++) {
            line_orig = original_lines[j];
            var inter = intersection(line.geometry[0], line.geometry[1],line_orig.geometry[0], line_orig.geometry[1]);
            var lwll = IsIntersectionWithinLineLimits(line.geometry[0], line.geometry[1],line_orig.geometry[0], line_orig.geometry[1],inter);
           if(lwll === true)
           {
               allfalse = true;
               break;
           }
        }
        if(allfalse === false)
        {
            cleaned_lines.push(line);
        }
    });
    return cleaned_lines;
}