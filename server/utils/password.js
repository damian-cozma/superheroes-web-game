const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
async function hashPassword(pw) {
    return bcrypt.hash(pw, SALT_ROUNDS);
}
async function comparePassword(pw, hash) {
    return bcrypt.compare(pw, hash);
}
module.exports = { hashPassword, comparePassword };
