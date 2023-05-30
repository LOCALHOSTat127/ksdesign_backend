import express from "express";
import http from "http";
import * as helmet from "helmet";
import * as dotenv from 'dotenv'
import bodyParser from "body-parser";
import cors from "cors";




// importing routes
import communicationRouter from "./Routes/communications/communication.js";
import paymentRouter from "./Routes/Razorpay/payments.js";
import dbrouter from "./Routes/firebasedb/firebaseRoute.js";



// SERVER Configurations.
const SERVER = express();
const SERVER_PORT = process.env.PORT || 5000;




// Pre-needed Configuratison.
SERVER.use(cors())
SERVER.use(bodyParser.json());
dotenv.config();
// Helmet--server-protection [START]
SERVER.use(helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
        "font-src": ["'self'", "ksadspublish.com"],
        "style-src": null,
    },
}));


SERVER.use(
    helmet.referrerPolicy({
        policy: "no-referrer",
    })
)
SERVER.use(
    helmet.hsts({
        // 60 days
        maxAge: 86400,
        // removing the "includeSubDomains" option
        includeSubDomains: false,
    })
)
SERVER.use(
    helmet.noSniff({
        noSniff: false,
    })
)









// server-routes-config
SERVER.use("/communication", communicationRouter);
SERVER.use('/payment', paymentRouter);
SERVER.use('/db', dbrouter);



SERVER.listen(SERVER_PORT, () => {
    console.log(`server started on port ${SERVER_PORT}`);
  });




