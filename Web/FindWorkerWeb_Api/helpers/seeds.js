function mailOptions(toEmail, fullName, linkVerify) {
    return {
        from: process.env.FW_USERNAMEGMAIL,
        to: toEmail,
        subject: 'Mã xác nhận vào hệ thống hỗ trợ tìm việc',
        html: `<div style="width: 500px;margin: 0 auto;margin-top: 10px;background-color: #f6f6f6;" >
                <div style="background-color: #1ab394;padding: 1px">
                    <center><h1 style="color: #fff">Hệ thống hỗ trợ tìm việc</h1></center>
                </div>
                <div style="background-color: #f6f6f6;padding: 1px">
                    <h3 style="margin: 20px 0 40px 30px;color: #1a9293">Chào mừng ${fullName} đến với hệ thống hỗ trợ tìm việc.</h3>
                    <center><h3 style="margin-left: 30px;color: #1ecacc">Click vào link bên dưới để kích hoạt tài khoản: </h3></center>
                    <center><i><h3><span style="background-color: #f6f6f6;color:#ed5565;padding: 7px;border-radius: 5px;"><a href="${linkVerify}">Click vào đây</a></span></h3></i></center>
                </div>
            </div>`
    };
};

module.exports = { mailOptions };