const express = require("express");
const router = express.Router();
const checkOrigin = require("../../plugins/checkOrigin");
const jwtVerify = require('../../plugins/jwtVerify');

//Model Imports
const User = require("../../models/user");
const SpamUser = require("../../models/spamUser");

router.post('/all', function(req, res){
	if(checkOrigin(req.headers.origin)){
		if(jwtVerify(req.headers.token)){
			User.findOne({ email: req.body.adminuseremail }, function(error, result){
					if(result){
						if(result.admin){
							if(result.superadmin){
								SpamUser.find({}, function(error, result){
									if(result){
										if(result.length == 0){
											res.status(200).send({ auth: false, registered: true, message: "No Users Found" })
										} else {
											res.status(200).send({ auth: true, registered: true, users: result })
										}
									} else {
										res.status(200).send({ auth: false, registered: true, message: "No Users Found." })
									}
								})
							} else {
								res.status(200).send({ auth: false, registered: true, message: "You are Unauthorized" })
							}
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
	};
})

router.post('/users', function(req, res){
	if(checkOrigin(req.headers.origin)){
		if(jwtVerify(req.headers.token)){
			User.findOne({ email: req.body.adminuseremail }, function(error, result){
					if(result){
						if(result.admin){
							SpamUser.find({ post: "User"}, function(error, result){
								if(result){
									if(result.length == 0){
										res.status(200).send({ auth: false, registered: true, message: "No Users Found" })
									} else {
										res.status(200).send({ auth: true, registered: true, users: result })
									}
								} else {
									res.status(200).send({ auth: false, registered: true, message: "No Users Found." })
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
})

router.post('/admins', function(req, res){
	if(checkOrigin(req.headers.origin)){
		if(jwtVerify(req.headers.token)){
			User.findOne({ email: req.body.adminuseremail }, function(error, result){
					if(result){
						if(result.admin){
							if(result.superadmin){
								SpamUser.find({ post: "Admin"}, function(error, result){
									if(result){
										if(result.length == 0){
											res.status(200).send({ auth: false, registered: true, message: "No Users Found" })
										} else {
											res.status(200).send({ auth: true, registered: true, users: result })
										}
									} else {
										res.status(200).send({ auth: false, registered: true, message: "No Users Found." })
									}
								})
							} else {
								res.status(200).send({ auth: false, registered: true, message: "You are Unauthorized" })
							}
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
})

router.post('/superadmins', function(req, res){
	if(checkOrigin(req.headers.origin)){
		if(jwtVerify(req.headers.token)){
			User.findOne({ email: req.body.adminuseremail }, function(error, result){
					if(result){
						if(result.admin){
							if(result.superadmin){
								SpamUser.find({ post: "SuperAdmin"}, function(error, result){
									if(result){
										if(result.length == 0){
											res.status(200).send({ auth: false, registered: true, message: "No Users Found" })
										} else {
											res.status(200).send({ auth: true, registered: true, users: result })
										}
									} else {
										res.status(200).send({ auth: false, registered: true, message: "No Users Found." })
									}
								})
							} else {
								res.status(200).send({ auth: false, registered: true, message: "You are Unauthorized" })
							}
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
})


module.exports = router;
