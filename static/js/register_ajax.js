$(document).ready(function(){
    $('#register_post').submit(function(event){
        event.preventDefault();
        var email=$('#register_email').val();
        find_attherate = /@/;
        result_attherate = find_attherate.test(email)
        var password=$('#register_password').val();
        var length_password = password.length
        var confirm_password=$('#register_confirm_password').val();

        if(email == '' && password == '' && confirm_password == '')
        {
            $('#registration_error').attr('class','error')
            $("#registration_error").html("<b>All Fields are Required</b>. "); 
        }
        else if(result_attherate == false)
        {
            $('#registration_error').attr('class','error')
            $("#registration_error").html("<b>Email Format is not correct-(@ needed).</b>. "); 
        }
        else if(length_password < 5)
        {
            $('#registration_error').attr('class','error')
            $("#registration_error").html("<b>Your password should be at least 5 characters long.</b>. "); 
        }
        else if(password != confirm_password)
        {
            $('#registration_error').attr('class','error')
            $("#registration_error").html("<b>Both Password and Confirm Password Did not Match</b>. "); 
        }
        else
        {
            $.ajax({
                url:"/register_post",
                method:"POST",
                data:{register_email:email, register_password:password, register_confirm_password:confirm_password},
                success:function(data)
                    {
                        if(data)
                        {
                            $('#registration_error').attr('class','error')
                            $("#registration_error").html(data);
                        }
                        else if(data == false)
                        {
                            window.location = '/editor';
                        }
                    }
            });
        }
    });
});