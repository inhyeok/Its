#!/usr/bin/python
#-*- coding: utf-8 -*-
from flask import *
from sqlalchemy import *
import json, hashlib

app = Flask(__name__)
db = create_engine('mysql://root@localhost/python_test?charset=utf8&use_unicode=True', echo=True)
metadata = MetaData(bind=db)

app.secret_key = 'I12am34ITS56by78Enon'

users = Table('users', metadata, autoload=True)
group_list = Table('group_list', metadata, autoload=True)
event_list = Table('events', metadata, autoload=True)

@app.route('/')
def index():
  if session:
    return render_template('index.html')
  return render_template('lending.html')

@app.route('/<group_name>')
def main(group_name):
  return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
  if request.method == 'POST':
    id = request.form['id']
    pw = request.form['pw']
    s = users.select(users.c.id == id)
    user = s.execute().first()
    if user:
      hash_pw = hashlib.sha1(pw+'enon').hexdigest()
      if user.pw == hash_pw:
        group_users = []
        session['user'] = dict(user)
        s = group_list.select(group_list.c.id == user.group_id)
        group = s.execute().first()
        session['group'] = dict(group or {})
        s = users.select(session['group']['id'] == user.group_id)
        group_users_result = s.execute()
        for item in group_users_result:
          group_users.append(dict(item))
        session['group_users'] = group_users
        return jsonify({'status': 200, 'message': 'success'})
        # return redirect(url_for('index'))
      else:
        return jsonify({'status': 204, 'message': '비밀번호를 다시 확인해주세요.'})
    else:
      return jsonify({'status': 204, 'message': '존재하지않은 아이디 입니다.'})

  return render_template('login.html')

@app.route('/logout')
def logout():
  session.pop('user', None)
  session.pop('group', None)
  return redirect(url_for('login'))

@app.route('/signup', methods=['GET', 'POST', 'PUT'])
def signup():
  if request.method == 'POST':
    name = request.form['name']
    id = request.form['id']
    pw = request.form['pw']
    phone = request.form['phone']
    group_id = request.form['group_id'] or 0

    s = users.select()
    result = s.execute()
    for item in result:
      if id == item.id:
        return jsonify({'status': 204, 'message': '이미 사용중인 아이디입니다.'})
    hash_pw = hashlib.sha1(pw+'enon').hexdigest()
    i = users.insert()
    i.execute(name=name, id=id, pw=hash_pw, phone=phone, group_id=group_id)
    return jsonify({'status': 200, 'message': 'success'})

  return render_template('signup.html')

@app.route('/events', methods=['GET', 'POST', 'PUT', 'DELETE'])
def events():
  if request.method == 'POST':
    return True
  elif request.method == 'PUT':
    return True
  elif request.method == 'DELETE':
    return True
  print request
  s = event_list.select(session['group']['id'] == event_list.c.group_id)
  result = s.execute()
  event_items = []
  for item in result:
    event_items.append(dict(item))
  return jsonify({'status': 200, 'message': '성공', 'items': event_items})

@app.route('/mktable/users')
def mktable_users():
  conn = db.connect()
  conn.execute(
    """
      CREATE TABLE users (
        code INT(11) AUTO_INCREMENT,
        id VARCHAR(255),
        pw VARCHAR(255),
        name VARCHAR(200),
        phone VARCHAR(200),
        group_id INT(11),
        PRIMARY KEY(code)
      ) DEFAULT CHARACTER SET utf8;
    """
  )
  conn.close()

@app.errorhandler(404)
def page_not_found(error):
    return render_template('page_not_found.html'), 404

if __name__ == '__main__':
	app.run(port=9090, debug=True)
