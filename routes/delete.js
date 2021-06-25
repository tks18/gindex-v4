const express = require("express");
const router = express.Router();
const transport = require('../plugins/mailtransporter');
const bcrypt = require("bcrypt");
const checkOrigin = require("../plugins/checkOrigin");
const jwtVerify = require('../plugins/jwtVerify');
const deleteMailTemplate = require("../templates/delete/users/toUsers");

//Model Imports
const User = require("../models/user");

router.post('/user', function(req, res){
	if(checkOrigin(req.headers.origin)){
		if(jwtVerify(req.headers.token)){
			User.findOne({ email: req.body.adminuseremail }, function(error, result){
					if(result){
						if(result.admin){
							if(result.temprestricted){
								res.status(200).send({ auth: false, registered: true, deleted: false, message: "You Have been Temporarily Restricted from Modifying Permissions of Users." });
							} else {
								User.findOne({ email: req.body.email }, function(error, result){
									if(result){
										if(result.admin){
											res.status(200).send({ auth: false, registered: true, deleted: false, message: "You are Trying to Remove a Admin. Permission Scope Not there." });
										} else {
											User.deleteOne({ email: req.body.email }, function(error){
												if(error){
													res.status(200).send({ auth: true, registered: true, deleted: false, message: "Some Error Pinging the Servers. Try Again Later." });
												} else {
													const deleteMessage = {
														 from: `"${process.env.FRONTENDSITENAME} - Support"<${process.env.EMAILID}>`, // Sender address
														 to: req.body.email,
														 bcc: req.body.ADMINEMAIL,
														 replyTo: process.env.REPLYTOMAIL,
														 subject: 'Account has been Deleted.',
														 html: deleteMailTemplate(result, req.body.ADMINEMAIL)
													};
													transport.sendMail(deleteMessage, function(error, info){
														if(error){
															console.log(error);
														} else {
															console.log(info);
														}
													})
													res.status(200).send({ auth: true, registered: true, deleted: true, message: "User has been deleted" });
												}
											})
										}
									} else {
										res.status(200).send({ auth: true, registered: true, deleted: false, message: "No User Found with this Email" });
									}
								})
							}
						} else {
							res.status(200).send({ auth: false, registered: false, deleted: false, message: "You are Unauthorized" });
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

router.post('/admin', function(req, res){
	if(checkOrigin(req.headers.origin)){
		if(jwtVerify(req.headers.token)){
			User.findOne({ email: req.body.adminuseremail }, function(error, result){
					if(result){
						if(result.admin && result.superadmin){
							if(result.temprestricted){
								res.status(200).send({ auth: false, registered: true, deleted: false, message: "You Have been Temporarily Restricted from Modifying Permissions of Users." });
							} else {
								User.findOne({ email: req.body.email }, function(error, result){
									if(result){
										User.deleteOne({ email: req.body.email }, function(error){
											if(error){
												res.status(200).send({ auth: true, token: true, registered: true, deleted: false, message: "Some Error Pinging the Servers. Try Again Later." });
											} else {
												const deleteMessage = {
													 from: `"${process.env.FRONTENDSITENAME} - Support"<${process.env.EMAILID}>`,
													 to: req.body.email,
													 bcc: req.body.ADMINEMAIL,
													 replyTo: process.env.REPLYTOMAIL,
													 subject: 'Account has been Deleted.',
													 html: deleteMailTemplate(result, req.body.ADMINEMAIL)
												};
												transport.sendMail(deleteMessage, function(error, info){
													if(error){
														console.log(error);
													} else {
														console.log(info);
													}
												});
												res.status(200).send({ auth: true, registered: true, deleted: true, message: "User has been deleted" });
											}
										})
									} else {
										res.status(200).send({ auth: true, registered: true, deleted: false, message: "No User Found with this Email" });
									}
								})
							}
						} else {
							res.status(200).send({ auth: false, registered: false, deleted: false, message: "You are Unauthorized" });
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
})

module.exports = router;
