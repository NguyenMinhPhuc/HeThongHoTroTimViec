var express = require('express');
var router = express.Router();

//http method GET
router.get('/', (req, res, next) => {
    if (req.session.account) {
        if (req.session.account.UserTypeID == 1) {
            res.render('./adminViews/index.ejs', {
                tittle: "Trang chủ Admin | Hệ thống hỗ trợ tìm việc",
                userAccount: req.session.account,
                slideBarSTT: 1
            });
        } else if (req.session.account.UserTypeID == 2) {
            res.redirect('/');
        } else { res.redirect('/login'); }
    } else { res.redirect('/login'); }
});

module.exports = router;