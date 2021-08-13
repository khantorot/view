if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
	window.onload = function () {
		var canvas = document.getElementById("fractol_tree");
		var context = canvas.getContext("2d")
		var width = canvas.width = document.documentElement.clientWidth;
		var height = canvas.height = document.documentElement.clientHeight;


		var p0 = {
			x: width / 2,
			y: height - 50
		},
			p1 = {
				x: width / 2,
				y: 50
			},
			branchAngleA,
			branchAngleB,
			trunkRatio = 0.35,
			tA = Math.PI,
			tAS = 0.01,
			tB = 0,
			tBS = 0.01437;


		draw();

		function draw() {
			context.clearRect(0, 0, width, height);
			branchAngleA = Math.cos(tA += tAS) * Math.PI / 2;
			branchAngleB = Math.cos(tB += tBS) * Math.PI / 2;

			tree(p0, p1, 8);
			requestAnimationFrame(draw);
		}

		function tree(p0, p1, limit) {
			var dx = p1.x - p0.x,
				dy = p1.y - p0.y,
				dist = Math.sqrt(dx * dx + dy * dy),
				angle = Math.atan2(dy, dx),
				branchLength = dist * (1 - trunkRatio),
				pA = {
					x: p0.x + dx * trunkRatio,
					y: p0.y + dy * trunkRatio
				},
				pB = {
					x: pA.x + Math.cos(angle + branchAngleA) * branchLength,
					y: pA.y + Math.sin(angle + branchAngleA) * branchLength,
				},
				pC = {
					x: pA.x + Math.cos(angle + branchAngleB) * branchLength,
					y: pA.y + Math.sin(angle + branchAngleB) * branchLength,
				};

			context.beginPath();
			context.moveTo(p0.x, p0.y);
			context.lineTo(pA.x, pA.y);

			context.strokeStyle = "#504dac";
			context.stroke();



			if (limit > 0) {
				tree(pA, pC, limit - 1);
				tree(pA, pB, limit - 1);
			}
			else {
				context.beginPath();
				context.moveTo(pB.x, pB.y);
				context.lineTo(pA.x, pA.y);
				context.lineTo(pC.x, pC.y);
				context.stroke();
			}
		}
	};








	const canvas = document.querySelector('#tree_canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	const ctx = canvas.getContext('2d');
	let curve = 10;
	let curve2 = 0;

	function drawTree(startX, startY, len, angle, branchWidth, color1, color2) {
		ctx.beginPath();
		ctx.save();
		ctx.strokeStyle = color1;
		ctx.fillStyle = color2;
		ctx.shadowBlur = 15;
		ctx.shadowColor = 'black';
		ctx.lineWidth = branchWidth;
		ctx.translate(startX, startY);
		ctx.rotate(angle * Math.PI / 180);
		ctx.moveTo(0, 0);
		//ctx.lineTo(0, -len);
		if (angle > 0) {
			ctx.bezierCurveTo(curve2, -len / 2, curve2, -len / 2, 0, -len);
		} else {
			ctx.bezierCurveTo(curve2, -len / 2, -curve2, -len / 2, 0, -len);
		}

		ctx.stroke();

		if (len < 5) {
			// leafs
			ctx.beginPath();
			ctx.arc(0, -len, (Math.random() * 20) + 10, 0, Math.PI / 2);
			ctx.fill();
			ctx.restore();
			return;
		}

		drawTree(0, -len, len * 0.7, angle + curve, branchWidth * 0.6);
		drawTree(0, -len, len * 0.7, angle - curve, branchWidth * 0.6);

		ctx.restore();
	}
	drawTree(canvas.width / 2, canvas.height, 80, 0, 25, 'brown', 'green');

	function generateRandomTree() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		//startX, startY, len, angle, branchWidth, color1, color2
		let centerPointX = canvas.width / 2;
		let len = Math.floor((Math.random() * 20) + 100);
		let angle = 0;
		let branchWidth = (Math.random() * 70) + 1;
		let color1 = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
		let color2 = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';

		curve = (Math.random() * 25) + 3;
		curve2 = Math.random() * 10;
		drawTree(centerPointX, canvas.height, len, angle, branchWidth, color1, color2);

	}

	window.addEventListener('resize', function () {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		generateRandomTree()
	})
	document.querySelector('.tree_canvas_wrapper').addEventListener('click', function () {
		generateRandomTree();
	})
}
