
var Clock = function (radius, rootElem) { 
	this._init(radius, rootElem);
	this._drawTicks();
	var d = new Date(Date.now());
	this.h = d.getHours();
	this.m = d.getMinutes();
	this.s = d.getSeconds();
};

Clock.prototype._init = function(radius, rootElem) {
	this.radius = radius;
	this.root = document.getElementById(rootElem);
	this.canvas = document.createElement('canvas');
	this.root.appendChild(this.canvas);
	this.canvas.width = radius*2;
	this.canvas.height = radius*2;
	
	
	// for seconds needle
	this.needleCanvas = document.createElement('canvas');
	this.root.appendChild(this.needleCanvas);
	this.needleCanvas.width = radius*2;
	this.needleCanvas.height = radius*2;

	this.needleCanvas.style.top =this.root.offsetTop + "px";
	this.needleCanvas.style.left=this.root.offsetLeft + "px";
	this.needleCanvas.style.position="absolute";
	
	// for minutes needle
	this.minuteCanvas = document.createElement('canvas');
	this.root.appendChild(this.minuteCanvas);
	this.minuteCanvas.width = radius*2;
	this.minuteCanvas.height = radius*2;

	this.minuteCanvas.style.top =this.root.offsetTop + "px";
	this.minuteCanvas.style.left=this.root.offsetLeft + "px";
	this.minuteCanvas.style.position="absolute";
	
	// for hours needle
	this.hoursCanvas = document.createElement('canvas');
	this.root.appendChild(this.hoursCanvas);
	this.hoursCanvas.width = radius*2;
	this.hoursCanvas.height = radius*2;

	this.hoursCanvas.style.top =this.root.offsetTop + "px";
	this.hoursCanvas.style.left=this.root.offsetLeft + "px";
	this.hoursCanvas.style.position="absolute";
}

Clock.prototype.draw = function() {
	console.log("draw..");
	var ctx = this.canvas.getContext("2d");
	ctx.beginPath();
	ctx.arc(this.radius, this.radius, this.radius, 0, 2*Math.PI);
	ctx.closePath();
	ctx.strokeStyle = '#b5b5b5';
	ctx.stroke();
	
	//inner circle
	ctx.beginPath();
	ctx.arc(this.radius, this.radius, this.radius - this.radius/50, 0, 2*Math.PI);
	ctx.closePath();
	ctx.strokeStyle = '#b5b5b5';
	ctx.stroke();
	
	this._drawTicks();
	this.setTime(this.h, this.m, this.s);
	
}

Clock.prototype._drawTicks = function() {
	var dc = this.radius-this.radius/50;
	var ctx = this.canvas.getContext("2d");
	for(var i = 1; i<=60; i++) {
		var valueAngle = 2*Math.PI/60 * i - 2*Math.PI/4;
		var x1 = this.radius - dc* Math.cos(Math.PI - valueAngle);
		var y1 = this.radius + dc* Math.sin(Math.PI - valueAngle);
		
		var x2 = this.radius - (dc - dc/12)* Math.cos(Math.PI - valueAngle);
		var y2 = this.radius + (dc - dc/12)* Math.sin(Math.PI - valueAngle);
		
		var x3 = this.radius - (dc - dc/6)* Math.cos(Math.PI - valueAngle);
		var y3 = this.radius + (dc - dc/6)* Math.sin(Math.PI - valueAngle);
		
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.closePath();
		ctx.strokeStyle = '#c4c4c4';
		ctx.stroke();
		
		ctx.moveTo(x1, y1);
		if(i % 5 == 0) {
			ctx.font = "15px Arial";
			ctx.fillStyle = '#b5b5b5';
			ctx.textAlign = "center";
			ctx.fillText(i/5,x3,y3);
		}
	}
}

Clock.prototype._drawNeedle = function(h, m, s) {
	s = s%60;
	var ctx = this.needleCanvas.getContext("2d");
	ctx.clearRect(0,0,2*this.radius,2*this.radius);
	
	var valueAngle = 2*Math.PI/60 * s - 2*Math.PI/4;
	var r = this.radius;
	var dc = r-r/4;
	var x1 = r - dc* Math.cos(Math.PI - valueAngle);
	var y1 = r + dc* Math.sin(Math.PI - valueAngle);
	
	var x2 = r - (dc - dc/10)* Math.cos(Math.PI - valueAngle - Math.PI/36);
	var y2 = r + (dc-dc/10)* Math.sin(Math.PI - valueAngle - Math.PI/36);
	
	var x3 = r- (dc-dc/10)* Math.cos(Math.PI - valueAngle + Math.PI/36);
	var y3 = r + (dc-dc/10)* Math.sin(Math.PI - valueAngle + Math.PI/36);
	
	ctx.moveTo(x1, y1);
	ctx.beginPath();
	ctx.lineTo(x2, y2);
	ctx.lineTo(x3, y3);
	ctx.lineTo(x1, y1);
	ctx.closePath();
	ctx.fillStyle = '#191970';
	ctx.fill();
	ctx.strokeStyle='#191970';
	ctx.stroke();
	this._increaseOneSec();
}

Clock.prototype._drawMinutesNeedle = function() {
	var ctx = this.minuteCanvas.getContext("2d");
	ctx.clearRect(0,0,2*this.radius,2*this.radius);
	
	var valueAngle = 2*Math.PI/60 * this.m - 2*Math.PI/4;
	var r = this.radius;
	var dc = r-r/4;
	//var x1 = r - dc* Math.cos(Math.PI - valueAngle);
	//var y1 = r + dc* Math.sin(Math.PI - valueAngle);
	
	var x1 = r - (dc - dc/10)* Math.cos(Math.PI - valueAngle - Math.PI/60);
	var y1 = r + (dc-dc/10)* Math.sin(Math.PI - valueAngle - Math.PI/60);
	
	var x2 = r- (dc-dc/10)* Math.cos(Math.PI - valueAngle + Math.PI/60);
	var y2 = r + (dc-dc/10)* Math.sin(Math.PI - valueAngle + Math.PI/60);
	
	var x3 = r- (r/30)* Math.cos(Math.PI - valueAngle + Math.PI/60 + Math.PI/2);
	var y3 = r + (r/30)* Math.sin(Math.PI - valueAngle + Math.PI/60 + Math.PI/2);
	
	var x4 = r - (r/30)* Math.cos(Math.PI - valueAngle - Math.PI/60 - Math.PI/2);
	var y4 = r + (r/30)* Math.sin(Math.PI - valueAngle - Math.PI/60 - Math.PI/2);
	
	
	
	ctx.moveTo(x1, y1);
	ctx.beginPath();
	ctx.lineTo(x2, y2);
	ctx.lineTo(x3, y3);
	ctx.lineTo(x4, y4);
	ctx.lineTo(x1, y1);
	ctx.closePath();
	ctx.fillStyle = '#191970';
	ctx.fill();
	ctx.strokeStyle='#191970';
	ctx.stroke();
}

Clock.prototype._drawHoursNeedle = function() {
	var ctx = this.hoursCanvas.getContext("2d");
	ctx.clearRect(0,0,2*this.radius,2*this.radius);
	
	var valueAngle = 2*Math.PI/12 * this.h - 2*Math.PI/4;
	var r = this.radius;
	var dc = r-r/2;
	//var x1 = r - dc* Math.cos(Math.PI - valueAngle);
	//var y1 = r + dc* Math.sin(Math.PI - valueAngle);
	
	var x1 = r - (dc - dc/10)* Math.cos(Math.PI - valueAngle - Math.PI/60);
	var y1 = r + (dc-dc/10)* Math.sin(Math.PI - valueAngle - Math.PI/60);
	
	var x2 = r- (dc-dc/10)* Math.cos(Math.PI - valueAngle + Math.PI/60);
	var y2 = r + (dc-dc/10)* Math.sin(Math.PI - valueAngle + Math.PI/60);
	
	var x3 = r- (r/30)* Math.cos(Math.PI - valueAngle + Math.PI/60 + Math.PI/2);
	var y3 = r + (r/30)* Math.sin(Math.PI - valueAngle + Math.PI/60 + Math.PI/2);
	
	var x4 = r - (r/30)* Math.cos(Math.PI - valueAngle - Math.PI/60 - Math.PI/2);
	var y4 = r + (r/30)* Math.sin(Math.PI - valueAngle - Math.PI/60 - Math.PI/2);
	
	
	
	ctx.moveTo(x1, y1);
	ctx.beginPath();
	ctx.lineTo(x2, y2);
	ctx.lineTo(x3, y3);
	ctx.lineTo(x4, y4);
	ctx.lineTo(x1, y1);
	ctx.closePath();
	ctx.fillStyle = '#191970';
	ctx.fill();
	ctx.strokeStyle='#191970';
	ctx.stroke();
}

Clock.prototype.setTime = function(h, m, s) {
	this.h = h;
	this.m = m;
	this.s = s;
	var that = this;
	this._drawMinutesNeedle();
	this._drawHoursNeedle();
	setInterval(function() { that._drawNeedle.bind(that)(that.h, that.m, that.s + 1)}, 1000);
}

Clock.prototype._increaseOneSec = function() {
	this.s = (this.s + 1) % 60;
	
	if(this.s == 0) {
		this.m = (this.m + 1) % 60;
		this._drawMinutesNeedle();
	}
		
	if(this.m == 0 && this.s == 0) {
		this.h = (this.h+1) % 12;
		this._drawHoursNeedle();
	}

}
