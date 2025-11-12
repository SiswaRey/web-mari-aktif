const express = require('express');
const { route } = require('./api.js');
const fs = require('fs');

const app = express();
const port = 3000;

function prosesHalaman(file) {
    let data = fs.readFileSync(__dirname + '/pages/' + file + '.html', { encoding: 'utf8' });
    
    if (data.toString().includes('<komponen navbar></komponen>')) {
        data = data.replaceAll('<komponen navbar></komponen>', fs.readFileSync(__dirname+'/pages/komponen/navbar.komponen.html', { encoding: 'utf8' }));
    }

    console.log(data)
    return data
}

app.use("/api", route)

app.get('/', (req, res) => {
    res.send(prosesHalaman('utama'))
});

app.get('/public/:file', (req, res) => {
    const file = req.params.file;
    res.sendFile(__dirname + '/public/' + file);''
});


app.get("/daftar", (req, res) => {
    res.sendFile(__dirname + "/pages/daftar.html")
})

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/pages/login page.html")
})

app.get("/pertemanan", (req, res) => {
    res.send(prosesHalaman('pertemanan'))
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});