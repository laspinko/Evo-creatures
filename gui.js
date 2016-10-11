var statusPanel = document.getElementById('status');

function updateStatusPanel() {
	var html = '';
	html += 'Creatures alive: ' + creatures.length + '<br>';
	html += 'Simulation speed: ' + stepsPerCall + '<br>';
	html += 'Average fitness: ' + Math.floor(currentAvg * 10) / 10 + '<br>';
	statusPanel.innerHTML = html;
}

function getInfoFromCP() {
	var curr;

	curr = document.getElementById('b_livePreview').checked;
	if(curr != toRender) {
		if(toRender) stopRendering();
		else startRendering();
	}

	curr = document.getElementById('b_foodHeatmap').checked;
	if(curr != renderFoodHeatmap) {
		renderFoodHeatmap = !renderFoodHeatmap;
	}

	curr = document.getElementById('r_simSpeed');
	stepsPerCall = curr.value; // TODO treat value as percentage, not absolute value

	updateStatusPanel();
}

updateStatusPanel();
setInterval(updateStatusPanel, 1000);

var statCanvas = document.getElementById('statCanvas');
var statCtx = statCanvas.getContext('2d');

function drawStat() {
    statCtx.clearRect(0, 0, statCanvas.width, statCanvas.height);
	statCtx.beginPath();
	statCtx.moveTo(0, statCanvas.height);
	for(var i = 1;i < fitnesData.length;++ i)
	{
		statCtx.lineTo(i * statCanvas.width / (fitnesData.length-1), statCanvas.height - (fitnesData[i].crCount / maxCrCount * statCanvas.height));
	}
	statCtx.lineTo(statCanvas.width * (fitnesData.length ) / fitnesData.length, statCanvas.height);

	statCtx.globalAlpha = 0.5;
	statCtx.fillStyle = 'yellow';
	statCtx.fill();

	statCtx.closePath();

	statCtx.beginPath();
	statCtx.moveTo(0, statCanvas.height);
	for(var i = 1;i < fitnesData.length;++ i)
	{
		statCtx.lineTo(i * statCanvas.width / (fitnesData.length-1), statCanvas.height - (fitnesData[i].avg / maxAvg * statCanvas.height));
	}
	statCtx.lineTo(statCanvas.width * (fitnesData.length ) / fitnesData.length, statCanvas.height);

	statCtx.globalAlpha = 0.5;
	statCtx.fillStyle = 'blue';
	statCtx.fill();
	statCtx.closePath();
}

drawStat();
setInterval(drawStat, 1000/2);
