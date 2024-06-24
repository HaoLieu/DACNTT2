const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice');

/**
 * @swagger
 * components:
 *   schemas:
 *     InvoiceItem:
 *       type: object
 *       required:
 *         - name
 *         - quantity
 *         - price
 *         - sum
 *       properties:
 *         name:
 *           type: string
 *         quantity:
 *           type: number
 *           minimum: 1
 *         price:
 *           type: number
 *         sum:
 *           type: number
 *     Invoice:
 *       type: object
 *       required:
 *         - items
 *         - date
 *         - time
 *         - subtotal
 *         - discount
 *         - total
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/InvoiceItem'
 *         date:
 *           type: string
 *         time:
 *           type: string
 *         subtotal:
 *           type: number
 *         discount:
 *           type: number
 *           default: 0
 *         total:
 *           type: number
 */


/**
 * @swagger
 * tags: 
 *  name: Invoices
 *  description: Invoices management API 
 * /api/invoice/getAllInvoices:
 *   get:
 *     summary: Retrieve all invoices
 *     description: Fetches all invoices from the database.
 *     tags: [Invoices]
 *     responses:
 *       200:
 *         description: A list of invoices.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Invoice'
 *       500:
 *         description: Error retrieving invoices.
 */
router.get('/getAllInvoices', async (req, res) => {
  try {
    // Fetch all invoices and populate the 'food' field to get details from the Food collection
    const invoices = await Invoice.find()
    res.json(invoices);  // Send the invoices with food names as a JSON response
  } catch (error) {
    console.error(error);  // Log any errors to the console
    res.status(500).json({ message: "Error retrieving invoices" });
  }
});



/**
 * @swagger
 * tags: 
 *  name: Invoices
 *  description: Invoices management API 
 * /api/invoice/getInvoiceById/{id}:
 *   get:
 *     summary: Retrieve an invoice by ID
 *     description: Fetches an invoice by its ID.
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the invoice to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       404:
 *         description: Invoice not found.
 *       500:
 *         description: Error retrieving the invoice.
 */
router.get('/getInvoiceById/:id', async (req, res) => {
    try {
      const { id } = req.params;  
      const invoice = await Invoice.findById({_id: id})
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(invoice);  
    } catch (error) {
      console.error(error);  
      res.status(500).json({ message: "Error retrieving invoice" });
    }
});


// POST endpoint to create a new invoice
/**
 * @swagger
 * tags: 
 *  name: Invoices
 *  description: Invoices management API 
 * /api/invoice/createInvoice:
 *   post:
 *     summary: Create a new invoice
 *     description: Creates a new invoice with the provided data.
 *     tags: [Invoices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Invoice'
 *     responses:
 *       201:
 *         description: Invoice created successfully.
 *       400:
 *         description: Error in creating the invoice.
 */
router.post('/createInvoice', async (req, res) => {
    const { items, date, time, subtotal, discount, total } = req.body;
    try {
        const newInvoice = new Invoice({
            items,
            date,
            time,
            subtotal,
            discount,
            total
        });

        await newInvoice.save();
        res.status(201).send(newInvoice);
    } catch (error) {
        res.status(400).send(error);
    }
});


/**
 * @swagger
 * tags: 
 *  name: Invoices
 *  description: Invoices management API 
 * /api/invoice/updateInvoiceDateTime/{id}:
 *   put:
 *     summary: Update invoice date and time
 *     description: Updates the date and time of an existing invoice.
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the invoice to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 example: '2024-06-16'
 *               time:
 *                 type: string
 *                 example: '14:00'
 *     responses:
 *       200:
 *         description: Invoice updated successfully.
 *       404:
 *         description: Invoice not found.
 *       500:
 *         description: Error updating the invoice.
 */
router.put('/updateInvoiceDateTime/:id', async (req, res) => {
    const { id } = req.params; 
    console.log(req.body);
    const { date, time } = req.body; 
    try {
      const updatedInvoice = await Invoice.findByIdAndUpdate(
        id,
        { $set: { date, time } },
        { new: true, runValidators: true }  
      );

      if (!updatedInvoice) {
        return res.status(404).json({ message: "Invoice not found" }); 
      }

      res.json(updatedInvoice);
    } catch (error) {
      console.error(error); 
      res.status(500).json({ message: "Error updating invoice" }); 
    }
});


/**
 * @swagger
 * tags: 
 *  name: Invoices
 *  description: Invoices management API
 * /api/invoice/deleteInvoiceById/{id}:
 *   delete:
 *     summary: Delete an invoice by ID
 *     description: Deletes an invoice using its ID.
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the invoice to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice deleted successfully.
 *       404:
 *         description: Invoice not found.
 */
router.delete('/deleteInvoiceById/:id', async (req, res) => {
    try {
        const { id } = req.params;  
        const invoice = await Invoice.findByIdAndDelete(id); 
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" }); 
        }
        res.json({ message: "Invoice deleted successfully" }); 
    } catch (error) {
        console.error(error);  // Log any errors to the console
        res.status(500).json({ message: "Error deleting invoice" }); 
    }
});

module.exports = router;