const express = require("express");
const router = express.Router();
const checkOrigin = require("../plugins/checkOrigin");
const jwtVerify = require('../plugins/jwtVerify');

//Model Imports
const User = require("../models/user");
const PendingUser = require("../models/pendingUser");
const SpamUser = require("../models/spamUser");
const InvitedUser = require("../models/invitedUser");
const Settings = require("../models/siteSettings");

router.post('/all', function(req, res){
	if(checkOrigin(req.headers.origin)){
		if(jwtVerify(req.headers.token)){
			User.findOne({ email: req.body.email }, function(error, result){
					if(result){
						if(result.admin){
							if(result.superadmin){
								User.find({}, function(error, result){
									if(result){
										if(result.length == 0){
											res.status(200).send({ auth: false, registered: false, message: "No Users Found" });
										} else {
											const filteredUsers = result.filter(user => {
												return user.email != req.body.email;
											})
											const secureUsers = filteredUsers.map(item => {
												return {
													name: item['name'],
													email: item['email'],
													admin: item['admin'],
													superadmin: item['superadmin'],
													verified: item['verified'],
													role: item['role']
												}
											})
												res.status(200).send({ auth: true, registered: true, users: secureUsers });
										}
									} else {
										res.status(200).send({ auth: false, registered: false, message: "Error Processing Your Request" });
									}
								})
							} else {
								res.status(200).send({ auth: false, registered: false, message: "You are Unauthorized" });
							}
						} else {
							res.status(200).send({ auth: false, registered: false, message: "You are Unauthorized" });
						}
					} else {
						res.status(200).send({ auth: false, registered: false, message: "BAD REQUEST" });
					}
				})
		} else {
			res.status(200).send({ auth: false, message: "Bearer Token Not Valid" })
		}
	} else {
		res.status(200).send({ auth: false, message: "UNAUTHORIZED" })
	}
})

router.post('/users', function(req, res){
	if(checkOrigin(req.headers.origin)){
		if(jwtVerify(req.headers.token)){
			User.findOne({ email: req.body.email }, function(error, result){
					if(result){
						if(result.admin){
							User.find({ admin: false, superadmin: false }, function(error, result){
								if(result){
									if(result.length == 0){
										res.status(200).send({ auth: false, registered: false, message: "No Users Found" });
									} else {
										const filteredUsers = result.filter(user => {
											return user.email != req.body.email;
										});
										const secureUsers = filteredUsers.map(item => {
											return {
												name: item['name'],
												email: item['email'],
												admin: item['admin'],
												superadmin: item['superadmin'],
												verified: item['verified'],
												role: item['role']
											}
										})
											res.status(200).send({ auth: true, registered: true, users: secureUsers });
										}
									} else {
										res.status(200).send({ auth: false, registered: false, message: "Error Processing Your Request" });
									}
								})
						} else {
							res.status(200).send({ auth: false, registered: false, message: "You are Unauthorized" });
						}
					} else {
						res.status(200).send({ auth: false, registered: false, message: "BAD REQUEST" });
					}
				})
		} else {
			res.status(200).send({ auth: false, message: "Bearer Token Not Valid" })
		}
	} else {
		res.status(200).send({ auth: false, message: "UNAUTHORIZED" })
	}
})

router.post('/admins', function(req, res){
	if(checkOrigin(req.headers.origin)){
		if(jwtVerify(req.headers.token)){
			User.findOne({ email: req.body.email }, function(error, result){
					if(result){
						if(result.admin){
							if(result.superadmin){
								User.find({ admin: true, superadmin: false }, function(error, result){
									if(result){
										if(result.length == 0){
											res.status(200).send({ auth: false, registered: false, message: "No Users Found" });
										} else {
											const filteredUsers = result.filter(user => {
												return user.email != req.body.email;
											});
											const secureUsers = filteredUsers.map(item => {
												return {
													name: item['name'],
													email: item['email'],
													admin: item['admin'],
													superadmin: item['superadmin'],
													verified: item['verified'],
													role: item['role']
												}
											})
												res.status(200).send({ auth: true, registered: true, users: secureUsers });
										}
									} else {
										res.status(200).send({ auth: false, registered: false, message: "Error Processing Your Request" });
									}
								})
							} else {
								res.status(200).send({ auth: false, registered: false, message: "You are Unauthorized" });
							}
						} else {
							res.status(200).send({ auth: false, registered: false, message: "You are Unauthorized" });
						}
					} else {
						res.status(200).send({ auth: false, registered: false, message: "BAD REQUEST" });
					}
				})
		} else {
			res.status(200).send({ auth: false, message: "Bearer Token Not Valid" })
		}
	} else {
		res.status(200).send({ auth: false, message: "UNAUTHORIZED" })
	}
})

router.post('/superadmins', function(req, res){
	if(checkOrigin(req.headers.origin)){
		if(jwtVerify(req.headers.token)){
			User.findOne({ email: req.body.email }, function(error, result){
					if(result){
						if(result.admin){
							if(result.superadmin){
								User.find({ admin: true, superadmin: true }, function(error, result){
									if(result){
										if(result.length == 0){
											res.status(200).send({ auth: false, registered: false, message: "No Users Found" });
										} else {
											const filteredUsers = result.filter(user => {
												return user.email != req.body.email;
											});
											const secureUsers = filteredUsers.map(item => {
												return {
													name: item['name'],
													email: item['email'],
													admin: item['admin'],
													superadmin: item['superadmin'],
													verified: item['verified'],
													role: item['role']
												}
											})
												res.status(200).send({ auth: true, registered: true, users: secureUsers });
										}
									} else {
										res.status(200).send({ auth: false, registered: false, message: "Error Processing Your Request" });
									}
								})
							} else {
								res.status(200).send({ auth: false, registered: false, message: "You are Unauthorized" });
							}
						} else {
							res.status(200).send({ auth: false, registered: false, message: "You are Unauthorized" });
						}
					} else {
						res.status(200).send({ auth: false, registered: false, message: "BAD REQUEST" });
					}
				})
		} else {
			res.status(200).send({ auth: false, message: "Bearer Token Not Valid" })
		}
	} else {
		res.status(200).send({ auth: false, message: "UNAUTHORIZED" })
	}
})

router.use('/pending', require('./pending'));
router.use('/spam', require('./getspam'));


module.exports = router;
