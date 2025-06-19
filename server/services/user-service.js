const userRepo = require('../repositories/user-repository');
const { hashPassword, comparePassword } = require('../utils/password');
const jwt = require('../utils/jwt');

async function register({ username, email, password }) {

    if (await userRepo.findByUsername(username)) {
        throw new Error('Username already taken');
    }

    const password_hash = await hashPassword(password);

    const user = await userRepo.createUser({ username, email, password_hash });
    delete user.password_hash;
    return user;
}

async function login({ username, password }) {
    const user = await userRepo.findByUsername(username);
    if (!user) throw new Error('Invalid credentials');
    const ok = await comparePassword(password, user.password_hash);
    if (!ok) throw new Error('Invalid credentials');

    const token = jwt.sign({ userId: user.id, isAdmin: user.is_admin });
    return { token };
}

async function getProfile(userId) {
    const user = await userRepo.findById(userId);
    if (!user) throw new Error('User not found');
    return user;
}

async function updateProgress(userId, progress) {
    const updated = await userRepo.updateProgress(userId, progress);
    return updated;
}

module.exports = {
    register,
    login,
    getProfile,
    updateProgress
};
