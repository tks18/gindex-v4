const nodemailer = require('nodemailer');

// Define Mail Transporter
let transport = nodemailer.createTransport({
	host: process.env.EMAILSMTP,
	port: process.env.EMAILPORT,
	service:process.env.EMAILSERVICE,
	auth: {
		 user: process.env.EMAILID,
		 pass: process.env.EMAILPASS
	}
});

module.exports = transport;
