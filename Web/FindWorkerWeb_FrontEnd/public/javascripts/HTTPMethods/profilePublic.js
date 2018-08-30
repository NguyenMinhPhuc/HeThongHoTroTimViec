$(document).ready(function () {
    $("form#fProfileUpdate").on("submit", function (event) {
        event.preventDefault();
        let profileData = {
            Fullname: $("input#iPEditFullname").val().trim(),
            IsMale: $("input#iPEditIsMale").val().trim(),
            Birthday: $("input#iPEditBirthday").val().trim(),
            Place: $("input#iPEditPlace").val().trim(),
            PhoneNumber: $("input#iPEditPhoneNumber").val().trim(),
            PersonID: $("input#iPEditPersonID").val().trim(),
            Image: "https://png.icons8.com/bubbles/500/000000/gender-neutral-user.png"
        };
        if (!profileData.Fullname || !profileData.IsMale || !profileData.Birthday || !profileData.Place || !profileData.PhoneNumber || !profileData.PersonID || !profileData.Image) {
            $("#alert .msg").text("Yêu cầu không để trống");
            $("#alert").fadeIn(700);
            return;
        }
        PUTProfileUpdate(profileData);
    });
    $('#data_1 .input-group.date').datepicker({
        format: 'dd/mm/yyyy',
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true
    });
    $('#btnCancelUpdateProfile').click(() => {
        parent.history.back();
        return false;
    });
    //function
    function PUTProfileUpdate(profileData) {
        $.ajax({
            type: 'PUT',
            url: window.location.pathname,
            data: profileData
        })
            .done(() => {
                if ('referrer' in document) { location.replace(document.referrer); }
                else { window.history.back(); }
            })
            .fail((err) => {
                $("#alert .msg").text(err.responseJSON);
                $("#alert").fadeIn(700);
            });
    };
});