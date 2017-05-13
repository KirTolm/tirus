# -*- coding: utf-8 -*-
import sqlite3
import os
from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash

app = Flask(__name__)
app.config.from_object(__name__)
app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'preview.db'),
    DEBUG=True,
    SECRET_KEY='wf00i)&r7trs8cop52avqi=cf5udcc+tz8*dylx*7y5-l=5#a&',
    USERNAME='tirusproject737',
    PASSWORD='tiruseveryday',
    UPLOAD_FOLDER = 'static/uploaded/',
))
app.config.from_envvar('PREVIEW_SETTINGS', silent=True)

def connect_db():
    rv = sqlite3.connect(app.config['DATABASE'])
    rv.row_factory = sqlite3.Row
    return rv

def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

def get_db():
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = connect_db()
    return g.sqlite_db

@app.teardown_appcontext
def close_db(error):
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()

@app.route('/')
def list():
    db = get_db()
    cur = db.execute('select id, title, content from post')
    entries = cur.fetchall()
    return render_template('list.html', entries=entries)

@app.route('/add', methods=['POST'])
def add_entry():
    if not session.get('logged_in'):
        abort(401)
    db = get_db()
    db.execute('insert into post (title, content) values (?, ?)', [request.form['title'], request.form['content']])
    db.commit()
    flash('New entry was successfully posted')
    return redirect(url_for('list'))

@app.route('/delete/<int:post_id>', methods=['GET'])
def delete_entry(post_id):
    if not session.get('logged_in'):
        abort(401)
    db = get_db()
    db.execute('delete from post where id=?', (post_id,))
    db.commit()
    flash('The entry was deleted')
    return redirect(url_for('list'))

@app.route('/edit/<int:post_id>', methods=['POST'])
def edit_entry(post_id):
    if not session.get('logged_in'):
        abort(401)
    db = get_db()
    db.execute('update post set title = ?, content=? where id=?', [request.form['title'], request.form['content'], post_id])
    db.commit()
    flash('The entry was edited')
    return redirect(url_for('list'))

@app.route('/admin', methods=['GET', 'POST'])
def admin():
    error = None
    if request.method == 'POST':
        if request.form['username'] != app.config['USERNAME']:
            error = 'Invalid username'
        elif request.form['password'] != app.config['PASSWORD']:
            error = 'Invalid password'
        else:
            session['logged_in'] = True
            flash('You were logged in')
            return redirect(url_for('list'))
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    if not session.get('logged_in'):
        abort(401)
    session.pop('logged_in', None)
    flash('You were logged out')
    return redirect(url_for('list'))

@app.route('/change', methods=['POST'])
def change():
    if not session.get('logged_in'):
        abort(401)
    app.config['USERNAME'] = request.form['username']

    app.config['PASSWORD'] = request.form['password']
    flash('Account has been changed')
    return redirect(url_for('list'))


if __name__ == '__main__':
    app.run()