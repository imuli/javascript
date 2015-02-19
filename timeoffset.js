/* Note, this is not suitable for pages loaded via https, and NIST does
 * not appear to supply such a service.
 *
 * This is not a secure timevalue!
 *
 */
function getTimeOffset(callback){
	var x = new XMLHttpRequest();
	x.open("GET", "http://nist.time.gov/actualtime.cgi", true);
	var t1 = new Date().getTime();
	x.onload = function(e){
		if(x.readyState==4 && x.status==200){
			t2 = new Date().getTime();
			t = (t1+t2)/2;
			callback(x.responseXML.firstChild.attributes.time.value/1000-t);
		}
	};
	x.send();
}
