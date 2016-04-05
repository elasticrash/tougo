var primitives = function () {

    function isOdd(num) {
        return num % 2;
    }
    
    return {
        //create a circle
        CreateCircle: function (point, radius, segments) {
        var seg = Math.PI * 2 / segments;
        var Geom = [];
        var theta;
        var i;

        for (i = 0; i < segments; i += 1) {
            theta = seg * i;
            Geom[i] = {
                x: point.x + Math.cos(theta) * radius,
                y: point.y + Math.sin(theta) * radius
            };
        }
        Geom[i] = {
            x: point.x + Math.cos(0) * radius,
            y: point.y + Math.sin(0) * radius
        };

        return Geom;
    },
        //create a polygon
        CreatePolygon: function (xyArray) {
        var Geom = [];
        var t = 0;
        var i;

        for (i = 0; i < xyArray.length; i = i + 2) {
            Geom[t] = {
                x: xyArray[i],
                y: xyArray[i + 1]
            };
            t += 1;
        }
        return Geom;
    },
        //create a point
        CreatePoint: function (x, y) {

        x = x * 1000;
        y = y * 1000;

        x = Math.round(x);
        y = Math.round(y);

        var Point = {
            x: x / 1000,
            y: y / 1000
        };
        return Point;
    },
        //create a star
        CreateStar: function (point, radius, segments) {
        var seg = Math.PI * 2 / segments;
        var Geom = [];
        var theta;
        var i;
        for (i = 0; i < segments; i += 1) {
            theta = seg * i;
            if (isOdd(i)) {
                Geom[i] = {
                    x: point.x + Math.cos(theta) * (radius * 2),
                    y: point.y + Math.sin(theta) * (radius * 2)
                };
            }
            else {
                Geom[i] = {
                    x: point.x + Math.cos(theta) * radius,
                    y: point.y + Math.sin(theta) * radius
                };
            }
        }
        Geom[i] = {
            x: point.x + Math.cos(0) * radius,
            y: point.y + Math.sin(0) * radius
        };

        return Geom;
    },
        //create line using point, angle, distance
        CreateLineFromPointAngleDist: function (PointA, angle, dist) {
        var newPt = this.CreatePoint(PointA.x, PointA.y);
        PointA.x += Math.cos(angle) * dist;
        PointA.y += Math.sin(angle) * dist;

        var Line = [];

        Line[0] = {
            x: PointA.x,
            y: PointA.y
        };

        Line[1] = {
            x: newPt.x,
            y: newPt.y
        };

        return Line;
    }
}
}();