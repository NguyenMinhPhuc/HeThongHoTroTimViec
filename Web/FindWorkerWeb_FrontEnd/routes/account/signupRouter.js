var express = require('express');
var router = express.Router();

var axiosModel = require('../../models/axiosModel');

//http method GET
router.get('/', (req, res) => {
    if (req.session.token) res.redirect('/');
    res.render('./account/signupView');
});

//http method POST
router.post('/', async (req, res) => {
    try {
        let accountSignup = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            fullname: req.body.fullname
        };
        let resultpAS = await axiosModel.postAxiosSignup(accountSignup, "/api/account/signup_for_worker");
        if (resultpAS.data.success) return res.status(200).json("/login");
    } catch (error) {
        if (error.response.data.error[0].msg) {
            res.status(400).json(error.response.data.error[0].msg);
        } else if (error.response.data.error == 'invalid_grant') {
            res.status(400).json(error.response.data.error_description);
        } else {
            console.log(error.message);
            res.status(500).json(error);
        }
    }
});

module.exports = router;
