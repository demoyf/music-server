const cluster = require('cluster');
const osLength = require('os').cpus().length;
let app = require('./../app');

let forkWorker = function(listener){
	let worker = cluster.fork();
	
}