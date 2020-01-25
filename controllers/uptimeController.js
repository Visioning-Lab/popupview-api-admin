'use strict';

const logger = require('../config/logger.js');	
const service = "uptimeController";

const path = require('path');
const db = require('../config/db.config.js');
const Location = db.locations;

exports.uptime = function(req, res) {
	
	logger.info({
		service: service,
		message: 'Request to uptime service'
	}); 
	
	res.setHeader('Content-Type', 'text/html');
	
	Location.findAll().then(locations => {
		if(locations.length > 0){			
				res.status(200).send("success");
				logger.info({
					service: service,
					message: 'Returned system fully available.'
				});
		}else{
			logger.info({
							service: service,
							message: 'Uptime service failed'
						});
			res.status(500).send("failed");
		}
			
	});	
};