var mysql = require('./queryExecutor');

var pool = [];
var count = 0;
var connectionStatus = [];
var ConnectionNo  = 0;
var statusCount = 0;
var allConBusy = false;
var pendingConn = [];
var pndingCon_length = 10;	 

var jsonObject = [];



exports.createPool = function(numOfConns){

	ConnectionNo = numOfConns;
	for(var i=0; i < numOfConns; i++){

		var poolObject = {
				connection : mysql.getConnection(),
				status : false
		};

		jsonObject.push(poolObject);

	}

	console.log("Pool Created");
};

exports.getConnFromPool = function connAssigner(incomingConnection){

	if(count == jsonObject.length){


		if(pndingCon_length !=0 ){

			console.log("Pushing "+pndingCon_length+" in queue");

			pendingConn.push(pndingCon_length);
			pndingCon_length--;


			setInterval(function(){
				if(!allConBusy){

					console.log("Assign total of "+pndingCon_length+" in queue");
						pendingConn.splice(0, 1);
						if(pndingCon_length < 10)
							pndingCon_length++;
						console.log("Value now is " + loop());

						return (loop());
			
	
				}
				

		}, 5);		



			console.log("After timeout");
	}
	else{

		console.log("Now queue is full.");
		return null;
	}


}
else{
	console.log("Connection given");
	return ( loop() );
}

	
};

function loop(){

	for(var i=0; i<ConnectionNo; i++){

		if(jsonObject[i].status == false){

			allConBusy = false;
			jsonObject[i].status = true;
			count++;

			return jsonObject[i].connection;

		}

	}

	allConBusy = true ;

}

exports.releaseConn = function(conn){

	count--;
	
	for(var i=0; i<jsonObject.length;  i++){

		if(jsonObject[i].connection === conn){
			jsonObject[i].status = false;
		}
	}

}

