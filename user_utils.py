

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
