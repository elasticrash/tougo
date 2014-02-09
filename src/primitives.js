//create a circle
function CreateCircle(point, radius, segments)
{
	var seg = Math.PI * 2 / segments;
    var PTS = [];
    
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

//create a polygon
function CreatePolygon(xyArray){
    var Polygon = [];
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

//create a point
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
//create a star
function CreateStar(point, radius, segments)
{
	var seg = Math.PI * 2 / segments;
    var PTS = [];
    
    var y = 0;
    for (var i = 0; i < segments; i++)
    {
        var theta = seg * i;
        if(isOdd(i))
        {
        PTS[y] = point.x + Math.cos( theta ) * (radius*2);
        PTS[y+1] = point.y + Math.sin( theta ) * (radius*2);
        }
        else
        {
        PTS[y] = point.x + Math.cos( theta ) * radius;
        PTS[y+1] = point.y + Math.sin( theta ) * radius;
        }
        
        y=y+2;
     }
    PTS[segments*2] = point.x + Math.cos( 0 ) * radius;
    PTS[segments*2+1] = point.y + Math.sin( 0 ) * radius;
	
	return CreatePolygon(PTS);
}

//create line using point, angle, distance
function CreateLineFromPointAngleDist(PointA, angle, dist)
{
    var newPt = CreatePoint(PointA.x, PointA.y);
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

function isOdd(num) { return num % 2;}

