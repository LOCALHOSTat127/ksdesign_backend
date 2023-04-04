import express from "express";

const communicationRouter =  express.Router();
// importing controllers
import CommunicationController from "../../Controllers/communication/communicationCntrl.js";


// communication-routes
communicationRouter.route("/small_contact_query").post(CommunicationController.SM_CUSTOMER_CONTACT_FORM);
communicationRouter.route('/full_contact_query').post(CommunicationController.FULL_CUSTOMER_CONTACT_FORM);
communicationRouter.route('/new_order_self_mail').post(CommunicationController.NEW_ORDER_SELF_MAIL);
communicationRouter.route('/new_order_self_wsp').post(CommunicationController.NEW_ORDER_SELF_WSP);
communicationRouter.route('new_order_customer_mail').post(CommunicationController.NEW_ORDER_CUSTOMER_MAIL);


export default communicationRouter;

