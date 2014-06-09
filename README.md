tougo
=====

javascript 2D geometry and topology tools

This is a small set of geometry tools I had written around 2012 for a small project, as well as a basic html5
renderer. Since then I try to maintain it and expand it furthur. I know there are a lot of other similar APIs out there doing exactly the same thing even in 3D.

The part where I differ and I am especially proud of is the removeDangles function in the topology.js file, that, for those that are not familiar with the term, it trims any line, in a line collection that does not participate in any potential line to polygon conversion.

Unfortunately I havent yet written the function to transform the lines to polygons, but I intend to do so.

additionally
=====
drawing.js has basic html5 canvas drawing functions in case you dont want to implement yours
jquery.tougo is a semi-failed attempt for a standard interface not at all necessary but I might work on it some time in the future.



usage example (display polygons)

1. Read Polygon Coordinates as a xy Array
``` Geometries[i] ={ type : "polygon", geometry : CreatePolygon(xyArray)};```
2. Calculate the Bounding Box
```var BBox = getBoundingBox(Geometries);```
3. Transform Polygon Coordinate to the Local Canvas System
```var tr = transform(Geometries, BBox, Canvas_width, Canvas_height);```
4. Draw the Polygons on the Canvas Element
```drawing(tr (transformed geometries), fill (true/false), '243011'(hex color without #), canvas (the canvas object));```
```drawing(tr, false, '243011', canvas);```

visit http://elasticrash.github.io/tougo/ for more info and examples
