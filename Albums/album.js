var http = require('http');
	fs = require('fs');
	function load_album_list(callback) {
		fs.readdir("albums", (err, files) => {
			if(err) {
				callback(err);
				return;
			}
			var only_dirs = [];
			var iterator = (index) => {		
				if (index == files.length) {
					callback(null, only_dirs);
					return;
				}
				fs.stat("albums/" + files[index], (err,stats) => {
					if (err) {
						callback(err);
						return;
					}
					if (stats.isDirectory()) {
						only_dirs.push(files[index]);
					}
					iterator(index + 1);
	   			});
			}
			iterator(0);
		});
	}
	function handle_incoming_request(req, res) {
		console.log("INCOMING REQUEST: " + req.method + " " + req.url);
		load_album_list((err, albums) => {
			if(err) {
				res.writeHead(500, {"Content-type": " application/json"});
				res.end(JSON.stringify(err) + "\n");	
				return;
			}
		var out = { error: null, data: { albums: albums}};
		res.writeHead(200, {"Content-Type" : "application/json"});	
		res.end(JSON.stringify(out) + "\n");
		});
	}
var s = http.createServer(handle_incoming_request);
s.listen(8090);
