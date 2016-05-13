/**
 * New node file
 */
var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){

	it('should return the login if the url is correct', function(done){
		http.get('http://localhost:3000/', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});

	it('should not return the home page if the url is wrong', function(done){
		http.get('http://localhost:3000/homepage', function(res) {
			assert.equal(404, res.statusCode);
			done();
		})
	});

it('should return the home page if the url is right', function(done){
		http.get('http://localhost:3000/home', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});


	it('should login', function(done) {
		request.post(
			    'http://localhost:3000/home',
			    { form: { username: 'loginInfo.emailId',password:'loginInfo.loginPass' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
});