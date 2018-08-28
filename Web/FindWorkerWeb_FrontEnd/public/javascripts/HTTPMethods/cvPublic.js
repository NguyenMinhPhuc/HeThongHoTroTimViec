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
        "timeOut": "7000",
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
        max: 20,
        step: 0.1,
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
        let categoryid = $(this).attr("categoryid");
        let userworkerid = $(this).attr("userworkerid");
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
            let cvData = {
                categoryid: categoryid,
                userworkerid: userworkerid
            };
            deleteCV(cvData, "/cv/worker-category-not-activated");
        });
        // console.log($(this).attr("categoryid"));
    });
    //event when click button submit in list worker not activated
    $('.btnAgreeCV').on("click", function () {
        del = $(this).parent().parent().parent().parent();//select td
        let categoryid = $(this).attr("categoryid");
        let userworkerid = $(this).attr("userworkerid");
        let cvData = {
            categoryid: categoryid,
            userworkerid: userworkerid
        };
        putCV(cvData, "/cv/worker-category-not-activated");
        // console.log($(this).attr("categoryid"));
    });
    //event click submit in form
    $("form#fCVPost").on("submit", function (event) {
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
        postCV(categoryData, "/cv/post");
    });

    //function of category
    function postCV(categoryData, namePath) {
        $.ajax({
            type: 'POST',
            url: namePath,
            data: categoryData
        }).done(function () {
            swal({
                title: "Hoàn thành!",
                text: "Bạn đã đăng hồ sơ thành công!",
                type: "success"
            });
            $("#spCVCategory").val("");
            $("input#ipCVExprience").val(0.5);
            $("input#ipCVQualifications").val("");
            $("#ipCVGeneralinformation").val("");
            $("#alert").fadeOut(700);
        }).fail(function (err) {
            let strErr;
            if (err.responseJSON) {
                strErr = err.responseJSON;
            } else {
                strErr = err.responseJSON.error["0"].msg;
            }
            $("#alert .msg").text(strErr);
            $("#alert").fadeIn(700);
        });
    };
    //function DELETE
    function deleteCV(categoryData, namePath) {
        $.ajax({
            type: 'DELETE',
            url: namePath,
            data: categoryData
        }).done(function () {
            del.remove();
            swal("Đã xóa!", "Hồ sơ này đã bị xóa.", "success");
        }).fail(function (err) {
            let strErr;
            if (err.responseJSON) {
                strErr = err.responseJSON;
            } else {
                strErr = err.responseJSON.error["0"].msg;
            }
            toastr["error"](strErr, "Lỗi");
            // $("#alert .msg").text(strErr);
            // $("#alert").fadeIn(700);
        });
    };
    //function PUT
    function putCV(categoryData, namePath) {
        $.ajax({
            type: 'PUT',
            url: namePath,
            data: categoryData
        }).done(function () {
            del.remove();
            toastr["success"]("Đã thêm hồ sơ thành công.", "Thành công");
        }).fail(function (err) {
            let strErr;
            if (err.responseJSON) {
                strErr = err.responseJSON;
            } else {
                strErr = err.responseJSON.error["0"].msg;
            }
            toastr["error"](strErr, "Lỗi");
            // $("#alert .msg").text(strErr);
            // $("#alert").fadeIn(700);
        });
    };
});