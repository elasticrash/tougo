//a polygon simplification algorithm I wrote based on a tolerance value
function Simplify(feature, tolerance){
    var polygon = features[0].geometry.components[0];
    var truePolygon = polygon.getVertices();
    var simplefiedPolygon = [];

    simplefiedPolygon[0] = truePolygon[0];

    var ivertex = 0;
    var ipoint = 0;

    for (var c = 0; c < truePolygon.length - 2; c++) {
        var point1 = [];

        point1 = {
            x: truePolygon[ivertex].x,
            y: truePolygon[ivertex].y
        };

        var point2 = [];
        point2 = {
            x: truePolygon[c + 2].x,
            y: truePolygon[c + 2].y
        };

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

        if (run == -1) {
            ipoint++;
            ivertex = c + 1;
            simplefiedPolygon[ipoint] = truePolygon[c + 1];
        }
    }
    simplefiedPolygon[ipoint + 1] = truePolygon[truePolygon.length - 2];
    simplefiedPolygon[ipoint + 2] = truePolygon[truePolygon.length - 1];

    var ring = new OpenLayers.Geometry.LinearRing(simplefiedPolygon);
    var polygon = new OpenLayers.Geometry.Polygon([ring]);
    var attributes = {name: "my name", bar: "foo"};
    var newfeature = new OpenLayers.Feature.Vector(polygon, attributes);

    return newfeature;
}
