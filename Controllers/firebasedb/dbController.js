import { FIREBASE_DB } from "../../utils/Auth/firebase_init.js";

export default class datebase_Controller {
    static NEW_ORDER_TEMPLATE = {
        isOrderVerified: false,
        isConfirmationDone: false,
        isOrderActive: true,
        AD_DETAILS: null
    }


    static get_newspapers = async (req, res) => {
        const newspapers_collection = [];

        const snapshot = await FIREBASE_DB.collection('NEWSPAPERS_COLL').get();
        snapshot.forEach((doc) => {
            newspapers_collection.push(doc.data());
        });

        if (newspapers_collection.length > 0) {
            res.json({
                status: 200,
                status_txt: "ok",
                data: {
                    newspaper_collection: newspapers_collection,
                    items: newspapers_collection.length
                }
            })
            return 0;
        } else {
            res.status(400).json({
                status: 400,
                status_txt: "not found!",
            })
        }
        return;
    }

    // get_category_config
    static get_category_config = async (req, res) => {

        const query_ = {
            category_config_id: req.body.caegory_config_id ? req.body.caegory_config_id : null,
            category_id: req.body.category_id ? req.body.category_id : null
        }


        if (query_.category_config_id === null || query_.category_id === null) {
            res.status(200).json({
                status: 400,
                status_txt: "all feilds required"
            })

            return;
        }

        let snapshot = await FIREBASE_DB.collection("CAT_CONFGS").doc(query_.category_config_id).collection("CONFIGS_CC").doc(query_.category_id).get();
        let snapshow_two = await FIREBASE_DB.collection("CAT_CONFGS").doc(query_.category_config_id).get();
        let data = snapshot.data();
        let data_tow = snapshow_two.data();

       

        if (!data || !data_tow) {
            res.status(200).json({
                status: 400,
                status_txt: "no record found!"
            })
            return 0;
        }
    
      
        const dispatch_response = {
            headingconfig: data.heading_config != null ? {
                categorys: data.heading_config,
            } : null,
            paller_rules: data.pallet_rules,
            from_the_paper: data_tow.from_the_newspaper,
            newspaper_name: data_tow.CAT_CONFIG_NAME,
            special_enhansment: data.special_enhansments_config,
        }

        res.status(200).json({
            status: 200,
            status_txt: "ok",
            data: dispatch_response
        })


    }

    // get_category(s)
    static get_category_list = async (req, res) => {
        let data = [];
        let snapshot = await FIREBASE_DB.collection("CATEGORY_s").get();

        snapshot?.forEach(doc => {
            data.push(doc.data());
        })

        if (data?.length > 0) {
            res.status(200).json({
                status: 200,
                status_txt: "ok",
                data: {
                    items: data?.length,
                    category_list: data
                }
            })
        } else {
            res.status(400).json({
                status: 400,
                status_txt: "Records not found!"
            })
        }


        return;
    }


    // create_new_order
    static create_new_order = async (order_details) => {

        this.NEW_ORDER_TEMPLATE.AD_DETAILS = order_details;
        this.NEW_ORDER_TEMPLATE.isOrderVerified = true;

        const order_document_id = order_details.payment_configuration.captured_payment.payment_id;
        await FIREBASE_DB.collection("ORDERS").doc(order_document_id).set(this.NEW_ORDER_TEMPLATE);
    }

    // get_order_by_id
    static get_order_by_id = async (orderID) => {
        let snapshot = await FIREBASE_DB.collection("ORDERS").doc(orderID).get();
        return snapshot.data();
    }


    // update_order_status_by_id
    static update_order_by_id = async (orderID, key, value) => {
        await FIREBASE_DB.collection("ORDERS").doc(orderID).update({
            [key]: value
        });

    }


    // get_editions_by_nid
    static get_editions_by_nid = async (req, res) => {
        const NID = req.body?.NID ? req.body?.NID : null;

        if (NID === null) {
            res.json({
                status: 404,
                status_txt: "NID Required"
            })

            return 0;
        }

        let response = await FIREBASE_DB.collection("EDITIONS").doc(String(NID)).get();

        if (!response) {
            res.json({
                status: 404,
                status_txt: "No Editions found"
            })

            return 0;
        }

        res.json(({
            status: 200,
            status_txt: "ok",
            data: response.data()
        }))
    }
}

