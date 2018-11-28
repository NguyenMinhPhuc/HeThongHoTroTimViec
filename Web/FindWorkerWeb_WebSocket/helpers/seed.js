var localhost = "https://findworkerapi.ga";
var localhostIP = "http://18.217.245.123";
var service = {
    "ACCOUNT": {
        "PUT_STATUS_ONLINE": localhost + "/api/account/put-status-online"
    },
    "CHAT": {
        "NEW_MESSAGE": localhost + "/api/chat/post-new-message"
    }
};

module.exports = service;