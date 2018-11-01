const chatHistoryScript = require("../databases/app_data/chatScript.json")
const helper = require('../helpers/helper');

function selectMessageDetailLimit(historyid, limit, offset) {
    return helper.sendQueryToDatabase(
        chatHistoryScript.selectMessageDetailLimit,
        [historyid, offset, limit]
    );
};

function selectIDUserByHistoryID(historyid) {
    return helper.sendQueryToDatabase(
        chatHistoryScript.selectIDUserByHistoryID,
        [historyid]
    );
};

function selectListPeopleChatedByUserWorkerID(UserWorkerID, status) {
    return helper.sendQueryToDatabase(
        chatHistoryScript.selectListPeopleChatedByUserWorkerID,
        [UserWorkerID, status]
    );
};

function selectListPeopleChatedByUserGuestID(UserGuestID, status) {
    return helper.sendQueryToDatabase(
        chatHistoryScript.selectListPeopleChatedByUserGuestID,
        [UserGuestID, status]
    );
};

function selectPointsAndCheck(valueObject) {
    return helper.sendQueryToDatabase(
        chatHistoryScript.selectPointsAndCheck,
        [valueObject.HistoryID]
    );
};

function selectInfoGuestTransactionDone(valueObject, limit, offset) {
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

function selectInfoWorkerTransactionDone(valueObject, limit, offset) {
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

function insertChatHistory(chat, isEnd) {
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

function insertMessageDetail(messageValue) {
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

function updateStatusEndChatHistoryByUserWorkerID(ObjValue) {
    return helper.sendQueryToDatabase(
        chatHistoryScript.updateStatusEndChatHistoryByUserWorkerID,
        [
            ObjValue.StatusEnd,
            ObjValue.HistoryID,
            ObjValue.UserWorkerID
        ]
    );
};

function updateStatusEndChatHistoryByUserGuestID(ObjValue) {
    return helper.sendQueryToDatabase(
        chatHistoryScript.updateStatusEndChatHistoryByUserGuestID,
        [
            ObjValue.StatusEnd,
            ObjValue.HistoryID,
            ObjValue.UserGuestID
        ]
    );
};

function updatePointsAndStatusByGuest(ObjValue) {
    return helper.sendQueryToDatabase(
        chatHistoryScript.updatePointsAndStatusByGuest,
        [
            ObjValue.PointsGuest,
            ObjValue.StatusEnd,
            ObjValue.HistoryID
        ]
    );
};

function updatePointsAndStatusByWorker(ObjValue) {
    return helper.sendQueryToDatabase(
        chatHistoryScript.updatePointsAndStatusByWorker,
        [
            ObjValue.PointsWorker,
            ObjValue.StatusEnd,
            ObjValue.HistoryID
        ]
    );
};

module.exports = {
    selectMessageDetailLimit,
    selectIDUserByHistoryID,
    selectListPeopleChatedByUserWorkerID,
    selectListPeopleChatedByUserGuestID,
    selectPointsAndCheck,
    selectInfoGuestTransactionDone,
    selectInfoWorkerTransactionDone,
    insertChatHistory,
    insertMessageDetail,
    updateStatusEndChatHistoryByUserWorkerID,
    updateStatusEndChatHistoryByUserGuestID,
    updatePointsAndStatusByGuest,
    updatePointsAndStatusByWorker
};