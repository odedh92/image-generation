const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
require('dotenv').config()
const OpenAIApi = require("openai");
const fs = require('fs')
const multer = require('multer')


const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'public')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})


const upload = multer({ storage: storage }).single('file')
let filePath = ''

const openai = new OpenAIApi({
    apiKey: process.env.API_KEY
});
app.post('/images', async (req, res) => {
    try {
        const response = await openai.images.generate({
            prompt: req.body.message,
            n: 10,
            size: "1024x1024"
        })
        res.send(response.data)
    } catch (error) {
        console.log(error);
    }
})

app.post('/upload', async (req, res) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        filePath = req.file.path
    })
})
app.post('/variations', async (req, res) => {
    try {
        const readStream = fs.read(filePath);
        const response = await openai.images.createVariation(
            readStream, 
            10,
            '1024x1024'
        );
        res.json(response.data['url']);
    } catch (error) {
        console.error('General error:', error);
        res.status(500).json({ error: 'General error' });
    }
});



app.listen(PORT, () => console.log('The server is running'))


