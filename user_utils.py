from flask import request,url_for
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
    msg = Message('Password Reset Request', sender='noreply@demo.com', recipients=[user.email])
    msg.body = f''' To Reset Password visit following Link:
    {url_for('reset_token', token=token, _external=True)}
    If you did not make this request then simply ignore this mail and no changes will be made.
    '''
    mail.send(msg)