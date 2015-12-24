#!/usr/bin/python
#-*- coding: utf-8 -*-
from flask import *
from sqlalchemy import *
import json, hashlib

app = Flask(__name__)
db = create_engine('mysql://root@localhost/python_test?charset=utf8&use_unicode=True', echo=True)
metadata = MetaData(bind=db)

app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

users = Table('users', metadata, autoload=True)

@app.route('/')
def index():
  print session
  if session:
    return render_template('index.html')
  else:
    return render_template('lending.html')

@app.route('/<group_number>')
def main(group_number):
  print group_number
  return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
  if request.method == 'POST':
    id = request.form['id']
    pw = request.form['pw']
    s = users.select(users.c.id == id)
    result = s.execute().first()
    if result:
      hash_pw = hashlib.sha1(pw+'enon').hexdigest()
      if result.pw == hash_pw:
        session['user'] = dict(result)
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
  return redirect(url_for('login'))

@app.route('/signup', methods=['GET', 'POST', 'PUT'])
def signup():
  if request.method == 'POST':
    name = request.form['name']
    id = request.form['id']
    pw = request.form['pw']
    phone = request.form['phone']
    group_number = request.form['group_number'] or 0

    s = users.select()
    result = s.execute()
    for item in result:
      if id == item.id:
        return jsonify({'status': 204, 'message': '이미 사용중인 아이디입니다.'})
    hash_pw = hashlib.sha1(pw+'enon').hexdigest()
    i = users.insert()
    i.execute(name=name, id=id, pw=hash_pw, phone=phone, group_number=group_number)
    return jsonify({'status': 200, 'message': 'success'})

  return render_template('signup.html')

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
        group_number INT(11),
        PRIMARY KEY(code)
      ) DEFAULT CHARACTER SET utf8;
    """
  )
  conn.close()

if __name__ == '__main__':
	app.run(port=9090, debug=True)
