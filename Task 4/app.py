from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, Email, EqualTo
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret_key_here'

class User:
    def __init__(self, id, username, password, email):
        self.id = id
        self.username = username
        self.password = generate_password_hash(password)
        self.email = email

class RegisterForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired(), Length(min=4, max=20)])
    email = StringField('Email', validators=[InputRequired(), Email()])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=8, max=20)])
    confirm_password = PasswordField('Confirm Password', validators=[InputRequired(), EqualTo('password')])
    submit = SubmitField('Register')

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired(), Length(min=4, max=20)])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=8, max=20)])
    submit = SubmitField('Login')

users = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        new_user = User(len(users) + 1, form.username.data, form.password.data, form.email.data)
        users.append(new_user)
        return redirect(url_for('login'))
    return render_template('register.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        for user in users:
            if form.username.data == user.username:
                if check_password_hash(user.password, form.password.data):
                    session['current_user'] = user.username
                    flash('Register!')
                    return redirect(url_for('secured'))
                else:
                    flash('Invalid password')
                    return redirect(url_for('login'))
        flash('Username not found')
        return redirect(url_for('login'))
    return render_template('login.html', form=form)

@app.route('/secured')
def secured():
    if 'current_user' in session:
        current_user = session['current_user']
        return render_template('secured.html', current_user=current_user)
    else:
        return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)