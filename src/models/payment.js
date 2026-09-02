const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref:'User'
    },
    orderId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true

    }, currency: {
        type: String,
        required: true
    },
    notes: {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        }, email: {
            type: String,
        },
        plan: {
            type: String,
        }
    }, 
    status: {
        type: String,
        required: true
    },
     receipt: {
        type: String,
    },
}, { timestamps: true })

const paymentModel = mongoose.model("Payments", paymentSchema);
module.exports = paymentModel;