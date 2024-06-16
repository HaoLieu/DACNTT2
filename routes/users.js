const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');


/**
 * @swagger
 * tags: 
 *  name: Auth
 *  description: User Authentication
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user with email and password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User registered successfully
 *       401:
 *         description: User registration failed
 */
router.post('/register', async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = new User({email});
        await User.register(user, password);
        res.status(200).json({
            message: "user registered"
        })
    } catch (error) {
        res.status(401).json({error: error.message})
    }
})

/**
 * @swagger
 * tags: 
 *  name: Auth
 *  description: User Authentication
 * /api/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user and starts a session.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Login failed
 *       500:
 *         description: Internal server error
 */
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error', error: err });
        }
        if (!user) {
            return res.status(401).json({ message: 'Login failed', reason: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error logging in', reason: err.message });
            }
            // Successful login
            return res.status(200).json({
                message: 'Login successful',
                user: {
                    email: user.email,
                    password: user.password
                    // You can add more details you want to send back here
                }
            });
        });
    })(req, res, next);
});

/**
 * @swagger
 * tags: 
 *  name: Auth
 *  description: User Authentication
 * /api/logout:
 *   get:
 *     summary: Logout a user
 *     description: Ends the user's session.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       500:
 *         description: Failed to log out
 */
router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            // Handle the error case
            return res.status(500).json({
                status: false,
                message: "Failed to log out due to an internal error."
            });
        }
        // Successfully logged out
        res.status(200).json({
            status: true,
            message: "Logged out successfully."
        });
    });
});

module.exports = router;