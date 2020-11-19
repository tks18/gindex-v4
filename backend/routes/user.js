const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const transport = require('../plugins/mailtransporter');
const randomstring = require('randomstring');
const checkOrigin = require("../plugins/checkOrigin");
const jwtVerify = require('../plugins/jwtVerify');
const selfDeleteEmail = require('../templates/delete/users/toSelf');
const forgotPassEmail = require('../templates/request/existing/forgotPass');

//Model Imports
const User = require("../models/user");
const Settings = require("../models/siteSettings");

router.post('/verify', function(req, res){
	if(checkOrigin(req.headers.origin)){
		User.findOne({ email: req.body.email }, function(error, result){
				if(result){
					jwt.verify(req.body.token, process.env.TOKENSECRET, function(error, decoded){
						if(decoded){
							let activeSessions = result.sessions;
							if(activeSessions.map(session => {
								return session.sessionid
							}).indexOf(req.body.sessionId) > -1){
								var expiryUnixTime = decoded.exp * 1000;
								var issuedUnixTime = decoded.iat * 1000;
								const issueDate = new Date(issuedUnixTime).toLocaleString();
								const expiryDate = new Date(expiryUnixTime).toLocaleString();
								res.status(200).send({ auth: true, registered: true, tokenuser: decoded, issuedate: issueDate, expirydate: expiryDate });
							} else {
								res.status(200).send({auth: false, registered: false, tokenuser: null});
							}
						} else {
							res.status(200).send({auth: false, registered: false, tokenuser: null});
						}
					});
				} else {
					res.status(200).send({auth: false, registered: false, tokenuser: false});
				}
			})
	} else {
		res.status(200).send({ auth: false, message: "UNAUTHORIZED" })
	}
});

router.post('/changepassword', function(req, res){
	if(checkOrigin(req.headers.origin)){
		if(jwtVerify(req.headers.token)){
			User.findOne({ email: req.body.email }, function(error, result){
					if(result){
						if(result.password != null && req.body.oldpassword != null){
							bcrypt.compare(req.body.oldpassword, result.password, function(err, synced){
								if(synced){
									var newPass = req.body.newpassword;
									User.updateOne({ email: req.body.email }, {$set: { password: bcrypt.hashSync(newPass, 10), temppassword: null }}, function(error){
										if(!error){
											res.status(200).send({ auth: true, registered: true, changed: true, message: 'Password Successfully Changed'});
										} else {
											res.status(200).send({ auth: true, registered: true, changed: false, message: 'Error While Changing password'})
										}
									})
								} else {
									res.status(200).send({ auth: true, registered: true, changed: false, message: "Paswords Do not Match with Our Records" })
								}
							})
						} else {
							res.status(200).send({ auth: false, registered: true, changed: false, message: "Password is Null. Please Enter Your Password" });
						}
					} else {
						res.status(200).send({ auth: false, registered: false, changed: false, message: "Bad Request" })
					}
				})
		} else {
			res.status(200).send({ auth: false, message: "Bearer Token Not Valid" })
		}
	} else {
		res.status(200).send({ auth: false, message: "UNAUTHORIZED" })
	}
});

router.post('/forgotpass', function(req, res){
	if(checkOrigin(req.headers.origin)){
		User.findOne({ email: req.body.email }, function(error, result){
			if(result){
				var temporaryPass = randomstring.generate({ length: 8, charset: 'alphanumeric' });
				bcrypt.hash(temporaryPass, 10, function(err, hashedPass){
					if(hashedPass){
						User.updateOne({ email: req.body.email }, {$set: { password: null, temppassword: hashedPass, verified: false }}, function(error){
							if(!error){
								const otpMessage = {
									from: `"${process.env.FRONTENDSITENAME} - Support"<${process.env.EMAILID}>`,
									to: req.body.email,
									replyTo: process.env.REPLYTOMAIL,
									subject: 'Reset Your Password',
									html: forgotPassEmail(result, temporaryPass),
								}
								transport.sendMail(otpMessage, function(error, info){
									if(error){
										console.log(error);
									} else {
										console.log(info);
									}
								})
								res.status(200).send({auth: true, registered: true, changed: true, message: "OTP has been Sent to Your Email. Reset Your Password by entering the OTP." })
							} else {
								res.status(200).send({ auth: false, registered: false, changed: false, message: "Error Occured While Generating OTP. Please Try Again Later." });
							}
						})
					} else {
						res.status(200).send({ auth: false, registered: false, changed: false, message: "Error Occured While Generating OTP. Please Try Again Later." });
					}
				})
			} else {
				res.status(200).send({ auth: false, registered: false, changed: false, message: "Account Doesn't Exists" })
			}
		})
	} else {
		res.status(200).send({ auth: false, message: "UNAUTHORIZED" })
	}
})

router.post('/delete', function(req, res){
	if(checkOrigin(req.headers.origin)){
		if(jwtVerify(req.headers.token)){
			User.findOne({ email: req.body.email }, function(error, result){
					if(result){
						if(result.password != null && req.body.pass != null){
							bcrypt.compare(req.body.pass, result.password, function(err, synced){
								if(synced){
									User.deleteOne({ email: req.body.email }, function(error){
										if(error){
											res.status(200).send({ auth: true, registered: true, deleted: false, message: "Some Error Pinging the Servers. Try Again Later." });
										} else {
											const deleteMessage = {
												 from: `"${process.env.FRONTENDSITENAME} - Support"<${process.env.EMAILID}>`,
												 to: req.body.email,
												 bcc: req.body.ADMINEMAIL,
												 replyTo: process.env.REPLYTOMAIL,
												 subject: 'Account has been Deleted.',
												 html: selfDeleteEmail(result)
											};
											transport.sendMail(deleteMessage, function(error, info){
												if(error){
													console.log(error);
												} else {
													console.log(info);
												}
											})
											res.status(200).send({ auth: true, registered: true, deleted: true, message: "Your Account has been deleted" });
										}
									})
								} else {
									res.status(200).send({ auth: false, registered: true, deleted: false, message: "Your Admin Password is Wrong" });
								}
							})
						} else {
							res.status(200).send({ auth: false, registered: true, deleted: false, message: "Password is Null. Please Enter Your Password" });
						}
					} else {
						res.status(200).send({ auth: false, registered: false, deleted: false, message: "BAD REQUEST" });
					}
				})
		} else {
			res.status(200).send({ auth: false, message: "Bearer Token Not Valid" })
		}
	} else {
		res.status(200).send({ auth: false, message: "UNAUTHORIZED" })
	}
});

module.exports = router;
