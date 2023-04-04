import express from "express";
import Razorpay from "razorpay";
import * as dotenv from "dotenv";
dotenv.config();

export default class PaymentController {
    static PAYMENT_GATEWAY_INSTANCE = new Razorpay({
        key_id: process.env.SERVER_RAZORPAY_TEST_API_KEY_ID,
        key_secret: process.env.SERVER_RAZORPAY_TEST_API_KEY_SECRET,
    });


    static createNewOrder = async (req, res) => {
        const payment_config = {
            amount : req.body?.amount || null,
            currency : req.body?.currency || null,
            receipt_id : req.body?.receipt || null  
        } 
      

        const Payment_Obj = await this.PAYMENT_GATEWAY_INSTANCE.orders.create({
            amount: 50000,
            currency: payment_config.currency,
            receipt : payment_config.receipt_id,
        })

        console.log(Payment_Obj);
        res.status(200).json(Payment_Obj);
        return;
    }
}