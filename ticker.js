/* a pair of sliders that _should_ work just about everywhere
 *
 * public domain
 *
 * bugs:
 *
 * the css3 slider needs a wrapping div around it with overflow set to hidden
 * 
 * the scrolling slider will act strangely if the inner elements' widths sum to
 * less than one element over the display width.
 *
 * if the first element changes width, there will be a small jump when it is
 * sent back to the end too early or too late.
 *
 * text nodes are ignored
 *
 * not clever about picking the best slider for a particular browser.
	linux	mac	windows
firefox	s
chrome	c
opera	s
ie
 *
 */
function Ticker(id){
	var it;
	it = new css3Ticker();
	if(it.init(id) !== false)
		return it;
	it = new scrollTicker();
	if(it.init(id) !== false)
		return it;
	return undefined;
}

function css3Ticker(){
	this.speed = 20;
	this.transitionName = 'transition';
	this.transformName = 'transform';
}

css3Ticker.prototype.init = function(id){
	this.elem = document.getElementById(id);
	if(!this.elem) return false;
	if(!this.supported()) return false;

	this.elem.style['whiteSpace'] = 'nowrap';

	var me = this;
	var tEvents = {
		'transition':		'transitionend',
		'OTransition':		'otransitionend',
		'MozTransition':	'transitionend',
		'WebkitTransition':	'webkitTransitionEnd'
	};
	this.elem.addEventListener(tEvents[this.transitionName],
			function(){ me.rotate(); me.reset(); me.resume(); }, false);
	this.elem.addEventListener('mouseover',
			function(){ me.pause(); }, true);
	this.elem.addEventListener('mouseleave',
			function(){ me.resume(); }, true);
	this.reset();
	this.resume();
};
css3Ticker.prototype.resume = function(){
	var start = this.offset();
	var distance = this.elem.firstElementChild.offsetWidth;
	if(distance == null) distance = 0;
	this.transition({
		Property: this.transformName,
		Duration: ((start+distance)/this.speed) + 's',
		TimingFunction: 'linear',
		Delay: '0s'
	});
	this.transform('translate(-'+distance+'px)');
};
css3Ticker.prototype.pause = function(){
	this.transform(window.getComputedStyle(this.elem).transform);
	this.transition({Duration: '0s'});
};
css3Ticker.prototype.reset = function(){
	this.transition({Duration: '0s'});
	this.transform('translate(0px)');
};

/* utility functions */
css3Ticker.prototype.supported = function(){
	return this.setTransform() && this.setTransition();
};
css3Ticker.prototype.transition = function(s){
	for(var a in s)
		this.elem.style[this.transitionName+a]=s[a];
};
css3Ticker.prototype.transform = function(s){
	this.elem.style[this.transformName]=s;
};
css3Ticker.prototype.rotate = function(){
	this.elem.appendChild(this.elem.firstElementChild);
}
/* ugly */
css3Ticker.prototype.offset = function(s){
	return parseFloat(window.getComputedStyle(this.elem).transform.replace("matrix(1, 0, 0, 1, ", "").replace(", 0)", ""));
}
/* fixme, this is majorly factorable */
css3Ticker.prototype.setTransition = function(){
	var s = document.createElement('p').style;
	var v = ['OTransition', 'MozTransition', 'WebkitTransition', 'transition'];
	while(v.length){
		this.transitionName = v.pop();
		if(s[this.transitionName] !== undefined) return true;
	}
	return false;
};
css3Ticker.prototype.setTransform = function(){
	var s = document.createElement('p').style;
	var v = ['transform'];
	while(v.length){
		this.transitionName = v.pop();
		if(s[this.transitionName] !== undefined) return true;
	}
	return false;
};
function scrollTicker(){
	this.speed = 20;
}
	
scrollTicker.prototype.init = function(id){
	this.elem = document.getElementById(id);
	if(!this.elem) return false;

	this.elem.style['overflow'] = 'hidden';
	this.elem.style['whiteSpace'] = 'nowrap';

	var me = this;
	this.elem.addEventListener('mouseover',
			function(){ me.pause(); }, true);
	this.elem.addEventListener('mouseleave',
			function(){ me.resume(); }, true);
	window.addEventListener('resize',
			function(){ me.resume(); }, true);
	this.calc();
	this.resume();
};

scrollTicker.prototype.shift = function()
{
	this.elem.scrollLeft+=1;
	if(this.elem.scrollLeft >= this.distance){
		this.elem.scrollLeft -= this.distance;
		this.rotate();
		this.calc();
	}
};

scrollTicker.prototype.resume = function(){
	var me = this;
	if(this.timer !== undefined)
		window.clearInterval(this.timer);
	if(this.elem.scrollWidth <= this.elem.offsetWidth) return;
	this.timer = window.setInterval(
		function(){ me.shift(); }, 1000/this.speed);
};
scrollTicker.prototype.pause = function(){
	window.clearInterval(this.timer);
};

scrollTicker.prototype.rotate = function(){
	this.elem.appendChild(this.elem.firstElementChild);
}
scrollTicker.prototype.calc = function(){
	this.distance = this.elem.firstElementChild.offsetWidth;
}
