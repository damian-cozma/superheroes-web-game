require('dotenv').config();

const db = require('./db/postgres');
db.query('SELECT NOW()', [], (err, result) => {
    if (err) {
        console.error('DB connection test failed:', err);
    } else {
        console.log('DB connected at:', result.rows[0].now);
    }
});

const http = require('http');
const fs   = require('fs');
const path = require('path');

const handleApi = require('./routes/api');

const PORT       = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '..');

const MIME_TYPES = {
    '.html': 'text/html',
    '.js':   'application/javascript',
    '.css':  'text/css',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.mp3':  'audio/mpeg',
    '.json': 'application/json',
    '.svg':  'image/svg+xml; charset=utf-8',
    '.ico':  'image/x-icon',
};

http.createServer((req, res) => {

    if (req.url.startsWith('/api/')) {
        return handleApi(req, res);
    }

    const requestPath = req.url === '/' ? '/index.html' : req.url;
    const filePath    = path.join(PUBLIC_DIR, requestPath);
    const ext         = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('404 Not Found');
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
})
    .listen(PORT, () => {
        console.log(`Server is running at http://localhost:3001`);
    });

