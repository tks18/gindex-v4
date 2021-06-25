const express = require("express");
const router = express.Router();
const transport = require('../plugins/mailtransporter');
const checkOrigin = require("../plugins/checkOrigin");
const newRequestToAdminTemplate = require('../templates/request/newUser/toAdmin');
const newRequestToUserTemplate = require('../templates/request/newUser/toUser');
const existingRequestToAdminTemplate = require('../templates/request/existing/toAdmin');
const existingRequestToUserTemplate = require('../templates/request/existing/toUser');
const jwtVerify = require('../plugins/jwtVerify');

//Model Imports
const User = require("../models/user");
const PendingUser = require("../models/pendingUser");
const SpamUser = require("../models/spamUser");
const InvitedUser = require("../models/invitedUser");
const Settings = require("../models/siteSettings");

router.post('/user', function(req, res){
	if(checkOrigin(req.headers.origin)){
		Settings.findOne({ cId: process.env.FRONTENDSITENAME }, function(error, settingsData){
			if(!settingsData || settingsData.requests){
				PendingUser.findOne({ email: req.body.email }, function(pendingError, pendingResult){
						if(pendingResult){
							res.status(200).send({auth: false, registered: false, message: "You Have Already Requested to Join. Please Wait While We Accept." });
						} else {
							SpamUser.findOne({ email: req.body.email }, function(spamError, spamResult){
								if(spamResult){
									res.status(200).send({
										auth: false,
										registered: false,
										message: "You Already Have an Account and Also You are in our Spam List. Contact through Email to Login."
									});
								} else {
									User.findOne({ email: req.body.email }, function(error, result){
										if(result){
											res.status(200).send({
												auth: false,
												registered: false,
												message: "User already Registered with this Email."
											});
										} else {
											InvitedUser.findOne({ email: req.body.email, post: "User" }, function(error, result){
												if(result){
													InvitedUser.deleteOne({ email: req.body.email, post: "User" }, function(error){
														if(error){
															console.log(error);
														} else {
															console.log("Deleted");
														}
													})
												} else {
													console.log("Request Not Found");
												}
											})
											User.find({ admin: true }, function(error, result){
												let adminEmails = [];
												result.forEach((admin, i) => {
													adminEmails.push(admin.email)
												});
												const newPendingUser = new PendingUser({
													name: req.body.name,
													email:req.body.email,
													drive: req.body.drives,
													post: "User",
													message: req.body.message
												});
												newPendingUser.save(function(error, doc){
													if(!error){
														const adminMessage = {
															 from: `"${process.env.FRONTENDSITENAME} - Support"<${process.env.EMAILID}>`,
															 to: adminEmails,
															 replyTo: process.env.REPLYTOMAIL,
															 subject: `${process.env.FRONTENDSITENAME} - Access Request`,
															 html: newRequestToAdminTemplate(req.body)
														};
														const userMessage = {
															 from: `"${process.env.FRONTENDSITENAME} - Support"<${process.env.EMAILID}>`,
															 to: req.body.email,
															 replyTo: process.env.REPLYTOMAIL,
															 subject: 'Your Request is Pending Confirmation.',
															 html: newRequestToUserTemplate(req.body),
														};
														transport.sendMail(adminMessage, function(error, info){
															if(error){
																console.log(error);
															} else {
																console.log(info);
															}
														})
														transport.sendMail(userMessage, function(error, info){
															if(error){
																console.log(error);
															} else {
																console.log(info);
															}
														})
														res.status(200).send({
															auth: true,
															registered: true,
															message: "Your Request has been Sent to our Admins for Processing"
														});
													} else {
														res.status(200).send({
															auth: false,
															registered: true,
															message: "Ther's an Error Processing Your Request. Please Try Again Later."
														});
													}
												})
											})
										}
									})
								}
							})
						}
					})
			} else {
				res.status(200).send({
					auth: false,
					registered: true,
					message: "User Requests are Closed by the Admin. Please Try Afterwards or Contact Admins."
				});
			}
		})
	} else {
		res.status(200).send({ auth: false, message: "UNAUTHORIZED" })
	}
})

router.post('/admin', function(req, res){
	if(checkOrigin(req.headers.origin)){
		if(jwtVerify(req.headers.token)){
			Settings.findOne({ cId: process.env.FRONTENDSITENAME }, function(err, settingsData){
				if(!settingsData || settingsData.adminRequests){
					PendingUser.findOne({ email: req.body.email, post: "Admin" }, function(error, result){
							if(result){
								res.status(200).send({
									auth: true,
									changed: false,
									message: "You are Allowed to Request only One Time.Please Wait"
								});
							} else {
								User.findOne({ email: req.body.email }, function(error, result){
									if(result){
										if(result.superadmin){
											res.status(200).send({
												auth: true,
												changed: false,
												message: "You are a Already a Super Admin"
											});
										} else {
											if(result.admin){
												res.status(200).send({
													auth: true,
													changed: false,
													message: "You are Already an Admin."
												});
											} else {
												User.find({ superadmin: true }, function(error, result){
													let adminEmails = [];
													result.forEach((admin, i) => {
														adminEmails.push(admin.email)
													});
													const newPendingUser = new PendingUser({
														name: req.body.name,
														email: req.body.email,
														drive: 0,
														post: "Admin",
														message: req.body.message
													})
													newPendingUser.save(function(error, doc){
														if(error){
															res.status(200).send({
																auth: true,
																changed: false,
																message: "Error Sending Your Request."
															});
														} else {
															const adminMessage = {
																 from: `"${process.env.FRONTENDSITENAME} - Support"<${process.env.EMAILID}>`,
																 to: adminEmails,
																 replyTo: process.env.REPLYTOMAIL,
																 subject: `${process.env.FRONTENDSITENAME} - Admin Request`,
																 html: existingRequestToAdminTemplate(req.body, "Admin")
															};
															const userMessage = {
																 from: `"${process.env.FRONTENDSITENAME} - Support"<${process.env.EMAILID}>`,
																 to: req.body.email,
																 replyTo: process.env.REPLYTOMAIL,
																 subject: 'Your Request is Pending Confirmation.',
																 html: existingRequestToUserTemplate(req.body, "Admin"),
															};
															transport.sendMail(adminMessage, function(error, info){
																if(error){
																	console.log(error);
																} else {
																	console.log(info);
																}
															})
															transport.sendMail(userMessage, function(error, info){
																if(error){
																	console.log(error);
																} else {
																	console.log(info);
																}
															})
															res.status(200).send({
																auth: true,
																registered: true,
																message: "Your Request has been Sent to our Admins for Processing"
															});
														}
													})
												})
											}
										}
									} else {
										res.status(200).send({
											auth: true,
											changed: false,
											message: "BAD REQUEST"
										});
									}
								})
							}
						})
				} else {
					res.status(200).send({
						auth: false,
						registered: true,
						message: "User Requests are Closed by the Admin. Please Try Afterwards or Contact Admins."
					});
				}
			})
		} else {
			res.status(200).send({ auth: false, message: "Bearer Token Not Valid" })
		}
	} else {
		res.status(200).send({ auth: false, message: "UNAUTHORIZED" })
	}
})

router.post('/superadmin', function(req, res){
	if(checkOrigin(req.headers.origin)){
		if(jwtVerify(req.headers.token)){
			Settings.findOne({ cId: process.env.FRONTENDSITENAME }, function(err, settingsData){
				if(!settingsData || settingsData.adminRequests){
					PendingUser.findOne({ email: req.body.email, post: "SuperAdmin" }, function(error, result){
							if(result){
								res.status(200).send({
									auth: true,
									changed: false,
									message: "You are Allowed to Request only One Time.Please Wait"
								});
							} else {
								User.findOne({ email: req.body.email }, function(error, result){
									if(result){
										if(result.superadmin){
											res.status(200).send({
												auth: true,
												changed: false,
												message: "You are a Already a Super Admin"
											});
										} else {
											if(result.admin){
												User.find({ superadmin: true }, function(error, result){
													let adminEmails = [];
													result.forEach((admin, i) => {
														adminEmails.push(admin.email)
													});
													const newPendingUser = new PendingUser({
														name: req.body.name,
														email: req.body.email,
														post: "SuperAdmin",
														drive: 0,
														message: req.body.message
													})
													newPendingUser.save(function(error, doc){
														if(error){
															res.status(200).send({
																auth: true,
																changed: false,
																message: "Error Sending Your Request."
															});
														} else {
															const adminMessage = {
																 from: `"${process.env.FRONTENDSITENAME} - Support"<${process.env.EMAILID}>`,
																 to: adminEmails,
																 replyTo: process.env.REPLYTOMAIL,
																 subject: `${process.env.FRONTENDSITENAME} - Admin Request`,
																 html: existingRequestToAdminTemplate(req.body, "Superadmin")
															};
															const userMessage = {
																 from: `"${process.env.FRONTENDSITENAME} - Support"<${process.env.EMAILID}>`,
																 to: req.body.email,
																 replyTo: process.env.REPLYTOMAIL,
																 subject: 'Your Request is Pending Confirmation.',
																 html: existingRequestToUserTemplate(req.body, "Admin"),
															};
															transport.sendMail(adminMessage, function(error, info){
																if(error){
																	console.log(error);
																} else {
																	console.log(info);
																}
															})
															transport.sendMail(userMessage, function(error, info){
																if(error){
																	console.log(error);
																} else {
																	console.log(info);
																}
															})
															res.status(200).send({
																auth: true,
																registered: true,
																message: "Your Request has been Sent to our Admins for Processing"
															});
														}
													})
												})
											} else {
												res.status(200).send({
													auth: true,
													changed: false,
													message: "You Need to be a Admin to Request to be a Super Admin."
												});
											}
										}
									} else {
										res.status(200).send({
											auth: true,
											changed: false,
											message: "BAD REQUEST"
										});
									}
								})
							}
						})
				} else {
					res.status(200).send({
						auth: false,
						registered: true,
						message: "User Requests are Closed by the Admin. Please Try Afterwards or Contact Admins."
					});
				}
			})
		} else {
			res.status(200).send({ auth: false, message: "Bearer Token Not Valid" })
		}
	} else {
		res.status(200).send({ auth: false, message: "UNAUTHORIZED" })
	}
})

router.use('/remove', require('./remove'));

module.exports = router;
