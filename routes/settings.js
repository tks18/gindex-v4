const express = require("express");
const router = express.Router();
const checkOrigin = require("../plugins/checkOrigin");
const jwtVerify = require('../plugins/jwtVerify');

//Model Imports
const User = require("../models/user");
const Settings = require("../models/siteSettings");

router.post('/set', function(req, res){
	if(checkOrigin(req.headers.origin)){
		if(jwtVerify(req.headers.token)){
			User.findOne({ email: req.body.email }, function(error, result){
				if(result){
					if(result.admin && result.superadmin){
						Settings.findOne({ cId: process.env.FRONTENDSITENAME }, function(error, settingsData){
							if(settingsData){
								Settings.updateOne({ cId: process.env.FRONTENDSITENAME }, { $set: req.body.settings }, function(error){
									if(!error){
										res.status(200).send({ auth: true, registered: true, changed: true, message: "Your Preferences have been Saved." });
									} else {
										res.status(200).send({ auth: true, registered: true, changed: false, message: "Error Occured while Saving Your Preferences" });
									}
								})
							} else {
								const newData = new Settings(req.body.settings);
								newData.save(function(error, doc){
									if(!error){
										res.status(200).send({ auth: true, registered: true, changed: true, data: doc, message: "Your Preferences have been Saved." });
									}
								})
							}
						})
					} else {
						res.status(200).send({ auth: false, registered: true, changed: false, message: "You don't Have Enough Permissions." })
					}
				} else {
					res.status(200).send({ auth: false, registered: false, changed: false, message: "Account Doesn't Exists" })
				}
			})
		} else {
		  res.status(200).send({ auth: false, message: "Bearer Token Not Valid" })
		}
	} else {
		res.status(200).send({ auth: false, message: "UNAUTHORIZED" })
	}
})

router.post("/get", function(req, res){
	if(checkOrigin(req.headers.origin)){
		Settings.findOne({ cId: process.env.FRONTENDSITENAME }, function(error, result){
			if(result){
				res.status(200).send({ auth: true, registered: true, data: result });
			} else {
				res.status(200).send({ auth: false, registered: true, message: "There's an Error while Getting Site Details." });
			}
		})
	} else {
		res.status(200).send({ auth: false, message: "UNAUTHORIZED" })
	}
})

module.exports = router;
