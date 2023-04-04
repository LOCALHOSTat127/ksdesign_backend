import express from "express";
import Razorpay from "razorpay";
import * as dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();

export default class PaymentController {
    static PAYMENT_GATEWAY_INSTANCE = new Razorpay({
        key_id: process.env.SERVER_RAZORPAY_TEST_API_KEY_ID,
        key_secret: process.env.SERVER_RAZORPAY_TEST_API_KEY_SECRET,
    });


    static createNewOrder = async (req, res) => {
        const payment_config = {
            amount: req.body?.amount || null,
            currency: req.body?.currency || null,
            receipt_id: req.body?.receipt || null
        }


        const Payment_Obj = await this.PAYMENT_GATEWAY_INSTANCE.orders.create({
            amount: 50000,
            currency: payment_config.currency,
            receipt: payment_config.receipt_id,
        })

        res.status(200).json(Payment_Obj);
        return;
    }


    // verify-payment
    static verifyPayment = (req, res) => {
        const payment_data = {
            payment_id: req.body.razorpay_payment_id ? req.body.razorpay_payment_id : null,
            order_id: req.body.razorpay_order_id ? req.body.razorpay_order_id : null,
            signature: req.body.razorpay_signature ? req.body.razorpay_signature : null
        }

        if (payment_data.payment_id === null || payment_data.order_id === null || payment_data.signature === null) {
            res.status(400).json({
                status: 400,
                status_txt: "all feilds required."
            })
            return;
        }

        let sig_body = (payment_data.order_id + "|" + payment_data.payment_id);
        let signature_digest = crypto.createHmac('sha256', process.env.SERVER_RAZORPAY_TEST_API_KEY_SECRET).update(sig_body.toString()).digest('hex');

        
        if (payment_data.signature === signature_digest) {
            res.status(200).json({
                status: 200,
                status_txt: "Valid Payment OK"
            })
            return;
        } else {
            res.status(400).json({
                status: 400,
                status_txt: "Invalid Payment"
            })
            return;
        }


    }
}