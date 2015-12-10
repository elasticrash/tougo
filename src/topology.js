//needs primitives.js and geometry.js
//create nodes at line intersections
function breaklinear(data, tolerance){
	var points = [];
	var p= 0;
    for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < data[i].geometry.length - 1; j++) {
			loop: for (var k = i; k < data.length; k++) {
				for (var l = 0; l < data[k].geometry.length - 1; l++) {
				
				var a, b, c, d, e, f, g, h;
				
				a = data[i].geometry[j].x;
				b = data[i].geometry[j].y;
				c = data[i].geometry[j + 1].x;
				d = data[i].geometry[j + 1].y;
				
				e = data[k].geometry[l].x;
				f = data[k].geometry[l].y;
				g = data[k].geometry[l + 1].x;
				h = data[k].geometry[l + 1].y;
					
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
							p++;
						}
					}
				}
			}
		}
	}
	
	return points;
}

//delete duplicate points
function deleteduplicatePoints(Geometries)
{
	var points = [];
	var p= 0;
			for (var i = 0; i < Geometries.length; i++) {
		if (Geometries[i].type === "point") {
				for (var j = 0; j < Geometries.length; j++) {
					if (Geometries[i].geometry.x == Geometries[j].geometry.x && Geometries[i].geometry.y === Geometries[j].geometry.y) {
						if (i != j && Geometries[i].geometry.x !=0 && Geometries[i].geometry.y !=0) {
							Geometries[j].geometry.x =0;
							Geometries[j].geometry.y =0;
						}
					}
				}
				
				if(Geometries[i].geometry.x !== 0)
				{
					var point = CreatePoint(Geometries[i].geometry.x, Geometries[i].geometry.y);
					points[p] = {type: "point", geometry: point};
					p++;
				}
		}
	}
	return points;
}
//get the lines from a collection
function getlines(Geometries){
	var p = 0;
	var lines = [];
	for (var i = 0; i < Geometries.length; i++) {
		if (Geometries[i].type != "point") 
			for (var j = 0; j < Geometries[i].geometry.length - 1; j++) {
				var Polygon = [];
				Polygon[0] = CreatePoint(Geometries[i].geometry[j].x,Geometries[i].geometry[j].y);
				Polygon[1] = CreatePoint(Geometries[i].geometry[j + 1].x,Geometries[i].geometry[j + 1].y);
				lines[p] = {
					type: "lines",
					geometry: Polygon
				};
				p++;
			}
	}
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

		for (var i = 0; i < nodes.length; i++) {
			var danglePoint = 0;
			for (var j = 0; j < intersections.length; j++) {
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
		for (var i = 0; i < alone.length; i++) {
			for (var j = 0; j < Lines.length; j++) {
			
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
function convertToPoints(Geometries){
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
function getAnchorPoints(Geometries){
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

