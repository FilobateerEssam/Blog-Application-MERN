const express = require('express');

const connectToDb = require('./Config/connectToDb');
require('dotenv').config();

connectToDb();

// Init App

const app = express();

// Init Middleware

app.use(express.json()); // to Know Jason file

// Routes

app.use('/api/auth',require('./routes/authRoute'));
app.use('/api/users',require('./routes/usersRoute'));
app.use('/api/posts',require('./routes/postsRoute'));
app.use('/api/comments',require('./routes/commentsRoute'));

// Runnig Server

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is Running on PORT ${PORT} ${process.env.NODE_ENV} `));