const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../helpers/errorHandler');

class Controller {
    static async getAll(req, res, next) {
        try {
            const data = await User.find();
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    static async createUser(req, res, next) {
        console.log(req.body, 'body');
        const userData = {
            username: req.body.username,
            displayName: req.body.displayName
                ? req.body.displayName
                : req.body.username,
            password: req.body.password,
            position: req.body.position,
            email: req.body.email
                ? req.body.email
                : `${req.body.username}@bpjsketenagakerjaan.go.id`,
            access: {
                claim: {
                    create: req.body.access.claim.create | false,
                    read: req.body.access.claim.read | false,
                    update: req.body.access.claim.update | false,
                },
                bpu: {
                    create: req.body.access.bpu.create | false,
                    read: req.body.access.bpu.read | false,
                    update: req.body.access.bpu.update | false,
                },
                mppa_pk: {
                    create: req.body.access.mppa_pk.create | false,
                    read: req.body.access.mppa_pk.read | false,
                    update: req.body.access.mppa_pk.update | false,
                },
            },
        };
        const newUser = new User(userData);
        try {
            const savedData = await newUser.save();
            res.status(200).json({
                success: true,
                data: savedData,
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (user) {
                const isValid = await bcrypt.compare(
                    req.body.password,
                    user.password,
                );
                if (isValid) {
                    let token = jwt.sign(
                        {
                            id: user._id,
                        },
                        process.env.JWT_SECRET,
                    );
                    res.json({
                        status: 'success',
                        token,
                    });
                } else {
                    throw new ErrorHandler(400, 'wrong username/password');
                }
            } else {
                throw new ErrorHandler(404, 'user not found');
            }
        } catch (err) {
            next(err);
        }
    }

    static async getProfile(req, res, next) {
        try {
            console.log(req.loggedUser, 'xxxxx');
            const user = await User.findById(req.loggedUser.id);
            if (user) {
                res.json(user);
            } else {
                throw new ErrorHandler(401, 'unauthorized');
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = Controller;
