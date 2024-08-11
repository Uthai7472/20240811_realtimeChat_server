

const protectedTest = async (req, res) => {
    const user = req.user;

    return res.status(200).json({
        message: 'Welcome to the Protected Route',
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            permission: user.permission
        }
    });
};

module.exports = { protectedTest };