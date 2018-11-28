const io = require("socket.io");

const callApi = require('../helpers/callApi');
const seed = require('../helpers/seed');

module.exports = function (http) {
    io(http).on("connection", (socket) => {
        var token = "";
        var UserAccountID = "";
        var ArrayRoom = [];
        let objectValue = { StatusOnline: 1 };

        // console.log("Co nguoi ket noi server: " + socket.id);
        //EMIT

        //ON
        //Listen access token from client
        socket.on('authorization', function (result) {
            token = result.access_token;
            UserAccountID = result.UserAccountID;
            callApi.PUT(seed.ACCOUNT.PUT_STATUS_ONLINE, objectValue, token);
        });
        socket.on('disconnect', function () {
            //Destroy SocketID
            objectValue.StatusOnline = 0;
            callApi.PUT(seed.ACCOUNT.PUT_STATUS_ONLINE, objectValue, token);//cập nhật trên dtb
            ArrayRoom.map(function (value) {
                //Gởi trạng thái offline
                socket.broadcast.to(value + "").emit('is_offline', UserAccountID);
            });
        });
        //Send new message in room
        socket.on('send_message', function (result) {
            socket.broadcast.to(result.HistoryID + "").emit('get_message', result);
            callApi.POST(seed.CHAT.NEW_MESSAGE, result, token);
        });
        //Nhận list room và join
        socket.on('array_room', function (result) {
            result.map(function (value) {
                socket.join(value + "");//join phòng
                ArrayRoom.push(value + "");
                //Gởi trạng thái online
                socket.broadcast.to(value + "").emit('is_online', UserAccountID);
            });
        });
        //Rời phòng
        socket.on('leave_room', function (result) {
            let times = new Date();
            let objectValue = {
                HistoryID: result,
                MessageDetail: "Đã hủy giao dịch",
                TimeComment: times.getTime()
            };
            //
            socket.leave(result.HistoryID + "");
            socket.broadcast.to(result.HistoryID + "").emit('get_message', objectValue);
            callApi.POST(seed.CHAT.NEW_MESSAGE, objectValue, token);
        });
        socket.on('points_rate', function (result) {
            let times = new Date();
            let objectValue = {
                HistoryID: result.HistoryID,
                MessageDetail: `Đã đánh giá ${result.Points} điểm. Hãy đánh giá lại để kết thúc giao dịch này`,
                TimeComment: times.getTime()
            };
            //
            socket.to(result.HistoryID + "").emit('get_message', objectValue);
            callApi.POST(seed.CHAT.NEW_MESSAGE, objectValue, token);
        });
    });
};