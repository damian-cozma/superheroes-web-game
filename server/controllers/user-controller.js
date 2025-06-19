const { parseJSON } = require('../utils/body-parser');
const userService   = require('../services/user-service');


async function register(req, res) {
    try {
        const data = await parseJSON(req);
        const user = await userService.register(data);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
    } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
    }
}

async function login(req, res) {
    try {
        const data      = await parseJSON(req);
        const { token } = await userService.login(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ token }));
    } catch (err) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
    }
}

async function profile(req, res) {
    try {
        if (req.method === 'GET') {
            const user = await userService.getProfile(req.userId);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(user));
        }
        if (req.method === 'PUT') {
            const data    = await parseJSON(req);
            const updated = await userService.updateProgress(req.userId, data);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(updated));
        }

        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
    } catch (err) {
        const status = err.message === 'User not found' ? 404 : 400;
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
    }
}

module.exports = {
    register,
    login,
    profile
};
