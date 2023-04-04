import express from "express";
import http from "http";
import * as helmet from "helmet";
import * as dotenv from 'dotenv'
import bodyParser from "body-parser";
import cors from "cors";



// importing routes
import communicationRouter from "./Routes/communications/communication.js";
import paymentRouter from "./Routes/Razorpay/payments.js";



// SERVER Configurations.
const SERVER = express();
const SERVER_PORT  = process.env.PORT | 5050;
const SERVER_HOST = '172.20.10.2';



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
SERVER.use("/communication",communicationRouter);
SERVER.use('/payment',paymentRouter);


// Listening on Server.
http.createServer(SERVER).listen(SERVER_PORT,SERVER_HOST,(error) =>{
    if(error){
        console.log(`ERR on Server ${error}`);
    }else{
        console.log(`Server running on http://${SERVER_HOST}:${SERVER_PORT}`);
    }
})
