const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Role = require('../models/role');
const passport = require('passport');
const {isLoggedIn, checkPermissions} = require('../middleware');

router.post('/register-dev', async(req, res) => {
    const { email, password, roleName = 'admin' } = req.body;

  try {
    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const newUser = new User({ email, role: role._id });
    User.register(newUser, password, (err, registeredUser) => {
      if (err) {
        return res.status(500).json({ message: "User registration failed", error: err.message });
      }
      res.status(201).json({
        message: "User registered successfully",
        userDetails: {
          email: registeredUser.email,
          role: roleName
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
router.post('/login', passport.authenticate('local'), async (req, res) => {
  try {
      // After successful authentication, populate the role information
      const user = await User.findById(req.user._id).populate('role');
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }
      res.status(200).json({
          message: 'Login successful',
          user: {
              email: user.email,
              role: user.role.name // Assuming 'name' is the field for the role's name in the Role schema
          }
      });
  } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
  }
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
router.post('/register', isLoggedIn, checkPermissions('user', 'create'), async (req, res) => {
    const { email, password, roleName } = req.body;
  
    try {
      const role = await Role.findOne({ name: roleName });
      if (!role) {
        return res.status(400).json({ message: "Invalid role specified" });
      }

      const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use." });
        }
  
      const newUser = new User({ email, role: role._id });
      User.register(newUser, password, (err, registeredUser) => {
        if (err) {
          return res.status(500).json({ message: "User registration failed", error: err.message });
        }
        res.status(201).json({
          message: "User registered successfully",
          userDetails: {
            email: registeredUser.email,
            role: roleName
          }
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


// Get all users
/**
 * @swagger
 * /api/user/getAllUsers:
 *   get:
 *     summary: Get all users
 *     description: Retrieves all registered users.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       404:
 *         description: No users found
 *       500:
 *         description: Internal server error
 */
router.get('/user/getAllUsers', isLoggedIn, checkPermissions('user', 'read'), async (req, res) => {
  try {
      const users = await User.find();
      if (!users) {
          return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json({
          message: "User details retrieved successfully.",
          users
      });
  } catch (error) {
      res.status(500).json({ message: "Error retrieving user details", error: error.message });
  }
});


// Get a user 
/**
 * @swagger
 * /api/user/getUserById/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieves details of a specific user by their unique ID.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/user/getUserById/:id', isLoggedIn, checkPermissions('user', 'read'), async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json({
          message: "User details retrieved successfully.",
          user: {
              email: user.email,
              role: user.role
          }
      });
  } catch (error) {
      res.status(500).json({ message: "Error retrieving user details", error: error.message });
  }
});


// Update User Information and Password
/**
 * @swagger
 * /api/user/updateUser/{id}:
 *   put:
 *     summary: Update user information and password
 *     description: Allows updating a user's email, role, and password.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: New email to update
 *               roleName:
 *                 type: string
 *                 description: New role name to update
 *               newPassword:
 *                 type: string
 *                 description: New password to update
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to update user
 */
router.put('/user/updateUser/:id', isLoggedIn, checkPermissions('user', 'update'), async (req, res) => {
  const { email, roleName, newPassword } = req.body;

  try {
      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }

      // Update email if provided
      if (email) {
          user.email = email;
      }

      // Update role if provided
      if (roleName) {
          const roleExists = await Role.findOne({ name: roleName });
          if (!roleExists) {
              return res.status(400).json({ message: "Role not found. Please provide a valid role name." });
          }
          user.role = roleExists._id;
      }

      // Update password if provided
      if (newPassword) {
          await user.setPassword(newPassword);
          await user.save(); // Save the user after setting password
      } else {
          await user.save(); // Save the user if only role or email is updated
      }

      res.status(200).json({
          message: "User updated successfully.",
          user: {
              email: user.email,
              role: user.role
          }
      });
  } catch (error) {
      res.status(500).json({ message: "Failed to update user", error: error.message });
  }
});


// Delete User
/**
 * @swagger
 * /api/user/deleteUser/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user by their unique ID.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to delete user
 */
router.delete('/user/deleteUser/:id', isLoggedIn, checkPermissions('user', 'delete'), async (req, res) => {
  try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
      res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
});

module.exports = router;