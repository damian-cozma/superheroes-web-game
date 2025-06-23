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

async function updateBestScore(req, res) {
    try {
        const data = await parseJSON(req);
        console.log('Body:', data);
        console.log('UserId:', req.userId);
        const { score } = data;
        const updated = await userService.updateBestScore(req.userId, score);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: updated }));
    } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
    }
}

async function getLeaderboardJson(req, res) {
    try {
        const top = await userService.getLeaderboard(10);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(top));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
    }
}

function formatRssDate(date) {
    return new Date(date).toUTCString();
}

async function getLeaderboardRss(req, res) {
    try {
        const top = await userService.getLeaderboard(10);
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<rss version="2.0">\n<channel>\n`;
        xml += `<title>Top Players</title>\n`;
        xml += `<link>http://${req.headers.host}/leaderboard</link>\n`;
        xml += `<description>Top 10 jucători în funcţie de scor</description>\n`;

        for (const u of top) {
            xml += `<item>\n`;
            xml += `  <title>${u.username} — ${u.best_score}m</title>\n`;
            xml += `  <link>http://${req.headers.host}/user/${u.id}</link>\n`;
            xml += `  <pubDate>${formatRssDate(Date.now())}</pubDate>\n`;
            xml += `  <description>Scor: ${u.best_score} metri</description>\n`;
            xml += `</item>\n`;
        }

        xml += `</channel>\n</rss>`;
        res.writeHead(200, { 'Content-Type': 'application/rss+xml; charset=UTF-8' });
        res.end(xml);
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error generating RSS feed');
    }
}

async function promoteUser(req, res) {
    try {
        const data = await parseJSON(req);
        const { username } = data;
        await userService.promoteToAdmin(username);
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({ success: true }));
    } catch (err) {
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end(JSON.stringify({ error: err.message }));
    }
}

async function deleteUser(req, res) {
    try {
        const data = await parseJSON(req);
        const { username } = data;
        await userService.deleteUser(username);
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({ success: true }));
    } catch (err) {
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end(JSON.stringify({ error: err.message }));
    }
}

module.exports = {
    register,
    login,
    profile,
    updateBestScore,
    getLeaderboardJson,
    getLeaderboardRss,
    formatRssDate,
    promoteUser,
    deleteUser
};
