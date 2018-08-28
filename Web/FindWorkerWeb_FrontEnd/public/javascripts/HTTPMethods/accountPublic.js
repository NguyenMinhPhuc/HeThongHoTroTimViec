$(document).ready(function () {
    $("form#fLogin").on("submit", function (event) {
        event.preventDefault();
        let userData = {
            username: $("input#iLoginUsername").val().trim(),
            password: $("input#iLoginPassword").val().trim(),
            grant_type: "password"
        };
        if (!userData.username || !userData.password) {
            return;
        }
        postAjaxJquery(userData, "/login");
        $("input#iLoginUsername").val("");
        $("input#iLoginPassword").val("");
    });
    $("form#fSignup").on("submit", function (event) {
        event.preventDefault();
        $("#alert .msg").text("");
        if ($("input#iSignupPassword").val() != $("input#iSignupPassword2").val()) {
            $("#alert .msg").text("Mật khẩu phải giống nhau");
            $("#alert").fadeIn(700);
            return;
        }
        let userSignup = {
            username: $("input#iSignupUsername").val().trim(),
            password: $("input#iSignupPassword").val().trim(),
            email: $("input#iSignupEmail").val().trim(),
            fullname: $("input#iSignupFullname").val().trim()
        };
        if (!userSignup.username || !userSignup.password || !userSignup.email || !userSignup.fullname) {
            return;
        }
        postAjaxJquery(userSignup, "/signup");
        $("input#iSignupUsername").val("");
        $("input#iSignupPassword").val("");
        $("input#iSignupEmail").val("");
        $("input#iSignupFullname").val("");
        $("input#iSignupPassword2").val("");
    });
    //function
    function postAjaxJquery(valueObject, namePath) {
        $.ajax({
            type: 'POST',
            url: namePath,
            data: valueObject
        }).done(function (data) {
            window.location.href = data;
        }).fail(function (err) {
            $("#alert .msg").text(err.responseJSON);
            $("#alert").fadeIn(700);
        });
    };
});