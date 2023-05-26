import express from "express";

const paymentRouter = express.Router();

// importing controllers
import PaymentController from "../../Controllers/Razorpay/paymentController.js";


// Payment-router
paymentRouter.route('/create_new_order').post(PaymentController.process_new_order);
export default paymentRouter;