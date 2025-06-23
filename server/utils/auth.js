
const { verify } = require('./jwt');
function check(req, res, next) {
    const h = req.headers.authorization || '';
    if (!h.startsWith('Bearer ')) {
        res.writeHead(401,{'Content-Type':'application/json'});
        return res.end(JSON.stringify({ error: 'Missing token' }));
    }
    try {
        const payload = verify(h.slice(7));
        req.userId = payload.userId;
        req.isAdmin = payload.isAdmin;
        return next();
    } catch {
        res.writeHead(401,{'Content-Type':'application/json'});
        return res.end(JSON.stringify({ error: 'Invalid token' }));
    }
}

function requireAdmin(req, res, next) {
    check(req, res, () => {
        if (!req.isAdmin) {
            res.writeHead(403, { 'Content-Type':'application/json' });
            return res.end(JSON.stringify({ error: 'Forbidden' }));
        }
        next();
    });
}

module.exports = { check, requireAdmin };
