'use strict';

const logger = require('../config/logger.js');	
const service = "manageLocationsController";
const db = require('../config/db.config.js');
const Location = db.locations;

exports.list_locations = function(req, res) {
	
	const { userContext } = req
	
	logger.info({
		service: service,
		message: 'Request to list locations'
	}); 
	
	Location.findAll().then(locations => {
		res.render('manage_locations', { userContext, locations, req })
	});	
};

exports.delete_location = function(req, res) {
	
	const { userContext } = req
	
	logger.info({
		service: service,
		message: 'Request to delete location:'+req.params['id']
	}); 
	
	if (userContext) {
		var idValue = req.params['id'];
		
		Location.findOne({ where: { id: idValue } }).then(location => {
			location.destroy()
			req.flash('success_msg', 'Successfully deleted location.');
			
			//Forward back to manage locations page.
			res.redirect('/manage_locations');
		});	
	}else
		res.send(403,"You do not have rights to visit this page");
};

exports.edit_location = function(req, res) {
	
	const { userContext } = req
	
	logger.info({
		service: service,
		message: 'Request to edit location:'+req.params['id']
	}); 
	
	if (userContext) {
		var idValue = req.params['id'];
		
		//If get method and thefore loading the form the first time.
		if(req.method=='GET'){
			Location.findOne({ where: { id: idValue } }).then(location => {
				
				//Create empty location form, if we are about to add a new location.
				if(!location){
				  location = {id:0, friendlyName:"", bannerImagePath:"", infoURL:"", assetPath:"", scenePath:"", assetPathiOS:"", scenePathiOS:"", assetPathAndroid:"", scenePathAndroid:""};			
				}
				
				res.render('edit_location', { userContext, location, req });
				
			});	
		}else{
			//Else it is a POST from the form and we need to either create a new location or update the existing location.
			
			//Create a new location if id is set to zero.
			if(req.body.id=='0'){
					const locationRow = Location.build({friendlyName: req.body.friendlyName, bannerImagePath: req.body.bannerImagePath, infoURL: req.body.infoURL, assetPath: req.body.assetPath, scenePath: req.body.scenePath, assetPathiOS: req.body.assetPathiOS, scenePathiOS: req.body.scenePathiOS, assetPathAndroid: req.body.assetPathAndroid, scenePathAndroid: req.body.scenePathAndroid});
					locationRow.save();
					
					req.flash('success_msg', 'Successfully added a new location.');
					//Forward back to manage locations page.
					res.redirect('/manage_locations');
			}else{
				//Otherwise it is an update to existing location record.
				Location.findOne({ where: { id: req.body.id } }).then(locationRow => {
				
					locationRow.friendlyName = req.body.friendlyName;
					locationRow.bannerImagePath = req.body.bannerImagePath;
					locationRow.infoURL = req.body.infoURL;
					locationRow.assetPath = req.body.assetPath;
					locationRow.scenePath = req.body.scenePath;
					locationRow.assetPathiOS = req.body.assetPathiOS;
					locationRow.scenePathiOS = req.body.scenePathiOS;
					locationRow.assetPathAndroid = req.body.assetPathAndroid;
					locationRow.scenePathAndroid = req.body.scenePathAndroid;
					locationRow.save();
					
					req.flash('success_msg', 'Successfully updated location.');
					//Forward back to manage locations page.
					res.redirect('/manage_locations');
				});	
			}
		}
	}else
		res.send(403,"You do not have rights to visit this page");
};