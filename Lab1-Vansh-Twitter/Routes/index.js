var queryExec = require("./queryExecutor");
var ejs = require("ejs");
var mysql = require("mysql");

var crypto = require('crypto');
text = "+ signUpInfo.password +",
text1 = "+ loginInfo.loginPass +",

key = '1234';
var hash = crypto.createHmac('sha256', key);
var hash1 = crypto.createHmac('sha256', key);
hash.update(text);
hash1.update(text1);
var value = hash.digest('hex');
var value1 = hash1.digest('hex');


function index(req, res){

  res.render("index");
}

function signUp(req, res){
	
	var signUpInfo, queryString;
	console.log("Inside Server's SignUp function...");
	signUpInfo = req.body;
	queryString = "SELECT email_id FROM users WHERE email_id = '" + signUpInfo.emailId + "'";  
	console.log("Account already exists: "+ queryString);
	queryExec.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
				
				if(results.length > 0){
					console.log("Email ID already exists");
					res.end("This Email ID already exists. Please choose another email ID.");
				}
				
				else{
					console.log("Creating account...");
					
					queryString = "INSERT INTO users (`email_id`, `fname`, `lname`, `password`) VALUES ('" + signUpInfo.emailId + "', '" + signUpInfo.fName + "', '" + signUpInfo.lName + "', '"+value+"')";  
					console.log("Sign Up Query is: "+ queryString);
					queryExec.fetchData(function(err,results){
						if(err){
							throw err;
						}
						else 
						{
								req.session.emailId = signUpInfo.emailId;
								console.log("Successful Sign UP");
								res.end("Congratulations!!! Your account has been created successfully.");
								
						}	
					},queryString);

				}
			
			}	
		},queryString);
	
		
}
function login(req, res){
	
	var loginInfo, queryString;
	
	console.log("login function...");
	
	loginInfo = req.body;
	queryString = "SELECT email_id FROM users WHERE email_id = '" + loginInfo.loginEmail + "' AND password = '"+value1+"'";  
	console.log("Query for login is: "+ queryString);
	
	
	queryExec.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
				
				if(results.length > 0){
					req.session.emailId = loginInfo.loginEmail;
					console.log("Details Matched");
					res.end("Logged in successfully.");
				}
				
				else{
					console.log("Details not matched...");
				}
			
			}	
		},queryString);
	
		
}


function home(req, res){
	
	console.log("Home function");
	
	if (req.session.emailId){
		res.render("home");
	}
	else{
		res.render("index");
	}
	
	
}

function about(req, res){
	
	console.log("Inside Profile");
	if (req.session.emailId){
		res.render("about");
	}
	else{
		res.render("index");
	}
	
}
function getProfile(req, res){
	
	var queryString;
	
	console.log("Inside getProfile function");
	
	if (req.session.emailId){
		
		queryString = "SELECT * FROM users_workinfo uw, users_education ue, users_contact_info uc " +
					  "WHERE uw.email_id = '" + req.session.emailId + "' AND uw.email_id = ue.email_id AND ue.email_id = uc.email_id";  
		console.log("Query to get user profile is: "+ queryString);
		
		queryExec.fetchData(function(err,results){
			
			if(err){
				throw err;
			}
			else 
			{
					
					if(results.length > 0){
						console.log("Work information found");
						console.log(results);
					}
					
					else{
						console.log("Work information is empty");
					}
				
				}	
			},queryString);

		
		
	}
	else{
		res.render("index");
	}
	
}
function searchUser(req, res) {
	
	var followName = "", queryString = "";
	var followFlag = false; statusFlag = false;
	
	console.log("searchUser function...");
	
	followName = req.body;
	
	queryString = "SELECT fname, lname, email_id FROM users WHERE fname = '" + followName.name + "'";  
	console.log("Query to search user is: "+ queryString);
	
	
	queryExec.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
				
				if(results.length > 0){
					console.log("user found");
					console.log(results);
					followFlag = true;
					
					queryString = "SELECT follow_status FROM followtable WHERE source_email = '" + req.session.emailId + "' AND " + 
								  "dest_email = '" + results[0].email_id + "'";  
					console.log("follow Status Query is: "+ queryString);

					queryExec.fetchData(function(err,requestStatus){
						
						if(err){
							throw err;
						}
						else 
						{
								
								if(requestStatus.length > 0){
									
									statusFlag = true;
									
									
									if (followFlag === true){
										
										if (statusFlag === true){
											
											queryString = "SELECT ue.fname, ue.lname, fr.follow_status, fr.sender_email, fr.dest_email FROM users ue, followtable fr " +
														  "WHERE fr.source_email = '" + req.session.emailId + "' AND " + 
														  "fr.dest_email = '" + results[0].email_id + "' AND ue.email_id = fr.dest_email";  
											queryExec.fetchData(function(err,finalResult){
												
												if(err){
													throw err;
												}
												else 
												{
														
														if(finalResult.length > 0){
															
															console.log(finalResult);
															res.end(JSON.stringify(finalResult));
														}
														
														else{
															console.log("failed");
														}
													
												}	
												},queryString);
											
										}
										else{
											
											res.end("N"); 
										}
									}
								}
								else{
									
									res.end("N"); 
								}
								
						}	
						},queryString);
					
				}
				
				else{
					console.log("user does not exist in system.");
					res.end("Not Found");
				}
			
			}	
		},queryString);
	
}

function followUser(req, res) {
	
	console.log("inside followUser() function...");
	
	var reqUser = "", queryString = "";
		
	reqUser = req.body;
	
	queryString = "SELECT email_id FROM users WHERE fname = '" + reqUser.destination + "'";
	queryExec.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
				
				if(results.length > 0){
					console.log("Found required user...");
					console.log(results);
					
					queryString = "INSERT INTO followtable (source_email, dest_email, follow_status, sender_email) " +
								  "VALUES ('" + req.session.emailId + "', '" + results[0].email_id + "', 'A', '" + req.session.emailId + "')";
					console.log("INSERT follow_history Query1 is: "+ queryString);
					
					queryExec.fetchData(function(err,insertResult){
						
						if(err){
							throw err;
						}
						else 
						{
									console.log("follow Record inserted successfully...");
									
						}
								
						},queryString);
					}

				else{
					console.log("required user not found...");
				}
			
			}	
		},queryString);

}

function newsFeed(req, res) {
	
	var queryString = "", news = "";
	console.log("inside newsFeed() function...");
	
	news = req.body;
	
	queryString = "INSERT INTO news_feed (email_id, feed) VALUES ('" + req.session.emailId + "', '" + news.newsfeed + "')"; 
	console.log("INSERT query for tweets: "+ queryString);
	
	queryExec.fetchData(function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			res.end("Success");
		}
	
	},queryString);	
	
	
}
function retweet(req, res) {
	
	var queryString = "", news = "";
	console.log("inside newsFeed() function...");
	
	news = req.body;
	
	queryString = "INSERT INTO retweet (src_email, des_email,retweet) VALUES ('" + req.session.emailId + "','" + results[0].email_id + "', '" + news.newsfeed + "')"; 
	console.log("INSERT query for retweets: "+ queryString);
	
	queryExec.fetchData(function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			res.end("Success");
		}
	
	},queryString);	
	
	
}

function wall(req, res) {
	
	var queryString = "";
	var queryString1 = "";
	console.log("inside wall");
	
	queryString = 
	"SELECT nf.feed,nf.time_stamp,u.fname, u.lname FROM news_feed nf, users u WHERE nf.email_id IN (SELECT dest_email FROM followtable WHERE source_email = '" +
	req.session.emailId + "' AND follow_status = 'A')AND nf.email_id = u.email_id order by time_stamp DESC"; 
	

	
	console.log("SELECT query for tweets: "+ queryString);
	
	queryExec.fetchData(function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{




			if(results.length > 0){
				
				console.log("Showing tweets");
				res.end(JSON.stringify(results));
			}
		}
	
	},queryString,queryString1);	
	
	
}


function getFollowing(req, res) {
	
	console.log("inside getFollowing function...");
	
	var queryString = "";
	
	queryString = "SELECT u.email_id, u.fname, u.lname from users u, followtable f WHERE u.email_id IN (SELECT f.dest_email FROM " +
				  "followtable WHERE f.follow_status = 'A' AND f.source_email = '" + req.session.emailId + "')"; 
	console.log("Query for Getting list of users following me is : "+ queryString);

	queryExec.fetchData(function(err,results){
	
	if(err){
		throw err;
	}
	else 
	{
		if(results.length > 0){
			console.log("List of users which I follow is fetched successfully");
			res.end(JSON.stringify(results));
		}
	}
	
	},queryString);

}

function getFollowers(req, res) {
	
	console.log("inside getFollowers function...");
	
	var queryString = "";
	
	queryString = "select u.email_id,u.fname,u.lname,f.source_email from users u, followtable f where u.email_id IN(select f.source_email from followtable where f.dest_email = '" + req.session.emailId + "')" ; 
	console.log("Query for Getting Followers is: "+ queryString);

	queryExec.fetchData(function(err,results){
	
	if(err){
		throw err;
	}
	else 
	{
		if(results.length > 0){
			console.log("List of followers fetched successfully");
			res.end(JSON.stringify(results));
		}
	}
	
	},queryString);

}

function workedu(req, res) {
	
	console.log("inside WorkEducation function...");
	
	if (req.session.emailId){
		res.render('workEdu');
	}
	else{
		res.render('index');
	}
		
}

function saveWorkEdu(req, res) {
	
	console.log("inside saveWorkEdu function...");
	
	var queryString = "", workEdu = "";
	
	workEdu = req.body;
	
	queryString = "INSERT into edu_info (email_id, college_name, college_location) VALUES ('" + req.session.emailId + "', '" + workEdu.uniName + "', '" + workEdu.uniLoc + "')"; 
	console.log("Insert Edu Info: "+ queryString);

	queryExec.fetchData(function(err,results){
	
	if(err){
		throw err;
	}
	else 
	{
			console.log("Education Information added successfully");
			res.end(JSON.stringify(results));
		
	}
	
	},queryString);

	queryString = "INSERT into work_info (email_id, company_location, company_location, designation) VALUES ('" + req.session.emailId + "', '" + workEdu.compName + "', '" + workEdu.compLoc + "', '" + workEdu.desig + "')"; 
	console.log("Insert Work Info: "+ queryString);

	queryExec.fetchData(function(err,results){
	
	if(err){
		throw err;
	}
	else 
	{
			console.log("Work Information added successfully");
			res.end(JSON.stringify(results));
		
	}
	
	},queryString);


		
}

function contactInfo(req, res) {
	
	console.log("inside contactInfo function...");
		
	if (req.session.emailId){
		res.render('contactInfo');
	}
	else{
		res.render('index');
	}
	
}

function saveContactInfo(req, res) {
	
	console.log("inside saveContactInfo function...");
	
	var queryString = "", contactInfo = "";
	
	contactInfo = req.body;
	queryString = "INSERT into users_contact_info (email_id, phone_no, address, user_name) VALUES ('" + req.session.emailId + "', '" + contactInfo.phone + "', '" + contactInfo.address + "','" + contactInfo.username + "')"; 
	console.log("Inserting Info: "+ queryString);

	queryExec.fetchData(function(err,results){
	
	if(err){
		throw err;
	}
	else 
	{		res.end(JSON.stringify(results));
		
	}
	
	},queryString);
	
}

function overview(req, res) {
	
	console.log("inside overview function...");
	
	var queryString = "";
	
	queryString = "SELECT u.email_id, u.fname, u.lname, uc.phone_no, uc.address, uc.user_name FROM users u, users_contact_info uc WHERE u.email_id = uc.email_id AND u.email_id = '" + req.session.emailId + "'"; 
	console.log("Overview Query: "+ queryString);

	queryExec.fetchData(function(err,results){
	
	if(err){
		throw err;
	}
	else 
	{
			if (results.length > 0){
				console.log("Overview information fectched successfully");
				res.end(JSON.stringify(results));
			}
	}
	
	},queryString);
	
}

function follower_count(req, res) {
	
	console.log("inside overview function...");
	
	var queryString = "";
	
	queryString = "SELECT COUNT(dest_email) as follower1 FROM followtable WHERE source_email = '" + req.session.emailId + "' AND follow_status='A'"; 
	console.log("Overview Query: "+ queryString);

	queryExec.fetchData(function(err,results){
	
	if(err){
		throw err;
	}
	else 
	{
			if (results.length > 0){
				console.log("Overview information fectched successfully");
				res.end(JSON.stringify(results));
			}
	}
	
	},queryString);
	
}

function following_count(req, res) {
	
	console.log("inside overview function...");
	
	var queryString = "";
	
	queryString = "SELECT COUNT(dest_email) as following1 FROM followtable WHERE dest_email = '" + req.session.emailId + "' AND follow_status='A'"; 
	console.log("Overview Query: "+ queryString);

	queryExec.fetchData(function(err,results){
	
	if(err){
		throw err;
	}
	else 
	{
			if (results.length > 0){
				console.log("Overview information fectched successfully");
				res.end(JSON.stringify(results));
			}
	}
	
	},queryString);
	
}

function tweet_count(req, res) {
	
	console.log("inside overview function...");
	
	var queryString = "";
	
	queryString = "SELECT COUNT(feed) as tweets FROM news_feed WHERE email_id = '" + req.session.emailId + "' "; 
	console.log("Overview Query: "+ queryString);

	queryExec.fetchData(function(err,results){
	
	if(err){
		throw err;
	}
	else 
	{
			if (results.length > 0){
				console.log("Overview information fectched successfully");
				res.end(JSON.stringify(results));
			}
	}
	
	},queryString);
	
}


function logout(req, res) {
	
	console.log("inside logout function...");
	req.session.destroy();
	res.redirect('/');
}

exports.index=index;
exports.signUp=signUp;
exports.login=login;
exports.home=home;
exports.about=about;
exports.getProfile=getProfile;
exports.logout=logout;
exports.searchUser=searchUser;
exports.followUser=followUser;
exports.newsFeed=newsFeed;
exports.retweet=retweet;
exports.wall=wall;
exports.getFollowing=getFollowing;
exports.getFollowers=getFollowers;
exports.workedu=workedu;
exports.saveWorkEdu=saveWorkEdu;
exports.contactInfo=contactInfo;
exports.saveContactInfo=saveContactInfo;
exports.overview=overview;
exports.follower_count=follower_count;
exports.tweet_count=tweet_count;
exports.following_count=following_count;
