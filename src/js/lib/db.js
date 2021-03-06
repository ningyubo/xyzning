var path = require('path');
var dbPath = path.join(root.app ? root.app.dir : process.cwd(), 'db');
var nedb = require('nedb');
var db = {};


db.data = new nedb({ filename: path.join(dbPath, 'data.db'), autoload: true });
db.log = new nedb({ filename: path.join(dbPath, 'log.db'), autoload: true });


module.exports = db;

// var page = {
// 	type: "page",
// 	name: "project",
// 	aside: {
// 		"/Users/gavinning/Documents/lab/github/xyzning": {
// 			name: "xyzning",
// 			path: "/Users/gavinning/Documents/lab/github/xyzning",
// 			isHome: false
// 		}
// 	}
// }
