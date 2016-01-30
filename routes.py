#!/usr/bin/python
#-*- coding: utf-8 -*-
from flask import *
from sqlalchemy import *
import json, hashlib

app = Flask(__name__)
db = create_engine('mysql://root@localhost/python_test?charset=utf8&use_unicode=True', echo=True)
metadata = MetaData(bind=db)

app.secret_key = 'I12am34ITS56by78Enon'

Users = Table('users', metadata, autoload=True)
group_list = Table('group_list', metadata, autoload=True)
event_list = Table('event_list', metadata, autoload=True)

@app.route('/')
def index():
  if session:
    if session['user']['group_id'] == 0:
      return redirect(url_for('group'))
    return render_template('index.html')
  return render_template('lending.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
  if request.method == 'POST':
    id = request.form['id']
    pw = request.form['pw']
    user = Users.select(Users.c.id == id).execute().first()
    if user:
      hash_pw = hashlib.sha1(pw+'enon').hexdigest()
      if user.pw == hash_pw:
        group_users = []
        session['user'] = dict(user)
        group = group_list.select(group_list.c.id == user.group_id).execute().first()
        if group:
          session['group'] = dict(group)
          group_users_result = Users.select(Users.c.group_id == user.group_id).execute()
          for item in group_users_result:
            group_users.append(dict(item))
          session['group_users'] = group_users
        else:
          session['group'] = {}
        return jsonify({'status': 200, 'message': 'success'})
      else:
        return jsonify({'status': 204, 'message': '비밀번호를 다시 확인해주세요.'})
    else:
      return jsonify({'status': 204, 'message': '존재하지않은 아이디 입니다.'})
  return render_template('login.html')

@app.route('/logout')
def logout():
  session.pop('user', None)
  session.pop('group', None)
  session.pop('group_users', None)
  return redirect(url_for('login'))

@app.route('/signup', methods=['GET', 'POST', 'PUT'])
def signup():
  if request.method == 'POST':
    name = request.form['name']
    id = request.form['id']
    pw = request.form['pw']
    phone = request.form['phone'] or ''
    group_code = request.form['group_code'] or ''
    group_code_check = group_list.select(group_list.c.code == group_code).execute().first()
    group_id = 0
    if group_code_check:
      group_id = group_code_check['id']
    result = Users.select(Users.c.id == id).execute().first()
    if result:
      return jsonify({'status': 204, 'message': '이미 사용중인 아이디입니다.'})
    hash_pw = hashlib.sha1(pw+'enon').hexdigest()
    Users.insert().execute(name=name, id=id, pw=hash_pw, phone=phone, group_id=group_id)
    return jsonify({'status': 200, 'message': 'success'})
  return render_template('signup.html')

@app.route('/events', methods=['GET', 'POST', 'PUT', 'DELETE'])
def events():
  event_item = request.form
  if request.method == 'POST':
    event_list.insert().execute(title=event_item['event_title'], content=event_item['event_content'], group_id=session['group']['id'], user_id=session['user']['id'], started_at=event_item['event_started_at'], finished_at=event_item['event_finished_at'], color= event_item['event_color'], created_at= 'NOW()')
    return jsonify({'status': 200, 'message': '성공'})

  elif request.method == 'PUT':
    event_list.update(event_list.c.id == event_item['event_id']).execute(title=event_item['event_title'], content=event_item['event_content'], started_at=event_item['event_started_at'], finished_at=event_item['event_finished_at'], color= event_item['event_color'], updated_at= 'NOW()')
    return jsonify({'status': 200, 'message': '성공'})

  elif request.method == 'DELETE':
    return True

  result = event_list.select(session['group']['id'] == event_list.c.group_id).execute()
  event_items = []
  for item in result:
    event_items.append(dict(item))
  return jsonify({'status': 200, 'message': '성공', 'items': event_items})

@app.route('/users', methods=['GET', 'POST', 'PUT', 'DELETE'])
def users():
  if request.method == 'POST':
    return True

  elif request.method == 'PUT':
    return True

  elif request.method == 'DELETE':
    return True

  return render_template('user.html')

@app.route('/group', methods=['GET', 'POST', 'PUT', 'DELETE'])
def group():
  if request.method == 'POST':
    group_name = request.form['group_name']
    group_code = request.form['group_code']
    group_code_check = group_list.select(group_list.c.name == group_name).execute().first()
    if group_code_check:
      return jsonify({'status': 204, 'message': '이미 사용중인 그룹이름입니다.'})
    group_code_check = group_list.select(group_list.c.code == group_code).execute().first()
    if group_code_check:
      return jsonify({'status': 204, 'message': '이미 사용중인 그룹코드입니다.'})
    group_list.insert().execute(name=group_name, code=group_code)
    group_info = group_list.select(group_list.c.code == group_code).execute().first()
    Users.update(Users.c.code == session['user']['code']).execute(group_id=group_info['id'])
    session['user']['group_id'] = group_info['id']
    session['group'] = dict(group_info)
    session['group_users'] = [session['user']]
    return jsonify({'status': 200, 'message': '성공'})

  elif request.method == 'PUT':
    return True

  elif request.method == 'DELETE':
    return True

  return render_template('group_make.html')

@app.route('/board', methods=['GET','POST','PUT','DELETE'])
def board():
  if request.method == 'POST'
    return True
  else if request.method == 'PUT'
    return True
  else if request.method == 'DELETE'
    return True
  return render_template('board.html')

# @app.route('/mktable/users')
# def mktable_users():
#   conn = db.connect()
#   conn.execute(
#     """
#       CREATE TABLE users (
#         code INT(11) AUTO_INCREMENT,
#         id VARCHAR(255),
#         pw VARCHAR(255),
#         name VARCHAR(200),
#         phone VARCHAR(200),
#         group_id INT(11),
#         PRIMARY KEY(code)
#       ) DEFAULT CHARACTER SET utf8;
#     """
#   )
#   conn.close()

@app.errorhandler(404)
def page_not_found(error):
    return render_template('page_not_found.html'), 404

if __name__ == '__main__':
	app.run(port=9090, debug=True)
