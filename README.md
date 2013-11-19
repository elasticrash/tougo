tougo
=====

javascript geometry and topology tools

This is a small set of geometry tools I had written around a years ago for a small project, as well as a basic html5
renderer. I opened this repo in case I am back in the mood. Once upon a time I had written a lot of examples but now
only one survives here http://codentonic.net/2013/04/21/cad-implementation-using-the-javascript-based-topology-library/

Personally I am especially proud of the removeDangles function in the topology.js file, that, for those that are not familiar
with the term, it trims any line, in a line collection that does not participate in any potential line to polygon
conversion.

Unfortunately I havent yet written the function to transform the lines to polygons, but I intend to do so

jquery.tougo is a semi-failed attempt for a standard interface not really necessary
drawing.js has basic html5 canvas drawing functions