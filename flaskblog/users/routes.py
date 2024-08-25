from flask import Blueprint, redirect, flash, url_for, render_template, session, request, current_app
from flask_login import current_user, logout_user, login_user, login_required
from werkzeug.utils import secure_filename
from flask import jsonify
from uuid import uuid4
import os
from flaskblog.users.forms import (
    Register_Form,
    Login_Form,
    Update_Account_Form,
    Reset_Request_Form,
    Reset_Password,
)
from flaskblog.users.utils import send_email
from flaskblog.models import User
from flaskblog import bcrypt, db


users = Blueprint("users", __name__)


# User Registration route
@users.route("/register", strict_slashes=False, methods=["GET", "POST"])
def register_page():
    if current_user.is_authenticated:
        return redirect("index_page")
    
    #  check if request is Post
    if request.method == "POST":
        data = request.get_json()
        
        # save user in the database.
        user = User(
            username= data.get('username'),
            email= data.get('email'),
            password=bcrypt.generate_password_hash(data.get('password')).decode("utf-8"),
        )
        db.session.add(user)
        db.session.commit()
        db.session.close()

        return jsonify({"welcome_message": 'Thank you for Joining us', 'redirect_url': url_for('users.login_page'), 'username': data.get('username')})
    else:
        return render_template("register.html")
