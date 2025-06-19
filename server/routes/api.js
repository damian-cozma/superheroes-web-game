const url            = require('url');
const usersCtrl      = require('../controllers/user-controller');
const { check }      = require('../utils/auth');

async function handleApi(req, res) {
    const { pathname } = url.parse(req.url);


    if (req.method === 'POST' && pathname === '/api/user/register') {
        return usersCtrl.register(req, res);
    }
    if (req.method === 'POST' && pathname === '/api/user/login') {
        return usersCtrl.login(req, res);
    }

    if (pathname.startsWith('/api/user')) {
        return check(req, res, () => {
            if (req.method === 'GET' && pathname === '/api/user/profile') {
                return usersCtrl.profile(req, res);
            }
            if (req.method === 'PUT' && pathname === '/api/user/profile') {
                return usersCtrl.profile(req, res);
            }

            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Not found' }));
        });
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'API endpoint not found' }));
}

module.exports = handleApi;
