$(document).ready(function () {
    var valueSelectedspCVCategory, textSelectedspCVCategory, del;
    //Option Show toastr when have error or success
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "progressBar": true,
        "preventDuplicates": true,
        "positionClass": "toast-bottom-right",
        "onclick": null,
        "showDuration": "400",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    //event change select option
    $('#spCVCategory').on("change", function () {
        var optionSelected = $(this).find("option:selected");
        valueSelectedspCVCategory = optionSelected.val().trim();
        textSelectedspCVCategory = optionSelected.text().trim();
    });
    //event click button TouchSpin
    $("#ipCVExprience").TouchSpin({
        min: 0,
        max: 70,
        step: 0.5,
        decimals: 1,
        boostat: 5,
        maxboostedstep: 10,
        buttondown_class: 'btn btn-white',
        buttonup_class: 'btn btn-white'
    });
    //event click button to back
    $('#btnCancelPostCV').on(("click"), () => {
        parent.history.back();
        return false;
    });
    //event when click button delete in list worker not activated
    $('.btnDeleteCV').on("click", function () {
        del = $(this).parent().parent().parent().parent();//select td
        let cvData = {
            categoryid: $(this).attr("categoryid"),
            userworkerid: $(this).attr("userworkerid")
        };
        if (!cvData.categoryid || !cvData.userworkerid) {
            return;
        }
        // let categoryid = $(this).attr("categoryid");
        // let userworkerid = $(this).attr("userworkerid");
        swal({
            title: "Bạn có muốn xóa hồ sơ này?",
            text: "Nếu xóa hồ sơ này sẽ không khôi phục lại được!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Xóa!",
            cancelButtonText: "Hủy",
            closeOnConfirm: false
        }, function () {
            try {
                // let cvData = {
                //     categoryid: categoryid,
                //     userworkerid: userworkerid
                // };
                ajaxDeleteHttpMethod(cvData, "/admin/cv/danh-sach-tho-doi-duyet");
                del.remove();
                swal("Đã xóa!", "Hồ sơ đã được xóa.", "success");
            } catch (err) {
                let strErr;
                if (err.responseJSON) { strErr = err.responseJSON; }
                else { strErr = err.responseJSON.error["0"].msg; }
                toastr["error"](strErr, "Lỗi");
            }
            // deleteCV(cvData, "/admin/cv/danh-sach-tho-doi-duyet");
        });
    });
    //event when click button submit in list worker not activated
    $('.btnAgreeCV').on("click", function () {
        del = $(this).parent().parent().parent().parent();//select td
        // let categoryid = $(this).attr("categoryid");
        // let userworkerid = $(this).attr("userworkerid");
        let cvData = {
            categoryid: $(this).attr("categoryid"),
            userworkerid: $(this).attr("userworkerid")
        };
        if (!cvData.categoryid || !cvData.userworkerid) {
            return;
        }
        try {
            ajaxPutHttpMethod(cvData, '/admin/cv/danh-sach-tho-doi-duyet');
            del.remove();
            toastr["success"]("Đã chấp nhận hồ sơ thành công.", "Thành công");
        }catch(err){
            let strErr;
            if (err.responseJSON) { strErr = err.responseJSON; }
            else { strErr = err.responseJSON.error["0"].msg; }
            toastr["error"](strErr, "Lỗi");
        }
        // putCV(cvData, "/admin/cv/danh-sach-tho-doi-duyet");
    });
    //event when click button submit in list worker not activated
    $('.btnDeleteCVByWorker').on("click", async function () {
        del = $(this).parent().parent().parent().parent();//select td
        let cvData = {
            categoryid: $(this).attr("categoryid")
        };
        console.log($(this).attr("categoryid"));
        if (!cvData.categoryid) {
            return;
        }
        swal({
            title: "Bạn có muốn xóa hồ sơ này?",
            text: "Nếu xóa hồ sơ này sẽ không khôi phục lại được!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Xóa!",
            cancelButtonText: "Hủy",
            closeOnConfirm: false
        }, function () {
            try {
                ajaxDeleteHttpMethod(cvData, '/cv/danh-sach-ho-so-doi-duyet');
                del.remove();
                swal("Đã xóa!", "Hồ sơ đã được xóa.", "success");
            } catch (err) {
                let strErr;
                if (err.responseJSON) { strErr = err.responseJSON; }
                else { strErr = err.responseJSON.error["0"].msg; }
                toastr["error"](strErr, "Lỗi");
            }
        });
    });
    //event when click button edit in list waiting activated
    $('.btnEditCV').on("click", function () {
        del = $(this).parent().parent().parent().parent();//select td
        $("#imgStore").attr("src", del["0"].cells[1].childNodes["0"].currentSrc);
        $("#tNameJobCategory").text(del["0"].cells[2].innerText);
        $("#ipCVExprience").val(del["0"].cells[3].innerText);
        $("#ipCVQualifications").val(del["0"].cells[4].innerText);
        $("#ipCVGeneralinformation").val(del["0"].cells[5].innerText);
        $("#tDateCreateCV").text(`Ngày đăng: ${del["0"].cells[6].innerText}`);
        $("#btnSubmitCVUpdate").attr("categoryid", $(this).attr("categoryid"));
    });
    //event click submit in form edit cv
    $('#btnSubmitCVUpdate').on("click", async function (event) {
        try {
            event.preventDefault();
            let cvData = {
                categoryid: $(this).attr("categoryid").trim(),
                exprience: $("input#ipCVExprience").val().trim(),
                qualifications: $("input#ipCVQualifications").val().trim(),
                generalinformation: $("#ipCVGeneralinformation").val().trim(),
                imagestore: "https://png.icons8.com/color/300/000000/small-business.png"
            };
            if (!cvData.categoryid || !cvData.exprience || !cvData.qualifications || !cvData.generalinformation || !cvData.imagestore) {
                return;
            }
            let result = await ajaxPutHttpMethod(cvData, "/cv/danh-sach-ho-so-doi-duyet");
            toastr["success"](result, "Thành công");
            $('.modal').modal('toggle');
            del["0"].children[3].innerText = cvData.exprience;
            del["0"].children[4].innerText = cvData.qualifications;
            del["0"].children[5].innerText = cvData.generalinformation;
            del["0"].cells[1].childNodes["0"].currentSrc = cvData.imagestore;
        } catch (err) {
            console.log(err);
            let strErr;
            if (err.responseJSON) { strErr = err.responseJSON; }
            else { strErr = err.responseJSON.error["0"].msg; }
            $("#alert .msg").text(strErr);
            $("#alert").fadeIn(700);
        }
    });
    //event click submit in form
    $("form#fCVPost").on("submit", async function (event) {
        try {
            event.preventDefault();
            if (!valueSelectedspCVCategory && !textSelectedspCVCategory) {
                $("#alert .msg").text("Bạn phải chọn danh mục ngành nghề");
                $("#alert").fadeIn(700);
                return;
            }
            let categoryData = {
                categoryid: valueSelectedspCVCategory,
                namejobcategory: textSelectedspCVCategory,
                exprience: $("input#ipCVExprience").val().trim(),
                qualifications: $("input#ipCVQualifications").val().trim(),
                generalinformation: $("#ipCVGeneralinformation").val().trim(),
                imagestore: "https://png.icons8.com/color/300/000000/small-business.png"
            };
            if (!categoryData.exprience || !categoryData.qualifications || !categoryData.generalinformation || !categoryData.imagestore) {
                return;
            }
            await ajaxPostHttpMethod(categoryData, "/cv/dang-ho-so");
            toastr["success"]("Đã đăng hồ sơ thành công.", "Thành công");
            $("#spCVCategory").val("");
            $("input#ipCVExprience").val(0.5);
            $("input#ipCVQualifications").val("");
            $("#ipCVGeneralinformation").val("");
            $("#alert").fadeOut(700);
        } catch (err) {
            let strErr;
            if (err.responseJSON) { strErr = err.responseJSON; }
            else { strErr = err.responseJSON.error["0"].msg; }
            $("#alert .msg").text(strErr);
            $("#alert").fadeIn(700);
        }
    });
    //function DELETE
    // function deleteCV(categoryData, namePath) {
    //     $.ajax({
    //         type: 'DELETE',
    //         url: namePath,
    //         data: categoryData
    //     }).done(function () {
    //         del.remove();
    //         swal("Đã xóa!", "Hồ sơ đã được xóa.", "success");
    //     }).fail(function (err) {
    //         let strErr;
    //         if (err.responseJSON) { strErr = err.responseJSON; }
    //         else { strErr = err.responseJSON.error["0"].msg; }
    //         toastr["error"](strErr, "Lỗi");
    //     });
    // };
    //function PUT
    // function putCV(categoryData, namePath) {
    //     $.ajax({
    //         type: 'PUT',
    //         url: namePath,
    //         data: categoryData
    //     }).done(function () {
    //         del.remove();
    //         toastr["success"]("Đã chấp nhận hồ sơ thành công.", "Thành công");
    //     }).fail(function (err) {
    //         let strErr;
    //         if (err.responseJSON) { strErr = err.responseJSON; }
    //         else { strErr = err.responseJSON.error["0"].msg; }
    //         toastr["error"](strErr, "Lỗi");
    //     });
    // };
});