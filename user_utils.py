from flask import url_for
from flask_mail import Message
from main import mail


def validate_email_string(email):
    if '@' not in email:
        return "Invalid email format."
    parts = email.split('@')
    if len(parts) != 2:
        return "Invalid email format."
    if '.' not in parts[1]:
        return "Invalid email format."


def validate_password_string(password):
    if len(password) < 5:
        return "Your password should be at least 5 characters long."


def send_reset_email(user):
    token = user.get_reset_token()
    msg = Message('Reset Password Email', sender='noreply@demo.com', recipients=[user.email])
    msg.html = f'''
    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
        <tr>
            <td style="height:40px;">&nbsp;</td>
        </tr>
        <tr>
            <td style="padding:0 35px;">
                <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                    You have requested to reset your password</h1>
                <span
                    style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;">
                </span>
                <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                    A unique link to reset your password has been generated for you. To reset your password, click the following link and follow the instructions.
                </p>
                <a href="{url_for('reset_token', token=token, _external=True)}" style="background:#ec441b;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset Password</a>
            </td>
        </tr>
        <tr>
            <td style="height:40px;">&nbsp;</td>
        </tr>
    </table>'''
    mail.send(msg)