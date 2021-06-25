const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkOrigin = require("../plugins/checkOrigin");
const router = express.Router();

//Model Imports
const User = require("../models/user");
const PendingUser = require("../models/pendingUser");
const SpamUser = require("../models/spamUser");

router.post('/', function(req, res){
	if(checkOrigin(req.headers.origin)){
		PendingUser.findOne({ email: req.body.email, post: "User" }, function(error, result){
				if(result){
					res.status(200).send({ auth: false, registered: true, token: null, message: "Your Email is Currently Pending Request. Please Wait till Accepting." });
				} else {
					SpamUser.findOne({ email: req.body.email }, function(error, result){
						if(result){
							res.status(200).send({ auth: false, registered: true, token: null, message: "You are Added to Spam List Due to Violation by a Admin. Contact Through Email for Support." });
						} else {
							User.findOne({ email: req.body.email }, function(error, result){
								if(result){
									var tempPassIsThere = result.temppassword != null ? true : false;
									var passNotThere = result.password == null ? true : false;
									if(!tempPassIsThere && !passNotThere){
										if(req.body.password != null && result.password){
											bcrypt.compare(req.body.password, result.password, function(err, synced){
												if(synced){
													if(result.sessions.length > process.env.MAXSESSIONS-1){
														User.updateOne({ email: req.body.email }, { $pull :{ sessions : { _id: result.sessions[0]._id}}}, function(error){
															if(!error){
																const existUser = result;
																existUser.sessions = [{
																	ip: req.connection.remoteAddress,
																	time: Date.now()
																}];
							                  let token = jwt.sign({ existUser }, process.env.TOKENSECRET, {expiresIn: 604800});
																let sessionToken = jwt.sign({ name: result.name, email: result.email, ip: req.connection.remoteAddress, time: Date.now() }, process.env.TOKENSECRET, {expiresIn: 604800});
																let sessionData = result.sessions.create({
																	sessionid: sessionToken,
																	ip: req.connection.remoteAddress,
																	token: token,
																	time: Date.now()
																});
																User.updateOne({ email: req.body.email }, {$push: { sessions: sessionData}}, function(error){
																	if(!error){
																		var issueUnix = Math.floor(Date.now() / 1000)
																		var expiryUnix = issueUnix + 604800;
																		var expiryUnixTime = expiryUnix * 1000;
																		var issuedUnixTime = issueUnix * 1000;
																		const userData = {
																			email: existUser.email,
																			name: existUser.name,
																			admin: existUser.admin,
																			role: existUser.role,
																			superadmin: existUser.superadmin,
																			verified: existUser.verified,
																		}
																		res.status(200).send({ auth: true, registered: true, token: token, tokenuser:userData, sessiondata: sessionData, issuedat: issuedUnixTime, expiryat: expiryUnixTime });
																	} else {
																		res.status(200).send({ auth: false, registered: true, token: null, message: "Session Data Wrongly Saved. Please Try Later" });
																	}
																})
															} else {
																console.log(error);
																res.status(200).send({ auth: false, registered: true, token: null, message: "Session Data Wrongly Saved. Please Try Later" });
															}
														})
													} else {
														const existUser = result;
														existUser.sessions = [{
															ip: req.connection.remoteAddress,
															time: Date.now()
														}];
					                  let token = jwt.sign({ existUser }, process.env.TOKENSECRET, {expiresIn: 604800});
														let sessionToken = jwt.sign({ name: result.name, email: result.email, ip: req.connection.remoteAddress, time: Date.now() }, process.env.TOKENSECRET, {expiresIn: 604800});
														let sessionData = result.sessions.create({
															sessionid: sessionToken,
															ip: req.connection.remoteAddress,
															token: token,
															time: Date.now()
														});
														User.updateOne({ email: req.body.email }, {$push: { sessions: sessionData}}, function(error){
															if(!error){
																var issueUnix = Math.floor(Date.now() / 1000)
																var expiryUnix = issueUnix + 604800;
																var expiryUnixTime = expiryUnix * 1000;
																var issuedUnixTime = issueUnix * 1000;
																const userData = {
																	email: existUser.email,
																	name: existUser.name,
																	admin: existUser.admin,
																	role: existUser.role,
																	superadmin: existUser.superadmin,
																	verified: existUser.verified,
																}
																res.status(200).send({ auth: true, registered: true, token: token, tokenuser:userData, sessiondata: sessionData, issuedat: issuedUnixTime, expiryat: expiryUnixTime });
															} else {
																res.status(200).send({ auth: false, registered: true, token: null, message: "Session Data Wrongly Saved. Please Try Later" });
															}
														})
													}
												} else {
													res.status(200).send({ auth: false, registered: true, token: null, message: "User Password is Wrong" });
												}
											})
			              } else {
			                res.status(200).send({ auth: false, registered: true, token: null, message: "Password is Null. Please Enter Your Password" });
			              }
									} else {
										res.status(200).send({auth: false, registered: false, token: null, message: "Please Verify your Account Before Logging in." });
									}
								} else {
									res.status(200).send({auth: false, registered: false, token: null, message: "User Not Found with this Email." });
								}
							})
						}
					})
				}
			})
	} else {
		res.status(200).send({ auth: false, message: "UNAUTHORIZED" })
	}
});

module.exports = router;
