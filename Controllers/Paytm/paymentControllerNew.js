import PaytmChecksum from "paytmchecksum";
import * as dotenv from "dotenv";
import https from "https";
dotenv.config();
export default class PaytmController {
  static GENERATE_CHECKSUM = async () => {
    var paytmParams = {};

    paytmParams.body = {
      requestType: "Payment",
      mid: "itJPvm02357617464425",
      websiteName: "WEBSTAGING",
      orderId: "ORDERID_98765",
      callbackUrl: "https://sellersuccess.in",
      txnAmount: {
        value: "10.00",
        currency: "INR",
      },
      userInfo: {
        custId: "CUST_001",
      },
    };

    /*
     * Generate checksum by parameters we have in body
     * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
     */
    PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      "B4jiUfsis5m_EHZ0"
    ).then(function (checksum) {
      paytmParams.head = {
        signature: checksum,
      };

      var post_data = JSON.stringify(paytmParams);

      var options = {
        /* for Staging */
        hostname: "securegw-stage.paytm.in" /* for Production */, // hostname: 'securegw.paytm.in',

        port: 443,
        path: "/theia/api/v1/initiateTransaction?mid=itJPvm02357617464425&orderId=ORDERID_98765",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": post_data.length,
        },
      };

      var response = "";
      var post_req = https.request(options, function (post_res) {
        post_res.on("data", function (chunk) {
          response += chunk;
        });

        post_res.on("end", function () {
          console.log("Response: ", JSON.parse(response));
        });
      });

      post_req.write(post_data);
      post_req.end();
    });
  };
}
