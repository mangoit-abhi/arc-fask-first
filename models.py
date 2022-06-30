# from google.cloud import ndb
from datetime import datetime
from main import db
from itsdangerous.serializer import Serializer
import config


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.Integer)
    data = db.Column(db.Text, nullable=False)
    num_train_examples = db.Column(db.Integer)
    num_test_examples = db.Column(db.Integer)
    max_grid_size = db.Column(db.Integer)
    min_grid_size = db.Column(db.Integer)
    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    debug = db.Column(db.Boolean, default=False, nullable=False)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), nullable=False)
    email_validated = db.Column(db.Boolean, default=False, nullable=False)
    password_hash = db.Column(db.String(90), nullable=False)
    password_salt = db.Column(db.String(90), nullable=False)
    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    debug = db.Column(db.Boolean, default=False, nullable=False)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False
    
    def get_id(self):
        return self.id
    
    def get_reset_token(self, expires_sec=1800):
        s = Serializer(config.SECRET_KEY)
        return s.dumps({'user_id': self.id})
    
    @staticmethod
    def verify_reset_token(token):
        s = Serializer(config.SECRET_KEY)
        try:
            user_id = s.loads(token)['user_id']
        except:
            return None
        return User.query.get(user_id)
     