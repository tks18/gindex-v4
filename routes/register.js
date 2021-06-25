const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const transport = require('../plugins/mailtransporter');
const checkOrigin = require("../plugins/checkOrigin");
const randomstring = require('randomstring');
const registerNewUserTemplate = require('../templates/register/toUsers');
const jwtVerify = require('../plugins/jwtVerify');

//Model Imports
const User = require("../models/user");
const PendingUser = require("../models/pendingUser");
const SpamUser = require("../models/spamUser");
const InvitedUser = require("../models/invitedUser");

router.post('/user', function(req, res){
	if(checkOrigin(req.headers.origin)){
		if(jwtVerify(req.headers.token)){
			User.findOne({ email: req.body.adminuseremail }, function(error, result){
					if(result){
							if(result.admin){
								PendingUser.findOne({ email: req.body.email }, function(pendingUser, pendingResult){
									if(pendingResult){
										User.findOne({ email: req.body.email }, function(error, result){
											if(result){
												res.status(200).send({ auth: false, registered: true, message: "User Already Exists with this Email" });
											} else if(!result) {
												var temporaryPass = randomstring.generate({ length: 8, charset: 'alphanumeric' });
												bcrypt.hash(temporaryPass, 10, function(err, hashedPass){
													if(hashedPass){
														const newUser = new User({
															name: req.body.name,
															email: req.body.email,
															registeredDate: Date.now(),
															temppassword: hashedPass,
															password: null,
															role: "User",
															admin: false,
															superadmin: false,
															verified: false,
														})
														 newUser.save(function(error, doc){
															 if(!error){
																const message = {
																	 from: `"${process.env.FRONTENDSITENAME} - Support"<${process.env.EMAILID}>`,
																	 to: req.body.email,
																	 replyTo: process.env.REPLYTOMAIL,
																	 subject: 'We Have Accepted Your Request.',
																	 html: registerNewUserTemplate(doc, temporaryPass)
																};
																PendingUser.deleteOne({ email: req.body.email }, function(pendingError){
																	if(!pendingError){
																		transport.sendMail(message, function(err, info) {
																				if (err) {
																					User.deleteOne({ email: req.body.email}, function(error){
																						if(error){
																							console.log(error);
																						} else {
																							SpamUser.findOne({ email: req.body.email }, function(spamError, spamResult){
																								if(spamResult){
																									console.log(spamResult);
																								} else {
																									const newSpamUser = new SpamUser({
																										name: req.body.name,
																										email: req.body.email,
																										post: "User",
																										reason: "His Email Looks Like a Spam",
																										flaggedby: req.body.adminuseremail
																									})
																									newSpamUser.save(function(error, doc){
																										if(!error){
																											console.log(error)
																										} else {
																											console.log(error);
																										}
																									})
																								}
																							});
																							res.status(200).send({ auth: false, registered: false, message: "It Looks like the Recipient Mail is Spam." })
																						}
																					});
																				} else {
																					res.status(200).send({ auth: true, registered: true, message: 'User Successfully Registered.One Time Password has been sent to Recipient Mail that is Valid for 3 hours. In case the Recipient Did\'t Signup within this Period. Their Account will be Automatically Deleted.'});
																				}
																		});
																	} else {
																		res.status(200).send({ auth: true, registered: false, message: 'Error While Moving User Database Record. Please Try Again Later.' })
																	}
																})
															 } else {
																 res.status(200).send({ auth: true, registered: false, message: "Error Saving User" });
															 }
														 });
													} else {
														res.status(200).send({ auth: true, registered: false, message: "Error While Hashing Password, Please Try Again Now" });
													}
												})
											}
										})
									} else {
										res.status(200).send({ auth: false, registered: true, message: "A User has to Request in Order for Being Added. This is To Ensure that a User is a Human and Not a Spam Bot. Also to Control Admins Adding Multiple Users." });
									}
								})
							} else {
								res.status(200).send({ auth: false, registered: true, message: "You are Unauthorized" })
							}
					} else {
						res.status(200).send({ auth: false, registered: false, message: "BAD REQUEST" })
					}
				})
		} else {
			res.status(200).send({ auth: false, message: "Bearer Token Not Valid" })
		}
	} else {
		res.status(200).send({ auth: false, message: "UNAUTHORIZED" })
	}
});

router.post('/rootuser', function(req, res){
	User.findOne({ $or: [ { email: req.body.email }, { superadmin: true } ] }, function(error, result){
		if(result){
			res.render("dashboard.ejs", {user:false, showPass: false, data: "SuperAdmin Already Exists. You Cannot Proceed Here afterwards. Continue Through Your Frontend"})
		} else {
			if(process.env.SITESECRET == req.body.secret){
				if(req.body.password != null){
					bcrypt.hash(req.body.password, 10, function(err, hashedPass){
						if(hashedPass){
							const newRootUser = new User({
								name: req.body.name,
								email: req.body.email,
								temppassword: null,
								registeredDate: Date.now(),
								password: hashedPass,
								role: "Super Admin",
								admin: true,
								superadmin: true,
								verified: true,
							})
							newRootUser.save(function(error, doc){
								if(!error){
									res.render("dashboard.ejs", {user:true, showPass: false, details: newRootUser, fronturl: process.env.FRONTENDURL})
								} else {
									res.render("dashboard.ejs", {user:false, showPass: false, data: "There's an Error While Saving your Details. Please Try Again."})
								}
							})
						} else {
							res.render("dashboard.ejs", {user:false, showPass: false, data: "There's an Error while Hashing Your Password, Please Try Again Now."})
						}
					})
				} else {
					res.render("dashboard.ejs", {user:false, showPass: false, data: "Password is Null. Please try Again Entering Your Password"})
				}
			} else {
				res.render("dashboard.ejs", {user:false, showPass: false, data: "Your Secret Doesn't Match."})
			}
		}
	})
})

router.use('/approve', require('./approve'));

module.exports = router;
