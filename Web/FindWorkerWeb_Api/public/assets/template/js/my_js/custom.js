$(document).ready(function () {
    $('#data_1 .input-group.date').datepicker({
        language: 'vi',
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true,
        format: 'dd/mm/yyyy'
    });
    $('#cbchsabjchbasjc').on('click', function () {
        alert("ascas");
    });
});