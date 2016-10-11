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
}

updateStatusPanel();
setInterval(updateStatusPanel, 1000);
