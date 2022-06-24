import random

import flask
from werkzeug import security
import flask_login

import models
import arc_utils
import user_utils
import config
from main import db
from models import User, Task


def get_navbar(location):
    return flask.render_template(
        'navbar.html',
        location=location,
        logged_in=flask_login.current_user.is_authenticated)


def login():
    return flask.render_template(
        'login.html',
        navbar=get_navbar(location='login'))


def register():
    return flask.render_template(
        'register.html',
        navbar=get_navbar(location='register'))


def logout():
    flask_login.logout_user()
    return flask.redirect('/login')


def login_post():
    email = flask.request.form.get('email')
    error = user_utils.validate_email_string(email)
    if error:
        return flask.render_template(
            'login.html',
            navbar=get_navbar(location='login'),
            error=error)
    user = User.query.filter_by(email=email).first()
    if not user:
        return flask.render_template(
            'login.html',
            navbar=get_navbar(location='login'),
            error='Invalid email/password combination.',
            email=email)
    password = flask.request.form.get('password') + user.password_salt
    valid = security.check_password_hash(user.password_hash, password)
    if not valid:
        return flask.render_template(
            'login.html',
            navbar=get_navbar(location='login'),
            error='Invalid email/password combination.',
            email=email)
    flask_login.login_user(user, remember=True)
    return flask.redirect('/')


def register_post():
    email = flask.request.form.get('email')
    password = flask.request.form.get('password')

    error = user_utils.validate_email_string(email)
    if error:
        return flask.render_template(
            'register.html',
            navbar=get_navbar(location='register'),
            error=error,
            email=email)

    user = User.query.filter_by(email=email).first()
    if user:
        return flask.render_template(
            'register.html',
            navbar=get_navbar(location='register'),
            error='Email address already in use.',
            email=email)

    error = user_utils.validate_password_string(password)
    if error:
        return flask.render_template(
            'register.html',
            navbar=get_navbar(location='register'),
            error=error,
            email=email)

    password_salt = str(random.randint(1, 1e9))
    password_hash = security.generate_password_hash(password + password_salt, method='sha256')
    user = User(
        email=email,
        password_hash=password_hash,
        password_salt=password_salt,
        debug=config.DEBUG)
    db.session.add(user)
    db.session.commit()
    # user.put()
    flask_login.login_user(user, remember=True)
    return flask.redirect('/welcome')


@flask_login.login_required
def welcome():
    return flask.render_template(
        'welcome.html',
        navbar=get_navbar(location='welcome'))


def landing():
    return flask.render_template(
        'home.html',
        navbar=get_navbar(location='home'))


@flask_login.login_required
def editor():
    return flask.render_template(
        'editor.html',
        navbar=get_navbar(location='editor'))


def playground():
    return flask.render_template(
        'playground.html',
        navbar=get_navbar(location='playground'))


@flask_login.login_required
def create_task():
    data = flask.request.json
    valid = arc_utils.validate_task_format(data)
    if not valid:
        return 'BAD_FORMAT'

    min_size, max_size = arc_utils.compute_min_max_grid_size(data)
    task = Task(
        data=data,
        author=flask_login.current_user.key.id(),
        num_train_examples=len(data['train']),
        num_test_examples=len(data['test']),
        min_grid_size=min_size,
        max_grid_size=max_size,
        debug=config.DEBUG)
    key = db.session.add(task)
    key = db.session.commit()
    # key = task.put()
    return 'OK'

