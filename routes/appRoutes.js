const express = require('express')
const router = express.Router()

var manage_files = require('../controllers/manageFilesController');
var manage_locations = require('../controllers/manageLocationsController');
var uptime = require('../controllers/uptimeController');

router.get('/uptime', uptime.uptime);

router.get('/', (req, res) => {
	const { userContext } = req
    res.render('index', { userContext })
})

router.get('/manage_files', manage_files.list_files);
router.get('/delete_file/:filename', manage_files.delete_file);
router.post('/upload_file', manage_files.upload_file);

router.get('/manage_locations', manage_locations.list_locations);
router.get('/delete_location/:id', manage_locations.delete_location);
router.get('/edit_location/:id', manage_locations.edit_location);
router.post('/edit_location', manage_locations.edit_location);

module.exports = router