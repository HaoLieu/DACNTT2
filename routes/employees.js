const express = require('express');
const router = express.Router();
const Employee = require('../models/employee'); 


/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - phoneNumber
 *         - roleId
 *         - dateOfBirth
 *         - createdDate
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the employee
 *         name:
 *           type: string
 *           description: Name of the employee
 *         address:
 *           type: string
 *           description: Home address of the employee
 *         phoneNumber:
 *           type: string
 *           description: Contact phone number
 *         roleId:
 *           type: string
 *           description: ID of the role associated with the employee
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Date of birth of the employee
 *         createdDate:
 *           type: string
 *           format: date
 *           description: Date when the employee was created
 */


// Create Employee
/**
 * @swagger
 * /api/employees/createEmployee:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - phoneNumber
 *               - roleId
 *               - dateOfBirth
 *               - createdDate
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               roleId:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *               createdDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       500:
 *         description: Failed to create employee
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 * */
router.post('/createEmployee', async (req, res) => {
    const { name, address, phoneNumber, roleId, dateOfBirth, createdDate } = req.body;

    try {
        const newEmployee = new Employee({
            name,
            address,
            phoneNumber,
            roleId,
            dateOfBirth,
            createdDate
        });
        await newEmployee.save();
        res.status(201).json({
            message: "Employee created successfully",
            employee: newEmployee
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to create employee", error: error.message });
    }
});

// Get All Employees
/**
 * @swagger
 * /api/employees/getAllEmployees:
 *   get:
 *     summary: Retrieve a list of all employees
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: A list of employees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 *       500:
 *         description: Failed to retrieve employees
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/getAllEmployees', async (req, res) => {
    try {
        const employees = await Employee.find().populate('roleId');
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve employees", error: error.message });
    }
});

// Get Employee by ID
/**
 * @swagger
 * /api/employees/getEmployeeById/{id}:
 *   get:
 *     summary: Retrieve a single employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The employee id
 *     responses:
 *       200:
 *         description: Employee data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error retrieving employee details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/getEmployeeById/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('roleId');
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving employee details", error: error.message });
    }
});

// Update Employee
/**
 * @swagger
 * /api/employees/updateEmployee/{id}:
 *   put:
 *     summary: Update an employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The employee id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               roleId:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *               createdDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to update employee
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put('/updateEmployee/:id', async (req, res) => {
    const { name, address, phoneNumber, roleId, dateOfBirth, createdDate } = req.body;

    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, {
            name,
            address,
            phoneNumber,
            roleId,
            dateOfBirth,
            createdDate
        }, { new: true, runValidators: true });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json({
            message: "Employee updated successfully",
            employee
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update employee", error: error.message });
    }
});

// Delete Employee
/**
 * @swagger
 * /api/employees/deleteEmployee/{id}:
 *   delete:
 *     summary: Delete an employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The employee id
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to delete employee
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete('/deleteEmployee/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete employee", error: error.message });
    }
});

module.exports = router;