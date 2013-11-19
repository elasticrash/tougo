//simple function to transform a geometry entity to a basic dxf structure
function exportdxf(past) {
    var Writer = [];
    
	if(past.length > 0) {
		Writer.push("0");
		Writer.push("SECTION");
		Writer.push("2");
		Writer.push("ENTITIES");
		var poly = 0;

		for(var j = 0; j < past.length; j++) {
			Writer.push("0");
			Writer.push("POLYLINE");
			Writer.push("8");
			Writer.push("BREAKLIN");
			Writer.push("38");
			Writer.push("0.0");
			Writer.push("66");
			Writer.push("1");
			Writer.push("70");
			Writer.push("8");

			for(var i = 0; i < past[poly][0].geometry.length; i++)
			// foreach (PointF point in contours)
			{
				if(past[poly][0].geometry[i].x> 0 && past[poly][0].geometry[i].y > 0) {
					Writer.push("0");
					Writer.push("VERTEX");
					Writer.push("8");
					Writer.push("BREAKLIN");
					Writer.push("70");
					Writer.push("32");

					Writer.push("10");
					Writer.push(past[poly][0].geometry[i].x);
					Writer.push("20");
					Writer.push(past[poly][0].geometry[i].y);
					Writer.push("30");
					Writer.push("0.0");
				}

			}
			Writer.push("0");
			Writer.push("SEQEND");
			poly++;
		}
		Writer.push("0");
		Writer.push("ENDSEC");
		Writer.push("0");
		Writer.push("EOF");
	}
	return Writer;
}