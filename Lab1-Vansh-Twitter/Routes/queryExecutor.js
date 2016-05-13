var ejs= require('ejs');
var mysql = require('mysql');
//var pool = require('./mysql_pool');

var connection;

function getConnection(){
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : '1234',
	    database : 'test',
	    port	 : 3306 ,
//	    multipleStatements: true
	});
	return connection;
}


function fetchData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
//	
	var connection=getConnection();
//	
//	var connection = pool.getConnFromPool();
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
//
//			pool.releaseConn(connection);

			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
}	


exports.fetchData=fetchData;


//
//exports.addData = function addData(functionCall, sqlQuery){
//	console.log("\nSQL Query::"+sqlQuery);
//		
////	var connection=getConnection();
//	connection = pool.getConnFromPool(this.connection);
//		
//		connection.query(sqlQuery, function(err, result) {
//			if(err){
//				console.log("ERROR: " + err.message);
//			}
//			else{
//				pool.releaseConn(connection);
//				console.log("\n Add Data - Connection released..");
//				
//				functionCall(err, result);
//			}
//		});
//		
//		//connection.end();	
//};