import datebase_Controller from "../firebasedb/dbController.js";
import * as dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();

export default class PaymentController {
  static process_new_order = async (req, res) => {
    let respons = await datebase_Controller.create_new_order(req.body);

    if (respons.status !== 200) {
      res.status(200).json({
        status: 500,
        msg: "Try After some time.",
      });
      return false;
    } else {
      res.json({
        status: 200,
        txt: "ok",
      });

      return true;
    }
  };
}
