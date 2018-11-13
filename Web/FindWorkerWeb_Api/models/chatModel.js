const chatHistoryScript = require("../databases/app_data/chatScript.json")
const helper = require('../helpers/helper');
class chatClass {
    selectMessageDetailLimit(historyid, limit, offset) {
        return helper.sendQueryToDatabase(
            chatHistoryScript.selectMessageDetailLimit,
            [historyid, offset, limit]
        );
    };
    selectIDUserByHistoryID(historyid) {
        return helper.sendQueryToDatabase(
            chatHistoryScript.selectIDUserByHistoryID,
            [historyid]
        );
    };
    selectListPeopleChatedByUserWorkerID(UserWorkerID, status) {
        return helper.sendQueryToDatabase(
            chatHistoryScript.selectListPeopleChatedByUserWorkerID,
            [UserWorkerID, status]
        );
    };
    selectListPeopleChatedByUserGuestID(UserGuestID, status) {
        return helper.sendQueryToDatabase(
            chatHistoryScript.selectListPeopleChatedByUserGuestID,
            [UserGuestID, status]
        );
    };
    selectPointsAndCheck(valueObject) {
        return helper.sendQueryToDatabase(
            chatHistoryScript.selectPointsAndCheck,
            [valueObject.HistoryID]
        );
    };
    selectInfoGuestTransactionDone(valueObject, limit, offset) {
        return helper.sendQueryToDatabase(
            chatHistoryScript.selectInfoGuestTransactionDone,
            [
                valueObject.UserAccountID,
                valueObject.StatusEnd,
                offset,
                limit
            ]
        );
    };
    selectInfoWorkerTransactionDone(valueObject, limit, offset) {
        return helper.sendQueryToDatabase(
            chatHistoryScript.selectInfoWorkerTransactionDone,
            [
                valueObject.UserAccountID,
                valueObject.StatusEnd,
                offset,
                limit
            ]
        );
    };
    selectUserChatedMostRecent(stringSQL) {
        return helper.sendQueryToDatabase(
            `${chatHistoryScript.selectUserChatedMostRecent} AND (${stringSQL})`, []
        );
    };
    selectPointsWorkerAndAverage(UserAccountID) {
        return helper.sendQueryToDatabase(
            chatHistoryScript.selectPointsWorkerAndAverage, [UserAccountID]
        );
    };
    selectPointsGuestAndAverage(UserAccountID) {
        return helper.sendQueryToDatabase(
            chatHistoryScript.selectPointsGuestAndAverage, [UserAccountID]
        );
    };
    insertChatHistory(chat, isEnd) {
        return helper.sendQueryToDatabase(
            chatHistoryScript.insertChatHistory,
            [
                chat.UserGuestID,
                chat.UserWorkerID,
                chat.UserGuestID,
                chat.UserWorkerID,
                isEnd
            ]
        );
    };
    insertMessageDetail(messageValue) {
        return helper.sendQueryToDatabase(
            chatHistoryScript.insertMessageDetail,
            [
                messageValue.HistoryID,
                messageValue.TimeComment,
                messageValue.UserID,
                messageValue.MessageDetail
            ]
        );
    };
    updateStatusEndChatHistoryByUserWorkerID(ObjValue) {
        return helper.sendQueryToDatabase(
            chatHistoryScript.updateStatusEndChatHistoryByUserWorkerID,
            [
                ObjValue.StatusEnd,
                ObjValue.HistoryID,
                ObjValue.UserWorkerID
            ]
        );
    };
    updateStatusEndChatHistoryByUserGuestID(ObjValue) {
        return helper.sendQueryToDatabase(
            chatHistoryScript.updateStatusEndChatHistoryByUserGuestID,
            [
                ObjValue.StatusEnd,
                ObjValue.HistoryID,
                ObjValue.UserGuestID
            ]
        );
    };
    updatePointsAndStatusByGuest(ObjValue) {
        return helper.sendQueryToDatabase(
            chatHistoryScript.updatePointsAndStatusByGuest,
            [
                ObjValue.PointsGuest,
                ObjValue.StatusEnd,
                ObjValue.HistoryID
            ]
        );
    };
    updatePointsAndStatusByWorker(ObjValue) {
        return helper.sendQueryToDatabase(
            chatHistoryScript.updatePointsAndStatusByWorker,
            [
                ObjValue.PointsWorker,
                ObjValue.StatusEnd,
                ObjValue.HistoryID
            ]
        );
    };
};

module.exports = new chatClass();