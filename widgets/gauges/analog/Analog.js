
var Analog = function (radius, rootElem) {  
	this._init(radius, rootElem);
	this.thresholds = [{id : "normal", value: "Normal", color:"#008B00", start:0},
					   {id : "minor", value: "Minor", color:"#FFD700", start:40},
					   {id : "major", value: "Major", color:"#B8860B", start:60},
					   {id : "critical", value: "Critical", color:"#DC143C", start:80}
					  ];
	this.min = 0;
	this.max = 100;
	this.value = 0;
	this.previousValue = 0;
	this.step = this.previousValue;
	this.stepsIncreasing = true;
	var animationFrame;
	this.unit = ""
};

Analog.prototype._init = function(radius, rootElem) {
	this.radius = radius;
	this.root = document.getElementById(rootElem);
	this.canvas = document.createElement('canvas');
	this.root.appendChild(this.canvas);
	this.canvas.width = radius*2;
	this.canvas.height = radius*2;
	
	
	// for needle
	this.needleCanvas = document.createElement('canvas');
	this.root.appendChild(this.needleCanvas);
	this.needleCanvas.width = radius*2;
	this.needleCanvas.height = radius*2;

	this.needleCanvas.style.top =this.root.offsetTop + "px";
	this.needleCanvas.style.left=this.root.offsetLeft + "px";
	this.needleCanvas.style.position="absolute";
}

Analog.prototype.setThresholds = function(thresholds) {
	this.thresholds = thresholds;
}

Analog.prototype.draw = function() {
	console.log("draw..");
	var ctx = this.canvas.getContext("2d");
	ctx.beginPath();
	ctx.arc(this.radius, this.radius, this.radius, 0, 2*Math.PI);
	ctx.closePath();
	ctx.strokeStyle = '#b5b5b5';
	ctx.stroke();
	
	this._drawThresholds(ctx);
	this._drawTicks();
	this._drawNeedle(this.value);
	
}

Analog.prototype._drawThresholds = function(ctx) {
	for(var i=0; i<this.thresholds.length;i++) {
		var thresh = this.thresholds[i];
		var start = thresh.start;
		var end = this.max;
		if(i+1 < this.thresholds.length) {
			end = this.thresholds[i+1].start;
		}
		ctx.beginPath();
		
		var startAngle = 3/8*2*Math.PI + ((3/4*2*Math.PI)/(this.max - this.min) * start);
		var endAngle = (3/8*2*Math.PI + ((3/4*2*Math.PI)/(this.max - this.min) * end));
		
		if(i>0)
			startAngle = startAngle + 0.02;
			
		if(i==this.thresholds.length-1)
			endAngle = endAngle + 0.02;
			
		ctx.arc(this.radius, this.radius, this.radius-(this.radius/10), startAngle, endAngle-0.02);		
		ctx.arc(this.radius, this.radius, this.radius-(5), endAngle-0.02, startAngle, true);
		
		ctx.closePath();
		ctx.fillStyle = thresh.color;
		ctx.fill();
		ctx.strokeStyle=thresh.color;
		ctx.stroke();	
	}
}

Analog.prototype._drawNeedle = function(value) {
	var ctx = this.needleCanvas.getContext("2d");
	ctx.clearRect(0,0,2*this.radius,2*this.radius);
	
	/*for(var i=this.previousValue; i<=this.value; i++) {
		console.log("drawNeedle for value : " + i);
		setTimeout(function() { that._drawNeedle.call(that, i) } , 2000);
	}*/
	if(value != this.previousValue) {
		ctx.font = "30px Arial";
		ctx.fillStyle = '#d5d5c3';
		ctx.textAlign = "center";
		ctx.fillText(this.value + this.unit,this.radius,this.radius);
	}
	
	var valueAngle = 3/8*2*Math.PI + ((3/4*2*Math.PI)/(this.max - this.min) * value);
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
	var that = this;
	
	if(this.stepsIncreasing) {
		if (this.step <= this.value) {
			var k = this.step;
			window.requestAnimationFrame(function() {that._drawNeedle.bind(that)(k)});
			this.step = this.step + 1;
		} else {
			//window.requestAnimationFrame(function() {that._drawNeedle.bind(that)(that.value)});
		}
	} else {
		if (this.step >= this.value) {
			var k = this.step;
			window.requestAnimationFrame(function() {that._drawNeedle.bind(that)(k)});
			this.step = this.step - 1;
		} else {
			//window.requestAnimationFrame(function() {that._drawNeedle.bind(that)(that.value)});
		}
	}
}

Analog.prototype.setValue = function(value) {
	console.log("setValue : " + value);
	
	this.previousValue = this.value;
	if(this.value < this.min)
		this.value = this.min;
	else if(this.value > this.max)
		this.value = this.max;
	else
		this.value = value;
		
	this.step = this.previousValue;
	
	if(this.previousValue < this.value) {
		this.stepsIncreasing = true;
	} else {
		this.stepsIncreasing = false;
	}
	var that = this;
	this.root.title = this._getThreshold(that.value).value;
	console.log(this.root.title);
	if(this.animationFrame)
		cancelAnimationFrame(this.animationFrame);
		
	animationFrame = window.requestAnimationFrame(function() {that._drawNeedle.bind(that)(that.step)});
}

Analog.prototype._drawTicks = function(value) {
	var separation = (this.max - this.min)/10;
	var dc = this.radius-this.radius/8;
	var ctx = this.canvas.getContext("2d");
	for(var i = this.min; i<=this.max; i = i+separation) {
		var valueAngle = 3/8*2*Math.PI + ((3/4*2*Math.PI)/(this.max - this.min) * i);
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
		ctx.font = "15px Arial";
		ctx.fillStyle = '#b5b5b5';
		//if(i == separation || i == 2* separation || i == 8*separation || i == 9*separation)
			//ctx.textAlign = "start";
		//else
			ctx.textAlign = "center";
		ctx.fillText(i,x3,y3);
	}
}

Analog.prototype._getThreshold = function(value) {
	for(var i=0; i<this.thresholds.length;i++) {
		if(value <= this.thresholds[i].start)
			return this.thresholds[i];
	}
}
