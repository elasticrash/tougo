//needs primitives.js
/*global CreatePoint:false */
var rendering = new function () {
    //var Ccanvas = canvas;
    //var Cgeometry = geometry;
    var Box = [];
    var mousedownC = [];

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
        createZoomBox: function (A, B, bxy) {
            return {
                Xmin: A.x + bxy,
                Xmax: B.x - bxy,
                Ymin: B.y + bxy,
                Ymax: A.y - bxy
            };
        },
        createPanBox: function (Static_Box) {

            var lx = mousedownC.x - center.x;
            var ly = mousedownC.y - center.y;

            return {
                Xmin: Static_Box.Xmin + lx,
                Xmax: Static_Box.Xmax + lx,
                Ymin: Static_Box.Ymin + ly,
                Ymax: Static_Box.Ymax + ly
            };
        },
        zoomin: function (canvas) {
            canvas.unbind('click', zout);
            canvas.bind('click', zin);
        },

        zoomout: function (canvas) {
            canvas.unbind('click', zin);
            canvas.bind('click', zout);
        },
        zin: function () {
            clearcanvas();
            var Zbox = createZoomBox(primitives.CreatePoint(Box.Xmin, Box.Ymax), CreatePoint(Box.Xmax, Box.Ymin), getZoomValue());
            Box = Zbox;
            var gitem = transform(Cgeometry, Box, canvas.width, canvas.height);
            drawing(gitem, false, "00f", canvas);
        },
        zout: function () {
            clearcanvas();
            var Zbox = createZoomBox(primitives.CreatePoint(Box.Xmin, Box.Ymax), CreatePoint(Box.Xmax, Box.Ymin), -getZoomValue());
            Box = Zbox;
            var gitem = transform(Cgeometry, Box, canvas.width, canvas.height);
            drawing(gitem, false, "00f", canvas);
        },
        getZoomValue: function () {
            var zx = (Box.Xmax - Box.Xmin) / 8;
            var zy = (Box.Ymax - Box.Ymin) / 8;

            if (zx > zy) {
                return zy;
            }
            else {
                return zx;
            }
        },
        pan: function (canvas) {
            canvas.unbind('click', zin);
            canvas.unbind('click', zout);
            canvas.unbind('mousedown', select);

            canvas.mousedown(function () {
                mousedownC = center;
                var Static_Box = Box;
                canvas.mousemove(function (event) {
                    clearcanvas();

                    var Zbox = createPanBox(Static_Box);
                    var gitem = transform(Cgeometry, Zbox, canvas.width, canvas.height);
                    drawing(gitem, false, "00f", canvas);

                    canvas.mouseup(function (event) {
                        canvas.unbind('mousedown');
                        canvas.unbind('mousemove');
                        Box = Zbox;
                    });
                });
            });
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
                        //var lg = geometrical.transform(g, Box, canvas.width, canvas.height);
                        this.drawing(g, true, "8D638B", canvas);
                    }
                }
            }
        },
        clearcanvas: function () {
            Ccanvas.width = Ccanvas.width;
        }
    }
}();