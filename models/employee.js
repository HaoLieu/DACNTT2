const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: 'Role',  // Reference to the Role schema
        required: true
    },
    dateOfBirth: {
        type: String,  // Stored as string to avoid dealing with Date objects
        required: true
    },
    createdDate: {
        type: String,  // Stored as string to keep it simple
        required: true
    }
},{
    collection: 'employees'
  });

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;
