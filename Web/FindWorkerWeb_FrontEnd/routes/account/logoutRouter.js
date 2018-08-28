var express = require('express');
var router = express.Router();

//http method GET
router.get('/', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;