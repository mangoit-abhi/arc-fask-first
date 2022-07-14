$(document).ready(function(){
    $('#login_post').submit(function(event){
        event.preventDefault();
        var email=$('#login_email').val();
        find_attherate = /@/;
        result_attherate = find_attherate.test(email)
        var password=$('#login_password').val();
        var length_password = password.length
        if(email == '' && password == '')
        {
            $('#login_error').attr('class','error')
            $("#login_error").html("<b>Email and Password are required.</b>. "); 
        }
        else if(result_attherate == false)
        {
            $('#login_error').attr('class','error')
            $("#login_error").html("<b>Email format is not correct-(@ needed).</b>. "); 
        }
        else if(length_password < 5)
        {
            $('#login_error').attr('class','error')
            $("#login_error").html("<b>Your password should be at least 5 characters long.</b>. "); 
        }
        else
        {
            $.ajax({
                url:"/login_post",
                method:"POST",
                data:{login_email:email, login_password:password},
                success:function(data)
                    {
                        if(data)
                        {
                            $('#login_error').attr('class','error')
                            $("#login_error").html(data);
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