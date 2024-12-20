import Communication_Provider from "../../utils/cummonication/Communication.js";
import datebase_Controller from "../firebasedb/dbController.js";
export default class CommunicationController {
  // email_template_configs
  static TEMPLETE_CONFIGS = [
    {
      txt: "A New Customer Query Received",
      subject: "A New Customer Query Received",
      Template_file_name: "fullquery",
      Template_type: "FULL_QUERY",
    },
    {
      txt: "A New Customer Query Received",
      subject: "A New Customer Query Received",
      Template_file_name: "fullquery",
      Template_type: "SMALL_QUERY",
    },
    {
      txt: "New Order Received",
      subject: "New Order Received",
      Template_file_name: "fullquery",
    },
    {
      txt: "This is Text",
      subject: "This is Subject",
      Template_file_name: "file_name",
      Template_type: "NEW_ORDER_CUSTOMER",
    },
    {
      txt: "New Order Query for Radio Adversitement",
      subject: "New Order Query for Radio Adversitement",
      Template_file_name: "radioorder",
      Template_type: "NEW_RADIO_QUERY",
    },
    {
      txt: "New Order Query for Telivision Adversitement",
      subject: "New Order Query for Telivision Adversitement",
      Template_file_name: "tvorder",
      Template_type: "NEW_TV_QUERY",
    },
    {
      txt: "New Order Query for Digital Marketing Adversitement",
      subject: "New Order Query for Digital Marketing Adversitement",
      Template_file_name: "marketingorder",
      Template_type: "NEW_TV_QUERY",
    },
    {
      txt: "New Order Query for Auto/E-Riksha Adversitement",
      subject: "New Order Query for Auto/E-Riksha Adversitement",
      Template_file_name: "fullquery",
      Template_type: "NEW_AUTO_AD_QUERY",
    },
  ];

  static FULL_CUSTOMER_CONTACT_FORM = async (req, res) => {
    const USER_INPUT_DATA = {
      first_name: req.body.first_name || null,
      last_name: req.body.last_name || null,
      phone: req.body.phone || null,
      reason_to_contact: req.body.reason_to_contact || null,
      user_email: req.body.user_email || null,
    };

    // VALIDATING-USER-INPUT
    if (
      USER_INPUT_DATA.first_name === null ||
      USER_INPUT_DATA.first_name.length === 0
    ) {
      res.status(400).json({
        status: 400,
        err_msg: "FirstName is Required",
      });

      return;
    } else if (
      USER_INPUT_DATA.last_name === null ||
      USER_INPUT_DATA.last_name.length === 0
    ) {
      res.status(400).json({
        status: 400,
        err_msg: "LastName is Required",
      });

      return;
    } else if (
      USER_INPUT_DATA.reason_to_contact === null ||
      USER_INPUT_DATA.reason_to_contact === 0
    ) {
      res.status(400).json({
        status: 400,
        err_msg: "Reason to Contact is Required",
      });

      return;
    } else if (
      USER_INPUT_DATA.phone === null ||
      Communication_Provider.isValidPhone(USER_INPUT_DATA.phone) === false
    ) {
      res.status(400).json({
        status: 400,
        err_msg: "Invalid Phone Number",
      });

      return;
    } else if (
      USER_INPUT_DATA.user_email === null ||
      Communication_Provider.verifyEmail(USER_INPUT_DATA.user_email) === false
    ) {
      res.status(400).json({
        status: 400,
        err_msg: "Invalid Email.",
      });
      return;
    }

    const date = new Date();

    // USER-INPU-VALIDATION-SUCCESS-SENDING-EMAIL
    // generating-msg
    const EMAIL_MSG = Communication_Provider.createEmailMSG(
      this.TEMPLETE_CONFIGS[0],
      {
        CONTACT__REASON: USER_INPUT_DATA.reason_to_contact,
        FIRST_NAME: USER_INPUT_DATA.first_name,
        LAST_NAME: USER_INPUT_DATA.last_name,
        EMAIL_ID: USER_INPUT_DATA.user_email,
        MOBILE_NUMBER: USER_INPUT_DATA.phone,
        DATE_OF_CONTACT: `${date.getDate()}-${
          date.getMonth() + 1
        }-${date.getFullYear()}`,
      }
    );

    if (EMAIL_MSG === null) {
      res.status(500).json({
        status: 400,
        err_msg: "Error while creating EmailMSG",
      });
      return;
    }

    // sending-email
    const EMAIL_SUCCESS_CONFIG = await Communication_Provider.sendEmail(
      EMAIL_MSG
    );
    if (EMAIL_SUCCESS_CONFIG.status_code === 200) {
      res.status(EMAIL_SUCCESS_CONFIG.status_code).json({
        status: EMAIL_SUCCESS_CONFIG.status_code,
        msg: EMAIL_SUCCESS_CONFIG.status_msg,
        msg_id: EMAIL_SUCCESS_CONFIG.msg_id,
      });
      return 0;
    } else {
      res.status(EMAIL_SUCCESS_CONFIG.status_code).json({
        status: EMAIL_SUCCESS_CONFIG.status_code,
        err_msg: EMAIL_SUCCESS_CONFIG.status_msg,
      });
      return 0;
    }
  };

  // small-customer-contact-form
  static SM_CUSTOMER_CONTACT_FORM = async (req, res) => {
    const emailID = req.body.emailID;

    if (emailID === null) {
      res.status(200).json({
        status: 404,
        status_txt: "Valid Email ID Required.",
      });
      return false;
    }

    // USER-INPU-VALIDATION-SUCCESS-SENDING-EMAIL
    // generating-msg
    const date = new Date();

    // USER-INPU-VALIDATION-SUCCESS-SENDING-EMAIL
    // generating-msg
    const EMAIL_MSG = Communication_Provider.createEmailMSG(
      this.TEMPLETE_CONFIGS[0],
      {
        CONTACT__REASON: "New Customer Query",
        FIRST_NAME: null,
        LAST_NAME: null,
        EMAIL_ID: emailID,
        MOBILE_NUMBER: null,
        DATE_OF_CONTACT: `${date.getDate()}-${
          date.getMonth() + 1
        }-${date.getFullYear()}`,
      }
    );

    if (EMAIL_MSG === null) {
      res.status(500).json({
        status: 400,
        err_msg: "Error while creating EmailMSG",
      });
      return;
    }

    // sending-email
    const EMAIL_SUCCESS_CONFIG = await Communication_Provider.sendEmail(
      EMAIL_MSG
    );
    if (EMAIL_SUCCESS_CONFIG.status_code === 200) {
      res.status(EMAIL_SUCCESS_CONFIG.status_code).json({
        status: EMAIL_SUCCESS_CONFIG.status_code,
        msg: EMAIL_SUCCESS_CONFIG.status_msg,
        msg_id: EMAIL_SUCCESS_CONFIG.msg_id,
      });
      return true;
    } else {
      res.status(EMAIL_SUCCESS_CONFIG.status_code).json({
        status: EMAIL_SUCCESS_CONFIG.status_code,
        err_msg: EMAIL_SUCCESS_CONFIG.status_msg,
      });
      return true;
    }
  };

  // new_order_mail_self
  static NEW_ORDER_SELF_MAIL = async (req, res) => {
    const orderID = req.body.orderID ? req.body.orderID : null;

    if (orderID === null) {
      res.json({
        status: 404,
        err_msg: "OrderID required!",
      });
      return 0;
    }

    // quering database for order.
    const order_response = await datebase_Controller.get_order_by_id(orderID);

    if (order_response === null || order_response === undefined) {
      res.json({
        status: 404,
        err_msg: "Order Not Found!",
      });
      return 0;
    }

    const date = new Date();

    // sending confirmaiton-email-self
    // USER-INPU-VALIDATION-SUCCESS-SENDING-EMAIL
    // generating-msg
    const EMAIL_MSG = Communication_Provider.createEmailMSG(
      this.TEMPLETE_CONFIGS[2],
      {
        ORDER_ID:
          order_response.AD_DETAILS.payment_configuration.captured_payment
            .order_id,
        DATE_OF_ORDER_BOOKED: `${date.getDate()}-${
          date.getMonth() + 1
        }-${date.getFullYear()}`,
        CONTACT_NAME:
          order_response.AD_DETAILS.payment_configuration.contact_detaild
            .contact_person_name,
        CONTACT_MOBILE:
          order_response.AD_DETAILS.payment_configuration.contact_detaild
            .contact_phone,
        CONTACT_EMAIL:
          order_response.AD_DETAILS.payment_configuration.contact_detaild
            .contact_email,
        DOCUMENT_NAME:
          order_response.AD_DETAILS.payment_configuration.documents_bucket
            ?.docs[0]?.file_name,
        DOWNLOAD_URL:
          order_response.AD_DETAILS.payment_configuration.documents_bucket
            ?.docs[0]?.download_url,
      }
    );
    if (EMAIL_MSG === null) {
      res.json({
        status: 404,
        err_msg: "Error while Creating Email.",
      });
      return;
    }

    // sending-email
    const EMAIL_SUCCESS_CONFIG = await Communication_Provider.sendEmail(
      EMAIL_MSG
    );
    if (EMAIL_SUCCESS_CONFIG.status_code === 200) {
      await datebase_Controller.update_order_by_id(
        orderID,
        "isConfirmationDone",
        true
      );

      res.status(EMAIL_SUCCESS_CONFIG.status_code).json({
        status: EMAIL_SUCCESS_CONFIG.status_code,
        msg: EMAIL_SUCCESS_CONFIG.status_msg,
        msg_id: EMAIL_SUCCESS_CONFIG.msg_id,
      });
      return;
    } else {
      res.status(EMAIL_SUCCESS_CONFIG.status_code).json({
        status: EMAIL_SUCCESS_CONFIG.status_code,
        msg: EMAIL_SUCCESS_CONFIG.status_msg,
      });
      return;
    }
  };

  // new_order_wsp_self
  static NEW_ORDER_SELF_WSP = async (req, res) => {
    res.status(200).json({
      status: "new order wsp sent",
    });
  };

  // new_order_mail_customer
  static NEW_ORDER_CUSTOMER_MAIL = async (req, res) => {
    res.status(200).json({
      status: "new order customer mail sent",
    });
  };

  // New AD_ORDER_QUERY
  static NEW_AD_ORDER_QUERY = async (req, res) => {
    const ORDER_CONFIG = {
      ORDER_TYPE: null,
      CONTACT: {
        NAME: null,
        EMAIL: null,
        PHONE: null,
      },
      RADIO_AD: {
        STATION: null,
        LOCATION: null,
        LENGTH: null,
        FREQUENCY: null,
        DURATION: null,
      },
      TV_AD: {
        CHANNEL: null,
        LENGTH: null,
        FREQUENCY: null,
        DURATION: null,
      },
      MARKETING_AD: {
        PLATFORMS_TO_AD: null,
        CURRENT_BUDGET: null,
        TOTAL_ACCOUNTS: null,
        INSTA_LINK: null,
        FB_LINK: null,
        TWITTER_LINK: null,
      },
    };

    let AD_TYPE = req.body.ad_type;
    ORDER_CONFIG.CONTACT.NAME = req?.body?.name;
    ORDER_CONFIG.CONTACT.EMAIL = req?.body?.email;
    ORDER_CONFIG.CONTACT.PHONE = req?.body?.phone;

    if (AD_TYPE === "RADIO") {
      ORDER_CONFIG.RADIO_AD.STATION = req?.body?.station;
      ORDER_CONFIG.RADIO_AD.LOCATION = req?.body?.location;
      ORDER_CONFIG.RADIO_AD.LENGTH = req?.body?.adlength;
      ORDER_CONFIG.RADIO_AD.FREQUENCY = req?.body?.frequency;
      ORDER_CONFIG.RADIO_AD.DURATION = req?.body?.duration;
    } else if (AD_TYPE === "TV") {
      ORDER_CONFIG.TV_AD.CHANNEL = req?.body?.channel;
      ORDER_CONFIG.TV_AD.LENGTH = req?.body?.adlength;
      ORDER_CONFIG.TV_AD.FREQUENCY = req?.body?.frequency;
      ORDER_CONFIG.TV_AD.DURATION = req?.body?.duration;
    } else if (AD_TYPE === "MARKETING") {
      ORDER_CONFIG.MARKETING_AD.PLATFORMS_TO_AD = req?.body?.platforms;
      ORDER_CONFIG.MARKETING_AD.CURRENT_BUDGET = req?.body?.budget;
      ORDER_CONFIG.MARKETING_AD.TOTAL_ACCOUNTS = req?.body?.total_acc;
      ORDER_CONFIG.MARKETING_AD.INSTA_LINK = req?.body?.insta_link;
      ORDER_CONFIG.MARKETING_AD.FB_LINK = req?.body?.fb_link;
      ORDER_CONFIG.MARKETING_AD.TWITTER_LINK = req?.body?.twitter_link;
    }

    // generating-msg
    const date = new Date();

    // USER-INPU-VALIDATION-SUCCESS-SENDING-EMAIL
    // generating-msg
    const TEMPLATE_CONFIG_ID =
      AD_TYPE === "AUTO_AD"
        ? 7
        : AD_TYPE === "RADIO"
        ? 4
        : AD_TYPE === "TV"
        ? 5
        : AD_TYPE === "MARKETING"
        ? 6
        : 0;

    let EMAIL_MSG = null;
    if (AD_TYPE === "RADIO") {
      EMAIL_MSG = Communication_Provider.createEmailMSG(
        this.TEMPLETE_CONFIGS[TEMPLATE_CONFIG_ID],
        {
          CONTACT__REASON: this.TEMPLETE_CONFIGS[TEMPLATE_CONFIG_ID].subject,
          FIRST_NAME: ORDER_CONFIG.CONTACT.NAME,
          LAST_NAME: "",
          EMAIL_ID: ORDER_CONFIG.CONTACT.EMAIL,
          MOBILE_NUMBER: ORDER_CONFIG.CONTACT.PHONE,
          DATE_OF_CONTACT: `${date.getDate()}-${
            date.getMonth() + 1
          }-${date.getFullYear()}`,
          ...ORDER_CONFIG.RADIO_AD,
        }
      );
    } else if (AD_TYPE === "TV") {
      EMAIL_MSG = Communication_Provider.createEmailMSG(
        this.TEMPLETE_CONFIGS[TEMPLATE_CONFIG_ID],
        {
          CONTACT__REASON: this.TEMPLETE_CONFIGS[TEMPLATE_CONFIG_ID].subject,
          FIRST_NAME: ORDER_CONFIG.CONTACT.NAME,
          LAST_NAME: "",
          EMAIL_ID: ORDER_CONFIG.CONTACT.EMAIL,
          MOBILE_NUMBER: ORDER_CONFIG.CONTACT.PHONE,
          DATE_OF_CONTACT: `${date.getDate()}-${
            date.getMonth() + 1
          }-${date.getFullYear()}`,
          ...ORDER_CONFIG.TV_AD,
        }
      );
    } else if (AD_TYPE === "MARKETING") {
      EMAIL_MSG = Communication_Provider.createEmailMSG(
        this.TEMPLETE_CONFIGS[TEMPLATE_CONFIG_ID],
        {
          CONTACT__REASON: this.TEMPLETE_CONFIGS[TEMPLATE_CONFIG_ID].subject,
          FIRST_NAME: ORDER_CONFIG.CONTACT.NAME,
          LAST_NAME: "",
          EMAIL_ID: ORDER_CONFIG.CONTACT.EMAIL,
          MOBILE_NUMBER: ORDER_CONFIG.CONTACT.PHONE,
          DATE_OF_CONTACT: `${date.getDate()}-${
            date.getMonth() + 1
          }-${date.getFullYear()}`,
          ...ORDER_CONFIG.MARKETING_AD,
        }
      );
    } else {
      EMAIL_MSG = Communication_Provider.createEmailMSG(
        this.TEMPLETE_CONFIGS[TEMPLATE_CONFIG_ID],
        {
          CONTACT__REASON: this.TEMPLETE_CONFIGS[TEMPLATE_CONFIG_ID].subject,
          FIRST_NAME: ORDER_CONFIG.CONTACT.NAME,
          LAST_NAME: "",
          EMAIL_ID: ORDER_CONFIG.CONTACT.EMAIL,
          MOBILE_NUMBER: ORDER_CONFIG.CONTACT.PHONE,
          DATE_OF_CONTACT: `${date.getDate()}-${
            date.getMonth() + 1
          }-${date.getFullYear()}`,
        }
      );
    }

    if (EMAIL_MSG === null) {
      res.status(500).json({
        status: 400,
        err_msg: "Error while creating EmailMSG",
      });
      return;
    }

    // sending-email
    const EMAIL_SUCCESS_CONFIG = await Communication_Provider.sendEmail(
      EMAIL_MSG
    );
    if (EMAIL_SUCCESS_CONFIG.status_code === 200) {
      res.status(EMAIL_SUCCESS_CONFIG.status_code).json({
        status: EMAIL_SUCCESS_CONFIG.status_code,
        msg: EMAIL_SUCCESS_CONFIG.status_msg,
        msg_id: EMAIL_SUCCESS_CONFIG.msg_id,
      });
      return true;
    } else {
      res.status(EMAIL_SUCCESS_CONFIG.status_code).json({
        status: EMAIL_SUCCESS_CONFIG.status_code,
        err_msg: EMAIL_SUCCESS_CONFIG.status_msg,
      });
      return true;
    }
  };
}
