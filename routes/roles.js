const express = require('express');
const router = express.Router();
const Role = require('../models/role');


/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - name
 *         - permissions
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the role
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           description: List of permissions associated with the role
 *       example:
 *         name: Admin
 *         permissions: [user: ["create-user", "read-user", "update-user", "delete-user"], food: ["create-food", "read-food", "update-food", "delete-food"], foodCategory: ["create-foodCategory", "read-foodCategory", "update-foodCategory", "delete-foodCategory"], foodMenu: ["create-foodMenu", "read-foodMenu", "update-foodMenu", "delete-foodMenu"], invoice: ["create-invoice", "read-invoice", "update-invoice", "delete-invoice"], employee: ["create-employee", "read-employee", "update-employee", "delete-employee"], role: ["create-role", "read-role", "update-role", "delete-role"]]
 */

// Create a new role
/**
 * @swagger
 * /api/roles/createRole:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       201:
 *         description: Role created successfully
 *       500:
 *         description: Failure in creating role
 */
router.post('/createRole', async (req, res) => {
  const { name, permissions } = req.body;

  try {
    const newRole = new Role({ name, permissions });
    await newRole.save();
    res.status(201).json({
      message: "Role created successfully",
      roleDetails: newRole
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all roles
/**
 * @swagger
 * /api/roles/getAllRoles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: A list of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       500:
 *         description: Failed to retrieve roles
 */
router.get('/getAllRoles', async (req, res) => {
  try {
    const roles = await Role.find({});
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get role by ID
/**
 * @swagger
 * /api/roles/getRoleById/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The role id
 *     responses:
 *       200:
 *         description: Role data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Role not found
 *       500:
 *         description: Error retrieving role
 */
router.get('/getRoleById/:id', async (req, res) => {
    try {
      const role = await Role.findById({_id: req.params.id});
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      res.status(200).json(role);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Update a role
/**
 * @swagger
 * /api/roles/updateRole/{id}:
 *   put:
 *     summary: Update a role
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The role id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       404:
 *         description: Role not found
 *       500:
 *         description: Failed to update role
 */
router.put('/updateRole/:id', async (req, res) => {
  const { permissions } = req.body;

  try {
    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { $set: { permissions } },
      { new: true }
    );
    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.status(200).json({
      message: "Role updated successfully",
      roleDetails: updatedRole
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a role
/**
 * @swagger
 * /api/roles/deleteRole/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The role id
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 *       500:
 *         description: Failed to delete role
 */
router.delete('/deleteRole/:id', async (req, res) => {
  try {
    const deletedRole = await Role.findByIdAndDelete({_id: req.params.id});
    if (!deletedRole) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.status(200).json({
      message: "Role deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
