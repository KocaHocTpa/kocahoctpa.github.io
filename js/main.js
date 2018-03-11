$(document).ready(function () {
    var error = [];
    $.datepicker.setDefaults(
        $.extend(
            {'dateFormat':'dd.mm.yy'},
            $.datepicker.regional['ru']
        )
    );

    $('#b_date').datepicker().mask('99.99.9999');

    $('#iin').mask('999999999999');

    $('.form-control__field').on('change focus', function () {
        if ($(this).val().length > 0) {
            $(this).closest('.form-control').addClass('form-control--filled');
            ValidateField(this);
        } else {
            $(this).closest('.form-control')
                .removeClass('form-control--filled form-control--success')
                .addClass('form-control--error');
        }
    });

    $('#empty_secondname').on('change', function () {
        $('#secondname')
            .val('')
            .attr('disabled', $(this).is(':checked') )
            .closest('.form-control').toggleClass('form-control--disabled', $(this).is(':checked') )
            .removeClass('form-control--filled form-control--success form-control--error');
    });

    function ValidateField(element) {
        var name = $(element).attr('name');
        var value = $(element).val();
        switch (name) {
            case 'lastname':
            case 'firstname':
            case 'secondname':
                error[name] = /^([А-Яа-я\s\-әңғүұқһіө])+$/g.test(value.trim());
                break;
            case 'sex':
                error[name] = value >= 0 && value <= 1;
                break;
            case 'b_date':
                error[name] = value.length === 10;
                break;
            case 'iin':
                error[name] = /^([0-9]+)$/g.test(value) && checkIIN(value, $('#b_date').val(), $('#sex').val() );
                break;

        }
        $(element).closest('.form-control').removeClass('form-control--success form-control--error');

        if( !error[name] ){
            $(element).closest('.form-control').addClass('form-control--error');
        }else {
            $(element).closest('.form-control').addClass('form-control--success');
        }
    }

    function checkIIN(value, date, sex) {
        var result = true;

        var age = date.split('.')[2];
        var year = age.substring(2,4);
        var month = date.split('.')[1];
        var day =  date.split('.')[0];

        if(date.length !== 10 && sex >= 0 && sex <= 1){
            result = false;
        }
        if (value.length !== 12 &&  /^([0-9]+)$/g.test(value)){
            result = false;
        }

        // Проверка даты рождения
        if( value.substring(0, 6)  !==  year + month + day){
            result = false;
        }

        // Пол
        var century_and_sex = parseInt(value.substring(6, 7));
        if ((century_and_sex % 2)  != sex){
            result = false;
        }
        // Век рождения
        if(parseInt(age, 10) <(1800+parseInt(century_and_sex/2)*100) ||
            parseInt(age, 10)>(1900+parseInt(century_and_sex/2)*100)){
          result = false;
        }



        // Контрольный разряд
        var b1 = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
        var b2 = [ 3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2 ];
        var a = [];

        var controll = 0;
        for(var i=0; i<12; i++){
            a[i] = parseInt(value.substring(i, i+1));
            if(i<11) controll += a[i]*b1[i];
        }
        controll = controll % 11;
        if(controll === 10) {
            controll = 0;
            for(var i=0; i<11; i++)
                controll += a[i]*b2[i];
            controll = controll % 11;
        }
        if(controll!== a[11]){
            result = false;
        }

        return result;
    }

});