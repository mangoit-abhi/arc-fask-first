$(document).ready(function(){
    $('#password_reset_mail').submit(function(event){
        event.preventDefault();
        var email=$('#email').val();
        find_attherate = /@/;
        result_attherate = find_attherate.test(email)
        find_dot = /./;
        result_dot = find_dot.test(email)
        if(email == '')
        {
            $('#password_reset_email_error').attr('class','error')
            $("#password_reset_email_error").html("<b>Email is Required.</b>. "); 
        }
        else if(result_attherate == false)
        {
            $('#password_reset_email_error').attr('class','error')
            $("#password_reset_email_error").html("<b>Email Format is not correct(@ needed).</b>. "); 
        }
        else if(result_dot == false)
        {
            $('#password_reset_email_error').attr('class','error')
            $("#password_reset_email_error").html("<b>Email Format is not correct(dot(.) needed).</b>. "); 
        }
        else
        {
            $.ajax({
                url:"/reset_password",
                method:"POST",
                data:{email:email},
                success:function(data)
                    {
                        if(data)
                        {
                            $('#password_reset_email_error').attr('class','error')
                            $("#password_reset_email_error").html(data);
                        }
                        else if(data == false)
                        {
                            window.location = '/';
                        }
                    }
            });
        }
    });
});