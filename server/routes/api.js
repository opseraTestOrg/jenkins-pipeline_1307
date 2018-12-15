var express = require('express');
var router = express.Router();
var ctrlHooks = require('../controllers/hooks.controllers');
var ctrlglHooks = require('../controllers/glhooks.controllers');


router
    .route('/avgit/createHooks')
    .post(ctrlHooks.createHooks)

router
    .route('/avgit/getInit')
    .post(ctrlHooks.getInit)

router
    .route('/avgit/createObject')
    .post(ctrlHooks.createObject)

router
    .route('/avgit/createglHooks')
    .post(ctrlglHooks.createglHooks)

router
    .route('/avgit/getTrigger')
    .post(ctrlglHooks.getTrigger)

module.exports = router;