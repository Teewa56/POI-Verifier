const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const http = require('http');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['POST', 'GET', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));
app.use(cookieParser());

app.get('/', (req, res) => {
    try {
        res.status(200).json({message: 'Happy Hacking!'})
    } catch (error) {
        res.status(500).json({message: 'Error occured from the backend'})
    }
});

connectDB()
    .then(() => {
        const server = http.createServer(app);
        server.listen(8000, () => {
            console.log(`Server is listening at port 8000`)
        })
    })
    .catch((error) => {
        console.log('Error', error)
    });