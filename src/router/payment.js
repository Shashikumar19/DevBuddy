const express = require('express');
const paymentRouter = express.Router();
const razorpayInstance = require('../utils/razorpay');
const { userAuth } = require('../middleware/auth');
const paymentModel = require('../models/payment');
const { planCost } = require('../utils/constant');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const { User } = require('../models/user');



paymentRouter.post('/payment/order', userAuth, async (req, res) => {

    try {
        const user = req.user;
        const { plan } = req.body;

        const options = {
            amount: planCost[plan] * 100,
            currency: "INR",
            receipt: "order_rcptid_11",
            notes: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                plan: plan
            },
        }

        const order = await razorpayInstance.orders.create(options);

        const orderSave = new paymentModel({
            userId: user._id,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            status: order.status,
            notes: order.notes
        })
        const savedOrder = await orderSave.save()

        res.json({ message: "Order created successfully", order: { ...savedOrder.toJSON(), keyId: process.env.RAZORPAY_KEY_ID } })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

paymentRouter.post('/payment/webhook', async (req, res) => {


    try { // validatesignature for webhook
        const webhookSignature = req.get("X-Razorpay-Signature")
        const isvalidWebhook = validateWebhookSignature(JSON.stringify(req.body), webhookSignature, process.env.WEBHOOK_SECRET)
        console.log("webhookSignature", webhookSignature)
        if (!isvalidWebhook) {
            return res.status(400).json({ message: 'Invalid webhook' })
        }
        if (req.body.event === "payment.captured") {
            console.log("Success")
        }
        if (req.body.event === "payment.failed") {
            console.log("failed")
        }

        // updated the payment status

        const webhookData = req.body.payload.payment.entity;
        const payment = await paymentModel.findById(webhookData.order_id);
        payment.status = webhookData.status;
        await payment.save();
        console.log("paymentupdatd", payment)
        // update the user as premium and its plan
        const updateUser = await User.findById(payment.userId);
        updateUser.isPremium = true;
        updateUser.membershipType = payment.notes.plan;
        const user = await updateUser.save();
        console.log("userupdated", user)
        // return 200 response to razorpay
        return res.status(200).json({ message: 'payment details updated sucessfully' })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }

})

paymentRouter.get('/payment/verify', userAuth, (req, res) => {

    try {
        const user = req.user.toJSON();

        if (user.isPremium) {
            return res.json({ isPremium: true })
        }
        return res.json({ isPremium: false })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }

})
module.exports = paymentRouter;