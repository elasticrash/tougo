//needs primitives.js
/*global CreateOpenLayersPoint:false */
function PointInPolygon(feature, x, y) {
    var poly = feature.geometry.components[0].getVertices();

    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= y && y < poly[j].y) || (poly[j].y <= y && y < poly[i].y)) &&
        (x < (poly[j].x - poly[i].x) * (y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x) &&
        (c = !c);
    if (c === true)
        return true;
    else
        return false;
}
//a polygon simplification algorithm I wrote based on a tolerance value
function Simplify(features, tolerance) {
    var truePolygon = features[0].geometry.components[0].getVertices();
    var simplefiedPolygon = [];

    simplefiedPolygon[0] = CreateOpenLayersPoint(truePolygon[0].x, truePolygon[0].y);

    var ivertex = 0;
    var ipoint = 0;

    for (var c = 0; c < truePolygon.length - 2; c++) {
        var point1 = CreateOpenLayersPoint(truePolygon[ivertex].x, truePolygon[ivertex].y);
        var point2 = CreateOpenLayersPoint(truePolygon[c + 2].x, truePolygon[c + 2].y);

        var MidPoints = [];

        for (var j = 0; j < (c + 1 - ivertex); j++) {
            MidPoints[j] = truePolygon[ivertex + j + 1];
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

        if (run === -1) {
            ipoint++;
            ivertex = c + 1;
            simplefiedPolygon[ipoint] = CreateOpenLayersPoint(truePolygon[c + 1].x, truePolygon[c + 1].y);
        }
    }
    simplefiedPolygon[ipoint + 1] = truePolygon[truePolygon.length - 2];
    simplefiedPolygon[ipoint + 2] = truePolygon[truePolygon.length - 1];

    var ring = new OpenLayers.Geometry.LinearRing(simplefiedPolygon);
    var polygon = new OpenLayers.Geometry.Polygon([ring]);
    var attributes = {
        name: "my name",
        bar: "foo"
    };
    var newfeature = new OpenLayers.Feature.Vector(polygon, attributes);

    return newfeature;
}
