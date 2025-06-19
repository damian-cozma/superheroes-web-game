function parseJSON(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req
            .on('data', chunk => { body += chunk; })
            .on('end', () => {
                try {
                    const obj = JSON.parse(body);
                    resolve(obj);
                } catch (err) {
                    reject(new Error('Invalid JSON payload'));
                }
            })
            .on('error', err => reject(err));
    });
}

module.exports = { parseJSON };
