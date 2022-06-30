import flask
import flask_login
from flask_mail import Mail
# from google.cloud import ndb
from flask_sqlalchemy import SQLAlchemy


import config


# Set up the app

# client = ndb.Client()


# def ndb_wsgi_middleware(wsgi_app):
#     def middleware(environ, start_response):
#         with client.context():
#             return wsgi_app(environ, start_response)
#     return middleware


app = flask.Flask(
    __name__,
    static_url_path='', 
    static_folder='static',
    template_folder='templates')
app.config['SECRET_KEY'] = config.SECRET_KEY
# app.wsgi_app = ndb_wsgi_middleware(app.wsgi_app)  # Wrap the app in middleware.
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'abhilash.mangoit@gmail.com'
app.config['MAIL_PASSWORD'] = 'yebuqafkqkhwfruc'
db = SQLAlchemy(app)
login_manager = flask_login.LoginManager()
login_manager.login_view = '/login'
login_manager.init_app(app)
mail = Mail(app)

import views
import models

@login_manager.user_loader
def load_user(user_id):
    return models.User.query.get(user_id)


# Routes

@app.route('/')
def landing():
    return views.landing()


@app.route('/login')
def login():
    return views.login()


@app.route('/logout')
def logout():
    return views.logout()


@app.route('/login_post', methods=['POST'])
def login_post():
    return views.login_post()


@app.route('/register')
def register():
    return views.register()


@app.route('/register_post', methods=['POST'])
def register_post():
    return views.register_post()


@app.route('/welcome')
def welcome():
    return views.welcome()


@app.route('/create_task', methods=['POST'])
def create_task():
    return views.create_task()


@app.route('/editor')
def editor():
    return views.editor()


@app.route('/playground')
def playground():
    return views.playground()

@app.route("/reset_password", methods=['GET','POST'])
def reset_request():
    return views.reset_request()

@app.route("/reset_password/<token>", methods=['GET','POST'])
def reset_token(token):
    return views.reset_token(token)

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. You
    # can configure startup instructions by adding `entrypoint` to app.yaml.
    app.run(host='arc-first.herokuapp.com/', port=8080, debug=True)
