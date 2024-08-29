

# Inkwell

**ALX Specialization Final Project**

Welcome to the Inkwell project! This project is the final part of my ALX Specialization, where I designed and developed a fully functional blogging platform using Flask and JavaScript. This README will guide you through the project's features, setup, and technical details.

## Project Overview

The Inkwell is a web application that allows users to create, edit, and delete blog posts. It supports user authentication, category filtering, and provides a minimalistic design to enhance user experience. The application is built using Flask for the backend and JavaScript for the frontend.

## Features

- **User Authentication**: Users can sign up, log in, and log out. Passwords are securely hashed using `bcrypt`.
- **CRUD Operations**: Create, read, update, and delete blog posts.
- **Category Filtering**: Filter blog posts by categories.
- **Responsive Design**: The application is designed to be responsive and user-friendly across different devices.
- **Error Handling**: Informative messages are displayed for various actions like errors or empty categories.

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **Database**: SQLite (for development) and PostgreSQL (for deployment)
- **Authentication**: Flask-Login
- **Password Hashing**: bcrypt
- **Deployment**: Render

## Installation

### Prerequisites

- Python 3.8 or higher
- Flask
- Flask-SQLAlchemy
- Flask-Login
- bcrypt

### Setup

1. **Clone the Repository**

   ```bash
   git clonehttps://github.com/mistakelly/Inkwell
   ```

2. **Create a Virtual Environment**

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set Up the Database**

   ```bash
   flask db upgrade
   ```

5. **Run the Application**

   ```bash
   flask run
   ```

   The application will be available at `http://127.0.0.1:5000`.

   Debug is set to false, you can switch this on for development purpose.

## Deployment

The application is deployed on Render. Here’s a link to the live application: [Inkwell on Render](https://inkwell-u0yt.onrender.com/home).

## Usage

1. **Sign Up / Log In**: Create an account or log in to start managing your blog posts.
2. **Create a Post**: Use the "New Post" button to create a new blog post.
3. **Edit / Delete Posts**: Manage your posts by editing or deleting them from your dashboard.
4. **Filter by Category**: Use the category filters to view posts by specific categories.

## Project Structure

- **`/flaskblog`**: Contains the Flask application code.
  - **`/models`**: Database models for the application.
  - **`/routes`**: Flask routes for handling requests.
  - **`/templates`**: Jinja2 templates for rendering HTML.
  - **`/static`**: Static files (CSS, JavaScript, images).
- **`requirements.txt`**: Python package dependencies.
- **`run.py`**: Entry point for running the Flask application.

## Known Issues

- **Performance**: The free plan on Render may result in slight delays in response times.
- **Feature Limitations**: Some advanced features may be limited due to deployment constraints.

## Contribution

If you would like to contribute to this project, please fork the repository and submit a pull request. All contributions are welcome!


## Acknowledgments

- **ALX**: For providing the opportunity to work on this specialization project.
- **Flask Documentation**: For the comprehensive guides and references.
- **Render**: For providing free hosting services.
