'use strict';

const logger = require('../config/logger.js');	
const service = "manageFilesController";
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');
const db = require('../config/db.config.js');
const Location = db.locations;
const Op = require('sequelize').Op;

exports.list_files = function(req, res) {
	
	const { userContext } = req
	
	logger.info({
		service: service,
		message: 'Request to list files'
	}); 
	
	fs.readdir(process.env.DOWNLOAD_FILE_DIRECTORY, function (err, files) {
		//handling error
		if (err) {
			logger.error({
				service: service,
				message: 'Unable to scan directory: ' + err
			}); 
		} 
		
		res.render('manage_files', { userContext, files, req })
	});
};

exports.delete_file = function(req, res) {
	
	const { userContext } = req
	
	logger.info({
		service: service,
		message: 'Request to delete file:'+req.params['filename']
	}); 
	
	if (userContext) {
		var file = req.params['filename'];
		
		//Delete file.
		fs.unlinkSync(process.env.DOWNLOAD_FILE_DIRECTORY+file);
		
		//Forward back to manage files page.
		req.flash('success_msg', 'Successfully deleted file: '+file);
		res.redirect('/manage_files');
	}else
		res.send(403,"You do not have rights to visit this page");
};

exports.upload_file = function(req, res) {
	
	const { userContext } = req
	
	logger.info({
		service: service,
		message: 'Request to upload file'
	}); 
	
	if (userContext) {
		//Save file.
		const form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files) {
			if (err) { 
				logger.error({
					service: service,
					message: 'Error uploading the file:' + err
				});
			}
			fs.rename(files.file.path, process.env.DOWNLOAD_FILE_DIRECTORY+files.file.name, function (err) {
				if (err) { 
					logger.error({
						service: service,
						message: 'Error uploading the file:' + err
					});
				} else{
				
					//Update location record last updated date, if file with this name is already part of the a location config.
					var locationName = "";
					Location.findAll({ where: { [Op.or]: [{bannerImagePath: String(files.file.name)}, 
													  {assetPath: String(files.file.name)}, 
													  {assetPathiOS: String(files.file.name)}, 
													  {assetPathAndroid: String(files.file.name)}, 
													  {scenePath: String(files.file.name)}, 
													  {scenePathiOS: String(files.file.name)}, 
													  {scenePathAndroid: String(files.file.name)}
													] } }).then(locations => {
						for (var i = 0; i < locations.length; i++) {
							locationName = locations[i].friendlyName;
							locations[i].friendlyName = "temp name in order to refresh the last update timestamp";
							locations[i].save();
							locations[i].friendlyName = locationName;
							locations[i].save();
						}
					});
				}
			});
			
			//Forward back to manage files page.
			if(files.file.name=="")
				req.flash('error_msg', 'Please select file before you press upload.');
			else
				req.flash('success_msg', 'Successfully uploaded file: '+files.file.name);
			res.redirect('/manage_files');
		});
	}else
		res.send(403,"You do not have rights to visit this page");
};