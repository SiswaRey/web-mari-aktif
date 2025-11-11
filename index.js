const express = require('express');

const app = express();
const port = 3000;


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/utama.html');
});

app.get('/public/:file', (req, res) => {
    const file = req.params.file;
    res.sendFile(__dirname + '/public/' + file);''
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});