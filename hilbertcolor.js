function hilbertColor(callback){
	var R = G = B = 4;
	var color = [];
	for(var r=0;r < R; r++){
		color[r] = [];
		for(var g=0;g < G; g++){
			color[r][g] = [];
			for(var b=0; b < B; b++){
				color[r][g][b] = "rgb("+r*255/(R-1)+","+g*255/(G-1)+","+b*255/(B-1)+")";
			}
		}
	}

	function flip(a){
		var d = [];
		for(var i = 0; i < a.length/2; i++){
			d[i] = a[i];
		}
		for(var i = a.length/2; i < a.length; i++){
			for(var j = 0; j < a[i].length; j++){
			d[a.length-1 - i][2*a[i].length-1 - j] = a[i][j];
			}
		}
		return d;
	}

	function flop(a){
		var d = [];
		for(var i = 0; i < a.length/2; i++){
			d[i] = a[i];
		}
		for(var i = a.length/2; i < a.length; i++){
			for(var j = 0; j < a[i].length; j++){
				for(var k = 0; k < a[i][j].length; k++){
					d[a.length-1 - i][j][2*a[i][j].length-1 - k] = a[i][j][k];
				}
			}
		}
		return d;
	}

	function style(tag, attrs){
		for(var attr in attrs){
			tag.style[attr] = attrs[attr];
		}
		return tag;
	}

	function maketable(a){
		var table = document.createElement('table');
		style(table, {
			background: 'black',
		});
		for(var row in a){
			var tr = document.createElement('tr');
			table.appendChild(tr);
			for(var col in a[row]){
				var td = document.createElement('td');
				tr.appendChild(td);
				style(td, {
					background: a[row][col],
					width: '1em',
					height: '1em',
				});
				td.addEventListener("click", function(evt){
					callback(evt.target.style.background);
				});
			}
		}
		return table;
	}

	while(color.length > 1){ color = flip(color);
		if(color.length > 1) color = flop(color);
	};

	return maketable(color[0]);
}
