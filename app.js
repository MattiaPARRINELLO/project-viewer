// setup express app
const express = require('express');
const app = express();

// setup fs
const fs = require('fs');
const path = require('path');


// setup public folder
app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.static('files'))

// setup body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// const ejs = require('ejs');
// app.set('view engine', 'ejs');
// app.engine('html', require('ejs').renderFile);


//setup base route
app.get('/projets', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/projets/getFile/:file', (req, res) => {
    const requestedFile = req.params.file
    const filePath = path.join(__dirname, 'views', requestedFile);

    if (fs.existsSync(filePath)) {
        const stat = fs.lstatSync(filePath)
        if (stat.isFile()) {
            res.sendFile(filePath)
        }
    }
})

// setup route to reads manifests.json file
app.get('/projets/get-manifests', (req, res) => {
    // -files
    //     |
    //     |- unknown
    //     |   |
    //     |   |- manifest.json
    //     |- unknown2
    //        |- manifest.json
    //

    // read all the manifests.json files in the files folder
    const files = fs.readdirSync(path.join(__dirname, 'files'));
    const manifests = [];
    files.forEach(file => {
        const filePath = path.join(__dirname, 'files', file, 'manifest.json');
        if (fs.existsSync(filePath)) {
            const manifest = JSON.parse(fs.readFileSync(filePath));
            manifests.push(manifest);
        }
    });
    // send the manifests.json files as response
    res.json(manifests);
});

// render anything in the files folder even if it is in sub (sub)folders
app.get('/projets/files/:path(*)', (req, res) => {
    const requestedPath = req.params.path;
    const filePath = path.join(__dirname, 'files', requestedPath);

    if (fs.existsSync(filePath)) {
        const stat = fs.lstatSync(filePath);

        if (stat.isFile()) {
            res.sendFile(filePath);
        } else if (stat.isDirectory()) {
            // 👉 Si l'URL n'a pas de slash à la fin, on redirige vers URL avec slash
            if (!req.path.endsWith('/')) {
                return res.redirect(301, req.path + '/');
            }

            const indexPath = path.join(filePath, 'index.html');
            if (fs.existsSync(indexPath)) {
                // 👉 Et si y'a un index.html, redirige vers lui
                return res.redirect(302, req.path + 'index.html');
            } else {
                res.status(403).send('No index.html found in folder');
            }
        } else {
            res.status(400).send('Invalid path');
        }
    } else {
        res.status(404).send('File not found');
    }
});







//start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

