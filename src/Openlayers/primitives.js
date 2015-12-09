//create a circle
function CreateCircle(point, radius, segments) {
    var seg = Math.PI * 2 / segments;
    var points = [];

    var pcount = 0;
    var i;
    for (i = 0; i < segments; i+=1) {
        var theta = seg * i;
        var p1x = point.x + Math.cos(theta) * radius;
        var p1y = point.y + Math.sin(theta) * radius;
        points[pcount] = CreateOpenLayersPoint(p1x, p1y);
        pcount+=1;
    }

    var p2x = point.x + Math.cos(0) * radius;
    var p2y = point.y + Math.sin(0) * radius;
    points[segments] = CreateOpenLayersPoint(p2x, p2y);

    return CreatePolygon(points);
}

function CreateOpenLayersPoint(x,y) {
    var opoint = new OpenLayers.Geometry.Point(x, y);
    return opoint;
}

function CreatePolygon(points) {
    var ring = new OpenLayers.Geometry.LinearRing(points);
    var polygon = new OpenLayers.Geometry.Polygon([ring]);
    return polygon;
}
function CreateLine(points) {
    var line = new OpenLayers.Geometry.LineString(points);
    return line;
}
function CreateStar(point, radius, segments) {
    var seg = Math.PI * 2 / segments;
    var points = [];

    var pcount = 0;
    var i;
    for (i = 0; i < segments; i+=1) {
        var theta = seg * i;
        if (isOdd(i)) {
            var ptxodd = point.x + Math.cos(theta) * (radius * 2);
            var ptyodd = point.y + Math.sin(theta) * (radius * 2);
            points[pcount] = CreateOpenLayersPoint(ptxodd, ptyodd);
        }
        else {
            var ptxeven = point.x + Math.cos(theta) * radius;
            var ptyeven = point.y + Math.sin(theta) * radius;
            points[pcount] = CreateOpenLayersPoint(ptxeven, ptyeven);
        }
        pcount+=1;
    }
    var ptx = point.x + Math.cos(0) * radius;
    var pty = point.y + Math.sin(0) * radius;
    points[segments] = CreateOpenLayersPoint(ptx, pty);

    return CreatePolygon(points);
}

function CreateLineFromPointAngleDist(PointA, angle, dist) {
    var newPt = CreateOpenLayersPoint(PointA.x, PointA.y);
    PointA.x += Math.cos(angle) * dist;
    PointA.y += Math.sin(angle) * dist;

    var Line = [];

    Line[0] = CreateOpenLayersPoint(PointA.x, PointA.y);
    Line[1] = CreateOpenLayersPoint(newPt.x, newPt.y);

    return CreateLine(Line);
}

function isOdd(num) { return num % 2;}
