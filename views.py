import requests
import json
from flask import Flask, flash, jsonify, request, redirect, url_for, render_template
import flask
import random
from werkzeug import security
from flask_login import current_user
import flask_login

from user_utils import send_reset_email
from models import User, Task
from main import db
import arc_utils
import user_utils
import config


def get_navbar(location):
    return flask.render_template('navbar.html', location=location)

# def login():
#     return flask.render_template('login.html',navbar=get_navbar(location='login'))

# def register():
#     return flask.render_template('register.html',navbar=get_navbar(location='register'))

def logout():
    flask_login.logout_user()
    return flask.redirect('/')

def login_post():
    if request.method == "POST":
        email = flask.request.form.get('login_email')
        print(email)
        error = user_utils.validate_email_string(email)
        if error:
            login_err_data = error
            login_error = True
            return jsonify(login_err_data)
        user = User.query.filter_by(email=email).first()
        if not user:
            login_err_data = 'Email not registered'
            login_error = True
            return jsonify(login_err_data)
        password = flask.request.form.get('login_password') + user.password_salt
        valid = security.check_password_hash(user.password_hash, password)
        if not valid:
            login_err_data = 'email/password combination mismatch'
            login_error = True
            return jsonify(login_err_data,login_error)
        flask_login.login_user(user, remember=True)
        login_error = False
        return jsonify(login_error)

def register_post():
    if request.method == "POST":
        register_error = False
        email = request.form.get('register_email')
        password = request.form.get('register_password')
        confirm_password = request.form.get('register_confirm_password')

        error_email = user_utils.validate_email_string(email)
        if error_email:
            register_error_data = error_email
            register_error = True
            return jsonify(register_error_data)

        user = User.query.filter_by(email=email).first()
        if user:
            register_error_data = 'Email address already in use.'
            register_error = True
            return jsonify(register_error_data)

        error_password = user_utils.validate_password_string(password)
        if error_password:
            register_error_data = error_password
            register_error = True
            return jsonify(register_error_data)

        if password != confirm_password:
            register_error_data = "Password and confirm password did not match"
            register_error = True
            return jsonify(register_error_data)
            
        password_salt = str(random.randint(1, 1e9))
        password_hash = security.generate_password_hash(password + password_salt, method='sha256')
        if register_error == False:
            user = User(
                email=email,
                password_hash=password_hash,
                password_salt=password_salt,
                debug=config.DEBUG)
            db.session.add(user)
            db.session.commit()
            # user.put()
        flask_login.login_user(user, remember=True)
        register_error = False
        return jsonify(register_error)

def landing():
    data = requests.get('http://94.237.64.209/arc_wordpress/arc_wp/wp-json/arc-api/home')
    latest_data = json.loads(data.text)
    return flask.render_template('home.html',apidata=latest_data)

@flask_login.login_required
def editor():
    return flask.render_template('editor.html', navbar=get_navbar(location='editor'))

def playground():
    return flask.render_template('playground.html', navbar=get_navbar(location='playground'))

@flask_login.login_required
def create_task():
    data = flask.request.json
    valid = arc_utils.validate_task_format(data)
    if not valid:
        return 'BAD_FORMAT'
    
    min_size, max_size = arc_utils.compute_min_max_grid_size(data)
    task = Task(
        data=data,
        author=flask_login.current_user.id,
        num_train_examples=len(data['train']),
        num_test_examples=len(data['test']),
        min_grid_size=min_size,
        max_grid_size=max_size,
        debug=config.DEBUG)
    db.session.add(task)
    db.session.commit()
    # key = task.put()
    return 'OK'

def reset_request():
    if current_user.is_authenticated:
        return redirect(url_for('landing'))
    if request.method == "POST":
        email = request.form.get('email')
        error = user_utils.validate_email_string(email)
        if error:
            reset_email_error = error
            reset_error = True
            return jsonify(reset_email_error)
        user = User.query.filter_by(email=email).first()
        if not user:
            reset_email_error = "There is no account with that email. You must register first."
            reset_error = True
            return jsonify(reset_email_error)
        send_reset_email(user)
        reset_error = False
        return jsonify(reset_error)
    return render_template('reset_request.html')

def reset_token(token):
    if current_user.is_authenticated:
        return redirect(url_for('landing'))
    user = User.verify_reset_token(token)
    if user is None:
        return redirect(url_for('reset_request'))
    if request.method == "POST":
        reset_error = False
        password = request.form.get('reset_password')
        confirm_password = request.form.get('reset_confirm_password')
        error_password = user_utils.validate_password_string(password)
        if error_password:
            reset_error_data = error_password
            reset_error = True
            return render_template('rest_token.html', error=reset_error_data)
        if password != confirm_password:
            reset_error_data = "Password and confirm password did not match"
            reset_error = True
            return render_template('rest_token.html', error=reset_error_data)
        password_salt = str(random.randint(1, 1e9))
        password_hash = security.generate_password_hash(password + password_salt, method='sha256')
        if reset_error == False:
            user.password_hash = password_hash
            user.password_salt = password_salt
            db.session.commit()
            reset_error_data = 'Your password has been updated! You are now able to login'
            return redirect(url_for('landing'))
    return render_template('rest_token.html')