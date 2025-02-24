// Create web server
const http = require('http');
const fs = require('fs');
const path = require('path');

// Load the comments from the file
const comments = JSON.parse(fs.readFileSync('comments.json', 'utf8'));

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/comments') {
        // Read the body of the request
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // Save the comments to the file
        req.on('end', () => {
            comments.push(JSON.parse(body));
            fs.writeFileSync('comments.json', JSON.stringify(comments));
            res.end('Comment added');
        });
    } else if (req.method === 'GET' && req.url === '/comments') {
        // Return the comments
        res.end(JSON.stringify(comments));
    } else {
        // Serve the static files
        const filePath = path.join(__dirname, req.url);
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 404;
                res.end('Not Found');
            } else {
                res.end(data);
            }
        });
    }
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});