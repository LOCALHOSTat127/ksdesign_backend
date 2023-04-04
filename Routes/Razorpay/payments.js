import express from "express";

const paymentRouter = express.Router();

// importing controllers
import PaymentController from "../../Controllers/Razorpay/paymentController.js";


// Payment-router
paymentRouter.route('/create_order').post(PaymentController.createNewOrder);
paymentRouter.route('/verify_payment').post(PaymentController.verifyPayment);


export default paymentRouter;