tougo
=====

javascript 2D geometry and topology tools

This is a small set of geometry tools I had written around 2012 for a small project, as well as a basic html5
renderer. Since then I try to maintain it and expand it further. I know there are a lot of other similar APIs out there doing exactly the same thing even in 3D.

The part where I differ and I am especially proud of is the removeDangles function in the topology.js file, that, for those that are not familiar with the term, it trims any line, in a line collection that does not participate in any potential line to polygon conversion.

Unfortunately I havent yet written the function to transform the lines to polygons, but I intend to do so.
## 26 March 2016

Big changes in my life, switching jobs, countries. Big changes for this small project as well. I am making it a bit more GIS-ish (Geographical Information Systems -ish). I know there are a lot of map viewers out there but sometimes if we don't do things from scratch we won't grow and learn. So I made a WMS viewer for Canvas. Unfortunately on this first commit it doesnt work about the box for every coordinate system out there, but soon I hope it will. Also its not 100% compatible :P with the rest of the project, more like a standalone feature for the time being. [Check it out](http://elasticrash.github.io/tougo/example_wms.html)

## 10 December 2015

I noticed how poorly some things were written (we grow/ we learn) and I am currently re-writing everything, plus I am adding some extra algorithms I have written in the meantime, for some other projects. Also I am expanding the examples. If anyone is even remotely interested he/she can join and do a PR

beware, examples demonstratre a small portion of the code, currently due to redesigning there are a lot of things that aren't working 

## 1 December 2015

I decided to port the library to be used out of the box with OpenLayers 2.x because there was a need in another project of mine. This library is not really maintained but I do my best to add things when I need them.


additionally
=====
drawing.js has basic html5 canvas drawing functions in case you dont want to implement yours


usage example (display polygons) --updated 6/4/2016

0. I converted the code so that functions would no longer be global. Instead everything is packed in 4 closure functions
```primitives``` ```geometrical``` ```rendering``` ```topology```
1. Read Polygon Coordinates as a xy Array
``` Geometries[i] ={ type : "polygon", geometry : primitives.CreatePolygon(xyArray)};```
2. Calculate the Bounding Box
```var BBox = geometrical.getBoundingBox(Geometries);```
3. Transform Polygon Coordinate to the Local Canvas System
```var tr = geometrical.transform(Geometries, BBox, Canvas_width, Canvas_height);```
4. Draw the Polygons on the Canvas Element
```rendering.drawing(tr (transformed geometries), fill (true/false), '243011'(hex color without #), canvas (the canvas object));```
```rendering.drawing(tr, false, '243011', canvas);```

visit http://elasticrash.github.io/tougo/ for more info and examples
