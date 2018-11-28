const express = require('express');
const router = express.Router();

const accountModel = require('../models/accountModel');
const chatHistoryModel = require('../models/chatModel');
const helper = require('../helpers/helper');
const linkServer = require('../configs/config.json');

//Cập nhật socketID khi Websocket gởi lên
router.put('/update-socketid', async function (req, res) {
    let objectValue = req.body;
    try {
        let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
        if (resultOfJWT.UserTypeID > 0 && resultOfJWT.UserTypeID < 4) {
            objectValue.UserAccountID = resultOfJWT.UserAccountID;
            let resultUpdated = await accountModel.putSocketID(objectValue);
            if (resultUpdated.affectedRows > 0) {
                return res.status(200).json(helper.jsonSuccessTrue("Đã cập nhật ID Socket."));
            } else {
                return res.status(400).json(helper.jsonErrorDescription("Không tìm thấy tài khoản."));
            }
        } else {
            return res.status(400).json(helper.jsonErrorDescription("Tài khoản không có quyền vào đây."));
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn."));
    }
});

//Tạo mới một giao dịch hoặc một tin nhắn
router.post('/create-chat-history', async function (req, res) {
    req.checkBody('ToUserID', 'Sai định dạng tài khoản id').isInt();
    if (req.validationErrors()) { return res.status(400).json(helper.jsonError(req.validationErrors())); }
    else {
        try {
            let objectValue = {};
            let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
            if (resultOfJWT.UserAccountID != req.body.ToUserID) {
                if (resultOfJWT.UserTypeID == 2) {
                    objectValue.UserGuestID = req.body.ToUserID;
                    objectValue.UserWorkerID = resultOfJWT.UserAccountID + "";
                } else if (resultOfJWT.UserTypeID == 3) {
                    objectValue.UserWorkerID = req.body.ToUserID;
                    objectValue.UserGuestID = resultOfJWT.UserAccountID + "";
                } else {
                    return res.status(400).json(helper.jsonErrorDescription("Bạn không có quyền tạo phòng chat."));
                }
                let resultOfIsHistory = await chatHistoryModel.insertChatHistory(objectValue, 0);
                if (resultOfIsHistory.affectedRows > 0) {
                    return res.status(200).json(helper.jsonSuccessTrue("Đã tạo phòng thành công."));
                } else {
                    return res.status(200).json(helper.jsonSuccessFalse("Không thể tạo phòng chat."));
                }
            } else {
                return res.status(400).json(helper.jsonErrorDescription("Không thể tạo phòng chat cho chính bản thân."));
            }
        } catch (err) {
            console.log(err.message);
            return res.status(500).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn."));
        }
    }
});

router.post('/post-new-message', async function (req, res) {
    req.checkBody('HistoryID', 'Sai định dạng HistoryID.').isInt({ min: 10000 });
    req.checkBody('TimeComment', 'Sai định dạng thời gian.').isInt();
    req.checkBody('MessageDetail', 'Tin nhắn không được để trống.').trim().notEmpty();
    if (req.validationErrors()) { return res.status(400).json(helper.jsonError(req.validationErrors())); }
    else {
        try {
            let objectValue = req.body;
            let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
            objectValue.UserID = resultOfJWT.UserAccountID;
            let resultIsMessage = await chatHistoryModel.insertMessageDetail(objectValue);
            if (resultIsMessage.affectedRows > 0) {
                return res.status(200).json(helper.jsonSuccessTrue("Đã gởi tin nhắn."));
            } else {
                return res.status(400).json(helper.jsonErrorDescription("Gởi tin nhắn không thành công."));
            }
        } catch (err) {
            console.log(err.message);
            return res.status(500).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn."));
        }
    }
});

router.get('/get-message-chated', async function (req, res) {
    try {
        let historyid = req.query.historyid;
        let limit = Number(req.query.limit);
        let page = Number(req.query.page);
        if (!!historyid && !!limit && !!page && Number.isInteger(limit) && Number.isInteger(page) && page > 0 && limit > 0) {
            let offset = helper.getOffset(page, limit);
            let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
            let resultSelUserID = await chatHistoryModel.selectIDUserByHistoryID(historyid);
            if (resultSelUserID[0].UserGuestID == resultOfJWT.UserAccountID || resultSelUserID[0].UserWorkerID == resultOfJWT.UserAccountID) {
                let resultSelMess = await chatHistoryModel.selectMessageDetailLimit(historyid, limit, offset);
                if (resultSelMess.length > 0) {
                    //Sắp xếp theo thời gian comment
                    let resultNew = resultSelMess.sort(function (a, b) {
                        return a.TimeComment - b.TimeComment;
                    });
                    return res.status(200).json(helper.jsonSuccessTrueResult(resultNew));
                }
                else { return res.status(200).json(helper.jsonSuccessFalse("Không có nội dung.")); }
            } else {
                return res.status(400).json(helper.jsonErrorDescription("Không thể lấy vì bạn không trong phòng chat này."));
            }
        } else { return res.status(400).json(helper.jsonErrorDescription("Sai định dạng.")); }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn."));
    }
});

router.get('/get-list-people-chated', async function (req, res) {
    try {
        let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
        if (resultOfJWT.UserTypeID == 2) {
            let resultOfList = await chatHistoryModel.selectListPeopleChatedByUserWorkerID(resultOfJWT.UserAccountID, 0);
            if (resultOfList.length > 0) {
                let stringSQL = "";
                for (let i = 0; i < resultOfList.length; i++) {
                    stringSQL += ` HistoryID = ${resultOfList[i].HistoryID} OR`;
                };
                stringSQL = stringSQL.slice(0, stringSQL.length - 2);//cắt chữ OR cuối cùng
                let resultOfListMostRecentChat = await chatHistoryModel.selectUserChatedMostRecent(stringSQL);
                for (let i = 0; i < resultOfList.length; i++) {//vòng lặp kết quả resultOfListMostRecentChat
                    resultOfList[i].Image = `${linkServer.hethonghotrotimviec.urlServer}${resultOfList[i].Image}`;
                    if (resultOfListMostRecentChat.length < 1) {
                        resultOfList[i].UserIDChatedMostRecent = 0;
                    } else {
                        for (let n = 0; n < resultOfListMostRecentChat.length; n++) {//vòng lặp để kiểm tra và gán UserIDChatedMostRecent vào đúng USER ID
                            if (resultOfList[i].HistoryID == resultOfListMostRecentChat[n].HistoryID) {
                                resultOfList[i].UserIDChatedMostRecent = resultOfListMostRecentChat[n].UserIDChatedMostRecent;
                                break;
                            }
                        }
                    }
                }
                return res.status(200).json(helper.jsonSuccessTrueResult(resultOfList));
            } else {
                return res.status(200).json(helper.jsonSuccessFalse("Danh sách trống!!!"));
            }
        } else if (resultOfJWT.UserTypeID == 3) {
            let resultOfList = await chatHistoryModel.selectListPeopleChatedByUserGuestID(resultOfJWT.UserAccountID, 0);
            if (resultOfList.length > 0) {
                let stringSQL = "";
                for (let i = 0; i < resultOfList.length; i++) {
                    stringSQL += ` HistoryID = ${resultOfList[i].HistoryID} OR`;
                }
                stringSQL = stringSQL.slice(0, stringSQL.length - 2);//cắt chữ OR cuối cùng
                let resultOfListMostRecentChat = await chatHistoryModel.selectUserChatedMostRecent(stringSQL);
                for (let i = 0; i < resultOfList.length; i++) {//vòng lặp kết quả resultOfListMostRecentChat
                    resultOfList[i].Image = `${linkServer.hethonghotrotimviec.urlServer}${resultOfList[i].Image}`;
                    if (resultOfListMostRecentChat.length < 1) {
                        resultOfList[i].UserIDChatedMostRecent = 0;
                    } else {
                        for (let n = 0; n < resultOfListMostRecentChat.length; n++) {//vòng lặp để kiểm tra và gán UserIDChatedMostRecent vào đúng USER ID
                            if (resultOfList[i].HistoryID == resultOfListMostRecentChat[n].HistoryID) {
                                resultOfList[i].UserIDChatedMostRecent = resultOfListMostRecentChat[n].UserIDChatedMostRecent;
                                break;
                            }
                        }
                    }
                }
                return res.status(200).json(helper.jsonSuccessTrueResult(resultOfList));
            } else {
                return res.status(200).json(helper.jsonSuccessFalse("Danh sách trống!!!"));
            }
        } else {
            return res.status(400).json(helper.jsonErrorDescription("Không có quyền lấy danh sách phòng chat."));
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn."));
    }
});

router.put('/put-cancel-transaction', async function (req, res) {
    req.checkBody('HistoryID', 'Sai định dạng HistoryID.').isInt({ min: 10000 });
    if (req.validationErrors()) { return res.status(400).json(helper.jsonError(req.validationErrors())); }
    else {
        try {
            let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
            let valueObject = req.body;
            valueObject.StatusEnd = -1;
            if (resultOfJWT.UserTypeID == 2) {
                valueObject.UserWorkerID = resultOfJWT.UserAccountID;
                let resultOfUpdateStatus = await chatHistoryModel.updateStatusEndChatHistoryByUserWorkerID(valueObject);
                if (resultOfUpdateStatus.affectedRows > 0) {
                    return res.status(200).json(helper.jsonSuccessTrue("Đã hủy giao dịch."));
                } else {
                    return res.status(400).json(helper.jsonErrorDescription("Cập nhật thông tin giao dịch không thành công."));
                }
            } if (resultOfJWT.UserTypeID == 3) {
                valueObject.UserGuestID = resultOfJWT.UserAccountID;
                let resultOfUpdateStatus = await chatHistoryModel.updateStatusEndChatHistoryByUserGuestID(valueObject);
                if (resultOfUpdateStatus.affectedRows > 0) {
                    return res.status(200).json(helper.jsonSuccessTrue("Đã hủy giao dịch."));
                } else {
                    return res.status(400).json(helper.jsonErrorDescription("Cập nhật thông tin giao dịch không thành công."));
                }
            } else {
                return res.status(400).json(helper.jsonErrorDescription("Không có quyền cập nhật thông tin giao dịch."));
            }
        } catch (err) {
            console.log(err.message);
            return res.status(500).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn."));
        }
    }
});

router.put('/put-done-transaction', async function (req, res) {
    req.checkBody('HistoryID', 'Sai định dạng mã History.').isInt();
    req.checkBody('Points', 'Điểm đánh giá phải từ 1 đến 5.').isInt({ min: 1, max: 5 });
    if (req.validationErrors()) { return res.status(400).json(helper.jsonError(req.validationErrors())); }
    else {
        try {
            let resultOfJWT = await helper.jwtVerifyLogin(req.header("authorization"));
            let valueObject = req.body;
            //
            let resultOfSelectPoint = await chatHistoryModel.selectPointsAndCheck(valueObject);
            if (resultOfSelectPoint.length > 0 && resultOfSelectPoint[0].StatusEnd == 0) {
                //Lấy dữ liệu trong DTB và kiếm tra nhằm mục đích cập nhật điểm và trạng thái cho đúng
                valueObject.StatusEnd = 0;
                if (resultOfSelectPoint[0].PointsGuest >= 0 || resultOfSelectPoint[0].PointsWorker >= 0) {
                    valueObject.StatusEnd = 1;
                }
                //Tránh Bug khi một user đánh giá 2 lần
                if (resultOfJWT.UserTypeID == 2 && resultOfSelectPoint[0].PointsWorker == -1 && resultOfJWT.UserAccountID == resultOfSelectPoint[0].UserWorkerID) {
                    valueObject.PointsWorker = valueObject.Points;
                    let resultOfUpdatePoints = await chatHistoryModel.updatePointsAndStatusByWorker(valueObject);//cập nhật điểm và trạng thái
                    if (resultOfUpdatePoints.affectedRows > 0) {
                        res.status(200).json(helper.jsonSuccessTrue("Đã đánh giá thành công."));
                        if (valueObject.StatusEnd == 1) {
                            let resultOfSelectPointArray = await Promise.all([//Tính và lấy điểm trung bình tổng người đánh giá ra
                                chatHistoryModel.selectPointsWorkerAndAverage(resultOfSelectPoint[0].UserWorkerID),
                                chatHistoryModel.selectPointsGuestAndAverage(resultOfSelectPoint[0].UserGuestID)
                            ]);
                            await Promise.all([//Cập nhật điểm trung bình vào bảng user
                                accountModel.updatePointAndCount(resultOfSelectPointArray[0][0], resultOfSelectPoint[0].UserWorkerID),
                                accountModel.updatePointAndCount(resultOfSelectPointArray[1][0], resultOfSelectPoint[0].UserGuestID)
                            ]);
                        }
                        return;
                    } else {
                        return res.status(400).json(helper.jsonErrorDescription("Cập nhật điểm đánh giá không thành công."));
                    }
                } else if (resultOfJWT.UserTypeID == 3 && resultOfSelectPoint[0].PointsGuest == -1 && resultOfJWT.UserAccountID == resultOfSelectPoint[0].UserGuestID) {
                    valueObject.PointsGuest = valueObject.Points;
                    let resultOfUpdatePoints = await chatHistoryModel.updatePointsAndStatusByGuest(valueObject);
                    if (resultOfUpdatePoints.affectedRows > 0) {
                        res.status(200).json(helper.jsonSuccessTrue("Đã đánh giá thành công."));
                        if (valueObject.StatusEnd == 1) {
                            let resultOfSelectPointArray = await Promise.all([
                                chatHistoryModel.selectPointsWorkerAndAverage(resultOfSelectPoint[0].UserWorkerID),
                                chatHistoryModel.selectPointsGuestAndAverage(resultOfSelectPoint[0].UserGuestID)
                            ]);
                            await Promise.all([
                                accountModel.updatePointAndCount(resultOfSelectPointArray[0], resultOfSelectPoint[0].UserWorkerID),
                                accountModel.updatePointAndCount(resultOfSelectPointArray[1], resultOfSelectPoint[0].UserGuestID)
                            ]);
                        }
                        return;
                    } else {
                        return res.status(400).json(helper.jsonErrorDescription("Cập nhật điểm đánh giá không thành công."));
                    }
                } else {
                    return res.status(400).json(helper.jsonErrorDescription("Không có quyền đánh giá."));
                }
            } else {
                return res.status(400).json(helper.jsonErrorDescription("Không tìm thấy mã History hoặc mã này đã được đánh giá hoàn tất."));
            }
        } catch (err) {
            console.log(err.message);
            return res.status(500).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn."));
        }
    }
});

router.get('/get-info-transaction-done-by-userid', async function (req, res) {
    try {
        let UserAccountID = req.query.useraccountid;
        let limit = Number(req.query.limit);
        let page = Number(req.query.page);
        //Kiểm tra null, undefined, Kiểu int và >0
        if (!!UserAccountID && !!limit && !!page && Number.isInteger(limit) && Number.isInteger(page) && page > 0 && limit > 0) {
            let offset = helper.getOffset(page, limit);//Hàm trả về offset
            await helper.jwtVerifyLogin(req.header("authorization"));
            let valueObject = {
                UserAccountID,
                StatusEnd: 1
            };
            let resultInfoAccount = await accountModel.selectInfoAccountChat(valueObject.UserAccountID);//select UserTypeID từ Account
            if (resultInfoAccount[0].UserTypeID == 2) {
                let resultSelectPeopleTransaceted = await chatHistoryModel.selectInfoWorkerTransactionDone(valueObject, limit, offset);
                if (resultSelectPeopleTransaceted.length > 0) {
                    for (let i = 0; i < resultSelectPeopleTransaceted.length; i++) {
                        resultSelectPeopleTransaceted[i].Image = `${linkServer.hethonghotrotimviec.urlServer}${resultSelectPeopleTransaceted[i].Image}`
                    }
                    return res.status(200).json(helper.jsonSuccessTrueResult(resultSelectPeopleTransaceted));
                } else {
                    return res.status(200).json(helper.jsonSuccessFalse("Không có dữ liệu."));
                }
            } else if (resultInfoAccount[0].UserTypeID == 3) {
                let resultSelectPeopleTransaceted = await chatHistoryModel.selectInfoGuestTransactionDone(valueObject, limit, offset);
                if (resultSelectPeopleTransaceted.length > 0) {
                    for (let i = 0; i < resultSelectPeopleTransaceted.length; i++) {
                        resultSelectPeopleTransaceted[i].Image = `${linkServer.hethonghotrotimviec.urlServer}${resultSelectPeopleTransaceted[i].Image}`
                    }
                    return res.status(200).json(helper.jsonSuccessTrueResult(resultSelectPeopleTransaceted));
                } else {
                    return res.status(200).json(helper.jsonSuccessFalse("Không có dữ liệu."));
                }
            } else {
                return res.status(200).json(helper.jsonSuccessFalse("Không có quyền lấy thông tin giao dịch tài khoản này."));
            }
        } else {
            return res.status(400).json(helper.jsonErrorDescription("Sai định dạng."));
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(helper.jsonErrorDescription("Token không tồn tại hoặc đã hết hạn."));
    }
});

module.exports = router;