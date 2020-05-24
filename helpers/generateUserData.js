module.exports = function generateUserData(body) {
    const userData = {
        username: body.username,
        display_name: body.display_name ? body.display_name : body.username,
        password: body.password,
        email: body.email,
        is_active: body.is_active ? body.is_active : true,
        created: new Date(),
    };
    return userData;
};
