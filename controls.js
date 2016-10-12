var mousePos = new Vector(0, 0);

canvas.addEventListener('mousedown', function (args) {
    mousePos = new Vector(args.pageX-canvas.offsetLeft, args.pageY-canvas.offsetTop);


	mouseDownPos.x = ((args.pageX));
	mouseDownPos.y = ((args.pageY));

	mouseDown = true;
}, false);

canvas.addEventListener('mouseup', function (args) {
    mousePos = new Vector(args.pageX-canvas.offsetLeft, args.pageY-canvas.offsetTop);
	mouseDown = false;
}, false);
canvas.addEventListener('click', function (args) {
    mousePos = new Vector(args.pageX-canvas.offsetLeft, args.pageY-canvas.offsetTop);

	creaturesSelected = undefined;
	for(var i in creatures) {
        var screenPos = add(mul(creatures[i].pos,scaleMultiplier),offset);
        var radius = Math.max(4 * creatures[i].size / 10,creatures[i].size * scaleMultiplier);
        //console.log(mul(creatures[i].pos,scaleMultiplier));
		if(sub(mousePos, screenPos).dist2() < radius * radius) {
			creaturesSelected = creatures[i];
            scaleMultiplier = 1;
		}
	}
}, false);

canvas.addEventListener('mousemove', function (args) {
    mousePos = new Vector(args.pageX-canvas.offsetLeft, args.pageY-canvas.offsetTop);
	if(mouseDown)
	{
		var curr = new Vector(args.pageX, args.pageY);
		offset.sub(sub(mouseDownPos, curr));
		mouseDownPos = curr;
	}
}, false);

canvas.addEventListener('wheel', function (args) {
    var oldScale = scaleMultiplier;
	if(args.deltaY > 0) scaleMultiplier *=0.9;
	else scaleMultiplier /= 0.9;

    //fucking zoom
    var fuck = sub(offset,mousePos);
    fuck.mul(scaleMultiplier/oldScale);
    offset = add(fuck,mousePos);

    args.preventDefault();
}, false);
