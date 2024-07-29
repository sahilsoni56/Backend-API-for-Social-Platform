Overview
Welcome to the backend code for our social platform API! This application is designed to handle user authentication, profile management, and post interactions. Built with Express.js, JWT for authentication, and Multer for file uploads, this API is both robust and scalable. 🌟

Features
  🔐 User Registration & Authentication: Secure user sign-up and login with JWT-based session management.
  👤 Profile Management: Users can update their profiles and upload profile images.
  📝 Post Creation & Management: Create, update, and manage user posts.
  ❤️ Like/Unlike Posts: Toggle likes on posts.
  📄 Dynamic Rendering: Use EJS templates to render dynamic content.
Technologies
  🖥️ Programming Language: JavaScript
  🔧 Framework: Express.js
  📦 Database: MongoDB
  🔑 Authentication: JSON Web Token (JWT)
  📸 File Uploads: Multer
  🔒 Password Hashing: bcrypt

Folder Structure:-
  ->/models
  ->/public
  /images
    /uploads
  ->/views


Usage
API Endpoints
        GET / - Renders the home page 🏠
        GET /login - Renders the login page 🔑
        GET /upload - Renders the upload page 📸
        GET /profile - Renders the user profile page 👤
        GET /edit/:id - Renders the post edit page ✏️
        POST /register - Registers a new user 📝
        POST /login - Logs in a user and sets a JWT cookie 🍪
        POST /upload - Uploads a profile image 📤
        POST /post - Creates a new post 🆕
        POST /update/:id - Updates an existing post ✏️
        GET /like/:id - Likes or unlikes a post ❤️/👎
        GET /logout - Logs out a user and clears the JWT cookie 🚪
Middleware
        isLoggedIn: Middleware to check if the user is logged in by verifying the JWT token. 🔒

