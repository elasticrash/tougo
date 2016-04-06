/**
 * Created by tougo on 6/4/16.
 */
//primitives.js
test( "create Point test", function( ) {
    var result = primitives.CreatePoint(55,45);
    equal( result, {x:55,y:45}, "Passed!" );
});
//geometry.js
test( "distance function test", function( ) {
    var result = geometrical.distance({x:1,y:1},{x:4,y:1});
    equal( result, 3, "Passed!" );
});
test( "centroid function test", function( ) {
    var result = geometrical.GetCentroid({type: "polygon",geometry:[{x:0,y:0},{x:4,y:0},{x:4,y:4},{x:0,y:4}]});
    equal( result, {x:2, y:2}, "Passed!" );
});