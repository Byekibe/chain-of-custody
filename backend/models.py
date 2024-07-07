from flask import current_app, g
from db_connection import connect_to_mysql

def get_db():
    if 'db' not in g:
        g.db = connect_to_mysql()
    return g.db

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()
