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
