/**
 * Created by tougo on 12/12/15.
 */
function Geometry2Collection(item) {
    if (item.type) {
        var GeometryCollection = [];
        GeometryCollection.push(item);
        return GeometryCollection;
    } else {
        return item;
    }
}

Array.prototype.forEachPair = function(callback, thisArg) {

    var T, k;

    if (this == null) {
        throw new TypeError(' this is null or not defined');
    }

    var O = Object(this);

    var len = O.length >>> 0;

    if (typeof callback !== "function") {
        throw new TypeError(callback + ' is not a function');
    }

    if (arguments.length > 1) {
        T = thisArg;
    }

    k = 1;

    while (k < len) {

        var kValue = [];

        if (k in O) {

            kValue[0] = O[k-1];
            kValue[1] = O[k];

            callback.call(T, kValue, k, O);
        }
        k++;
    }
};

Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

Array.prototype.min = function() {
    return Math.min.apply(null, this);
};
