import datebase_Controller from "../firebasedb/dbController.js";
import Razorpay from "razorpay";
import * as dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();

export default class PaymentController {

    static __DEV__ = true;

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
    static verifyPayment = async (req, res) => {
        // extracting payment response
        const payment_response = {
            payment_id: req.body.ad_config.payment_configuration.captured_payment?.payment_id || null,
            order_id: req.body.ad_config.payment_configuration.captured_payment?.order_id || null,
            signature: req.body.ad_config.payment_configuration.captured_payment?.signature || null,
        }


        // cooking-payment-signature-hash
        const hmac = crypto.createHmac('sha256', process.env.SERVER_RAZORPAY_TEST_API_KEY_SECRET);
        hmac.update(payment_response.order_id + "|" + payment_response.payment_id);
        let signature_digest = this.__DEV__ ? payment_response.signature : hmac.digest('hex');


        // if-hash-matches : create order in db,return payment_id as order_id
        if (signature_digest === payment_response.signature) {
            await datebase_Controller.create_new_order(req.body.ad_config);
            res.status(200).json({
                status: true,
                orderID: req.body.ad_config.payment_configuration.captured_payment.payment_id
            })
            return 0;
        } else {
            // else-return : payment_id,status false
            res.status(400).json({
                status: false,
                orderID: req.body.ad_config.payment_configuration.captured_payment.payment_id
            })
            return 0;
        }
    }


    // validate_payment_status
    static validate_payment_status = async (req, res) => {

        let orderID = req.body?.orderID ? req.body?.orderID : null;

        if (orderID === null) {
            res.status(200).json({
                status: 404,
                msg: "Order Not Found",
            })
            return 0;
        }

        let order_response = await datebase_Controller.get_order_by_id(req.body?.orderID);

        if (order_response != null || order_response != undefined) {
            res.status(200).json({
                status: 200,
                msg: "Order Found",
                is_order_verified: order_response.isOrderVerified,
                is_order_confirmation_done: order_response.isConfirmationDone,
                is_order_active: order_response.isOrderActive,
            });
        } else {
            res.status(200).json({
                status: 404,
                msg: "Order Not Found",
            })
        }
    }
}