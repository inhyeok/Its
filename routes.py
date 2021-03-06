#!/usr/bin/python
#-*- coding: utf-8 -*-
from flask import *
from sqlalchemy import *
import json, hashlib

app = Flask(__name__)
db = create_engine('mysql://root@localhost/python_test?charset=utf8&use_unicode=True', echo=True)
metadata = MetaData(bind=db)

app.secret_key = 'I12am34ITS56by78Enon'

UserList = Table('user_list', metadata, autoload=True)
GroupList = Table('group_list', metadata, autoload=True)
EventList = Table('event_list', metadata, autoload=True)

@app.route('/')
def index():
  if session:
    if not session['user']['group_id']:
      return redirect(url_for('group'))
    return render_template('index.html')
  return render_template('landing.html')

@app.route('/signin', methods=['GET', 'POST'])
def signin():
  if request.method == 'POST':
    id = request.form['id']
    pw = request.form['pw']
    user = UserList.select(UserList.c.id == id).execute().first()
    if user:
      hash_pw = hashlib.sha1(pw+'enon').hexdigest()
      if user.pw == hash_pw:
        group_user_list = []
        session['user'] = dict(user)
        group = GroupList.select(GroupList.c.id == user.group_id).execute().first()
        if group:
          session['group'] = dict(group)
          result = UserList.select(UserList.c.group_id == user.group_id).execute()
          for item in result:
            group_user_list.append(dict(item))
          session['group_user_list'] = group_user_list
        else:
          session['group'] = {}
        return jsonify({'status': 200, 'message': 'success'})
      else:
        return jsonify({'status': 204, 'message': '비밀번호를 다시 확인해주세요.'})
    else:
      return jsonify({'status': 204, 'message': '존재하지않은 아이디 입니다.'})
  return render_template('signin.html')

@app.route('/logout')
def logout():
  session.pop('user', None)
  session.pop('group', None)
  session.pop('group_user_list', None)
  return redirect(url_for('index'))

@app.route('/signup', methods=['GET', 'POST', 'PUT'])
def signup():
  if request.method == 'POST':
    user = {
      'name': request.form['name'],
      'id': request.form['id'],
      'pw': request.form['pw'],
      'phone': request.form['phone'] or '',
      'group_code': request.form['group_code'] or '',
      'group_id': 0
    }
    result = UserList.select(UserList.c.id == user['id']).execute().first()
    if result:
      return jsonify({'status': 204, 'message': '이미 사용중인 아이디입니다.'})
    group_code_check = GroupList.select(GroupList.c.code == user['group_code']).execute().first()
    if group_code_check:
      user['group_id'] = group_code_check['id']
      session['group'] = dict(group_code_check)
      group_user_list = []
      result = UserList.select(UserList.c.group_id == user['group_id']).execute()
      for item in result:
        group_user_list.append(dict(item))
      session['group_user_list'] = group_user_list

    user['pw'] = hashlib.sha1(user['pw']+'enon').hexdigest()
    UserList.insert().execute(user)
    user = UserList.select(UserList.c.id == user['id']).execute().first()
    session['user'] = dict(user)

    return jsonify({'status': 200, 'message': 'success'})
  return render_template('signup.html')

@app.route('/events', methods=['GET', 'POST', 'PUT', 'DELETE'])
def events():
  if request.method == 'POST':
    event = request.form
    try:
      EventList.insert().execute(title=event['event_title'], content=event['event_content'], group_id=session['group']['id'], user_id=session['user']['code'], started_at=event['event_started_at'], finished_at=event['event_finished_at'], color= event['event_color'], created_at= 'NOW()')
    except Exception, e:
      return jsonify({'status': 500, 'message': e})
    return jsonify({'status': 200, 'message': '성공'})

  elif request.method == 'PUT':
    event = request.form
    try:
      EventList.update(EventList.c.id == event['event_id']).execute(title=event['event_title'], content=event['event_content'], started_at=event['event_started_at'], finished_at=event['event_finished_at'], color= event['event_color'], updated_at= 'NOW()')
    except Exception, e:
      return jsonify({'status': 500, 'message': e})
    return jsonify({'status': 200, 'message': '성공'})

  elif request.method == 'DELETE':
    event = request.form
    try:
      EventList.delete(EventList.c.id == event['event_id']).execute()
    except Exception, e:
      return jsonify({'status': 500, 'message': e})
    return jsonify({'status': 200, 'message': '삭제성공'})

  try:
    result = EventList.select(session['group']['id'] == EventList.c.group_id).execute()
  except Exception, e:
    return jsonify({'status': 500, 'message': e})
  events = []
  for item in result:
    events.append(dict(item))
  return jsonify({'status': 200, 'message': '성공', 'items': events})

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
    try:
      group_code_check = GroupList.select(GroupList.c.name == group_name).execute().first()
      if group_code_check:
        return jsonify({'status': 204, 'message': '이미 사용중인 그룹이름입니다.'})
      GroupList.insert().execute(name=group_name, code=group_code)
      group_info = GroupList.select(GroupList.c.code == group_code).execute().first()
      UserList.update(UserList.c.code == session['user']['code']).execute(group_id=group_info['id'])
    except Exception, e:
      return jsonify({'status': 500, 'message': e})
    session['user']['group_id'] = group_info['id']
    session['group'] = dict(group_info)
    session['group_user_list'] = [session['user']]
    return jsonify({'status': 200, 'message': '성공'})

  elif request.method == 'PUT':
    return True

  elif request.method == 'DELETE':
    return True

  if not session:
    return redirect(url_for('index'))
  if session['user']['group_id'] and session['user']['group_id'] != 0:
    return redirect(url_for('index'))
  return render_template('group_make.html')

@app.route('/board', methods=['GET','POST','PUT','DELETE'])
def board():
  if request.method == 'POST':
    return True
  elif request.method == 'PUT':
    return True
  elif request.method == 'DELETE':
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
