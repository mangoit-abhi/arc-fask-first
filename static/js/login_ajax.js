$(document).ready(function(){
    $('#login_post').submit(function(event){
        event.preventDefault();
        var email=$('#login_email').val();
        var password=$('#login_password').val();
        if(email != '' && password != '')
        {
            $.ajax({
                url:"/login_post",
                method:"POST",
                data:{email:email, password:password},
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
        else
        {
            $('#login_error').attr('class','error')
            $("#login_error").html("<b>Both Fields are Required</b>. "); 
        }
    
    });
});