$(document).ready(function(){
    $('#register_post').submit(function(event){
        event.preventDefault();
        var email=$('#register_email').val();
        var password=$('#register_password').val();
        var confirm_password=$('#register_confirm_password').val();

        if(email != '' && password != '' && confirm_password != '')
        {
            $.ajax({
                url:"/register_post",
                method:"POST",
                data:{email:email, password:password, confirm_password:confirm_password},
                success:function(data)
                    {
                        if(data)
                        {
                            $('#registration_error').attr('class','error')
                            $("#registration_error").html(data);
                        }
                        else if(data == false)
                        {
                            window.location = '/welcome';
                        }
                    }
            });
        }
        else
        {
            $('#registration_error').attr('class','error')
            $("#registration_error").html("<b>All Fields are Required</b>. "); 
        }
    
    });
});