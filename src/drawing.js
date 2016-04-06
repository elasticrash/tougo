//needs primitives.js
/*global CreatePoint:false */
var rendering = function () {
    var Box = [];
    
    return {
        setBBox: function (box) {
            Box = box;
        },
        drawing: function (Geometries, fill, fillcolor, canvas) {
            Geometries = Geometry2Collection(Geometries);

            if (canvas.getContext) {
                var lines = canvas.getContext("2d");
                lines.beginPath();
                Geometries.forEach(function (geom) {
                    if (geom.type !== "point") {
                        var j = 0;
                        geom.geometry.forEach(function (item) {
                            if (j === 0) {
                                lines.moveTo(item.x, item.y);
                            }
                            else {
                                lines.lineTo(item.x, item.y);
                            }
                            j += 1;
                        });
                    }
                    if (geom.type === "point") {
                        lines.moveTo(geom.geometry.x, geom.geometry.y);
                        lines.arc(geom.geometry.x, geom.geometry.y, 4, Math.PI * 2, 0, true);
                    }
                });

                if (fill === true) {
                    lines.fillStyle = '#' + fillcolor;
                    lines.fill();
                }
                lines.strokeStyle = '#' + fillcolor;
                lines.stroke();
                lines.closePath();
            }
        },
        drawingtext: function (Geometries, attribute, canvas) {
            if (canvas.getContext) {
                Geometries.forEach(function (geom) {
                    var text = canvas.getContext("2d");
                    text.font = "18px serif";
                    text.fillText(geom[attribute], geom.geometry.x, geom.geometry.y);
                });
            }
        },
        getpixelsize: function (width) {
            var lw = Box.Xmax - Box.Xmin;

            //pixel
            return Math.round((lw / width) * 100) / 100;
        },
        currentLocation: function (ev, canvas) {
            var pixel = this.getpixelsize(canvas.clientWidth);

            var xt, yt;


            if (typeof ev.offsetX === 'undefined') {
                var eoffsetX = ev.clientX - $(ev.target).offset().left + window.pageXOffset;
                var eoffsetY = ev.clientY - $(ev.target).offset().top + window.pageYOffset;

                xt = Box.Xmin + (eoffsetX) * pixel;
                yt = eoffsetY * pixel;
            }
            else {
                xt = Box.Xmin + (ev.offsetX) * pixel;
                yt = Box.Ymin + (canvas.clientHeight - ev.offsetY) * pixel;
            }

            var x = Math.round(xt * 100) / 100;
            var y = Math.round(yt * 100) / 100;

            //currentPoints
            return primitives.CreatePoint(x, y);
        },
        select: function (canvas, ev, geom) {
            var cur = this.currentLocation(ev, canvas);
            cur.y = Math.abs(cur.y);

            var a = canvas.width / canvas.clientWidth;
            var b = canvas.height / canvas.clientHeight;
            cur.x = cur.x * a;
            cur.y = cur.y * b;
            var i;
            for (i = 0; i < geom.length; i += 1) {
                if (geom[i].type != "point") {
                    if (geometrical.PointInPolygon(geom[i].geometry, cur.x, cur.y)) {
                        var g = [];
                        g[0] = geom[i];
                        this.drawing(g, true, "8D638B", canvas);
                    }
                }
            }
        },
        clearcanvas: function (canvas) {
            var context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
}();