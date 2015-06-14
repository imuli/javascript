function pieify(tag, radius){
	function style(tag, attrs){
		for(var attr in attrs){
			tag.style[attr] = attrs[attr];
		}
		return tag;
	}
	style(tag, {
		'list-style': 'none',
		padding: '0',
		display: 'block',
		position: 'absolute',
		top: '20ex',
		left: '20ex',
	});
	for(var i=0; i < tag.children.length; i++){
		var angle = 2 * Math.PI * i / tag.children.length;
		style(tag.children[i], {
			position: 'absolute',
			top: (radius*Math.cos(angle) - tag.children[i].clientHeight/2) + 'px',
			left: (radius*Math.sin(angle) - tag.children[i].clientWidth/2) + 'px',
		});
		console.log(tag.children[i]);
	}
}
