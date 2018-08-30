var express = require('express');
var router = express.Router();

//http method GET
router.get('/', (req, res, next) => {
    if (req.session.token) {
        if (req.session.account.UserTypeID == 2) {
            res.render('./workerViews/index', {
                tittle: "Trang chủ | Hệ thống hỗ trợ tìm việc",
                userAccount: req.session.account,
                slideBarSTT: 1
            });
        } else if (req.session.account.UserTypeID == 1) {
            res.redirect('/admin');
        } else { res.redirect('/logout'); }
    } else { res.redirect('/logout'); }
});

module.exports = router;