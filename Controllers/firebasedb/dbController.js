import { FIREBASE_DB } from "../../utils/Auth/firebase_init.js";

export default class datebase_Controller {
  static NEW_ORDER_TEMPLATE = {
    isOrderVerified: false,
    isConfirmationDone: false,
    isOrderActive: true,
    AD_DETAILS: null,
  };

  static get_newspapers = async (req, res) => {
    const newspapers_collection = [];

    const snapshot = await FIREBASE_DB.collection("NEWSPAPERS_COLL").get();
    snapshot.forEach((doc) => {
      newspapers_collection.push(doc.data());
    });

    if (newspapers_collection.length > 0) {
      res.json({
        status: 200,
        status_txt: "ok",
        data: {
          newspaper_collection: newspapers_collection,
          items: newspapers_collection.length,
        },
      });
      return 0;
    } else {
      res.status(400).json({
        status: 400,
        status_txt: "not found!",
      });
    }
    return;
  };

  static get_editions_price_list = async (req, res) => {
    const doc_refs = [];
    const edition_cards = [];
    const client_req = {
      cid: req.body.cid !== null ? req.body.cid : null,
      nid: req.body.nid !== null ? req.body.nid : null,
      total_eiditions:
        req.body.total_editions !== null ? req.body.total_editions : null,
    };

    if (
      client_req.cid === null ||
      client_req.nid === null ||
      client_req.total_eiditions === null ||
      client_req.total_eiditions <= 0
    ) {
      res.status(200).json({
        status: 404,
        txt: "Records Not Found!",
      });

      return true;
    }

    // creating documents refs
    for (let i = 1; i <= client_req.total_eiditions; i++) {
      doc_refs.push(
        FIREBASE_DB.doc(
          `EDITION_CONFIG_COLL/${client_req.nid}_${client_req.cid}_${17000 + i}`
        )
      );
    }

    const db_response = await FIREBASE_DB.getAll(...doc_refs);

    db_response.forEach((doccard) => {
      if (doccard.data()) {
        edition_cards.push(doccard.data());
      }
    });

    if (edition_cards.length <= 0) {
      res.status(200).json({
        status: 404,
        txt: "Records Not Found!",
      });

      return true;
    }

    res.status(200).json({
      status: 200,
      items: edition_cards.length,
      data: edition_cards,
    });
  };

  static get_packages_list = async (req, res) => {
    const client_req = {
      cid: req.body.cid !== null ? req.body.cid : null,
      nid: req.body.nid !== null ? req.body.nid : null,
    };

    if (client_req.cid === null || client_req.nid === null) {
      res.status(200).json({
        status: 404,
        txt: "Records Not Found!",
      });

      return true;
    }

    const db_response = await FIREBASE_DB.collection("PACKAGES")
      .doc(`PKGID_${client_req.nid}_${client_req.cid}`)
      .get();

    if (!db_response) {
      res.status(200).json({
        status: 404,
        txt: "Records Not Found!",
      });

      return true;
    }

    res.status(200).json({
      status: 200,
      data: db_response.data(),
    });
  };

  // get_category_config
  static get_category_config = async (req, res) => {
    const query_ = {
      category_config_id: req.body.caegory_config_id
        ? req.body.caegory_config_id
        : null,
      category_id: req.body.category_id ? req.body.category_id : null,
    };

    if (query_.category_config_id === null || query_.category_id === null) {
      res.status(200).json({
        status: 400,
        status_txt: "all feilds required",
      });

      return;
    }

    let snapshot = await FIREBASE_DB.collection("CAT_CONFGS")
      .doc(query_.category_config_id)
      .collection("CONFIGS_CC")
      .doc(query_.category_id)
      .get();
    let snapshow_two = await FIREBASE_DB.collection("CAT_CONFGS")
      .doc(query_.category_config_id)
      .get();
    let data = snapshot.data();
    let data_tow = snapshow_two.data();

    if (!data || !data_tow) {
      res.status(200).json({
        status: 400,
        status_txt: "no record found!",
      });
      return 0;
    }

    const dispatch_response = {
      headingconfig:
        data.heading_config != null
          ? {
              categorys: data.heading_config,
            }
          : null,
      paller_rules: data.pallet_rules,
      from_the_paper: data_tow.from_the_newspaper,
      newspaper_name: data_tow.CAT_CONFIG_NAME,
      special_enhansment: data.special_enhansments_config,
    };

    res.status(200).json({
      status: 200,
      status_txt: "ok",
      data: dispatch_response,
    });
  };

  // get_category(s)
  static get_category_list = async (req, res) => {
    let data = [];
    let snapshot = await FIREBASE_DB.collection("CATEGORY_s").get();

    snapshot.forEach((doc) => {
      data.push(doc.data());
    });

    if (data.length > 0) {
      res.status(200).json({
        status: 200,
        status_txt: "ok",
        data: {
          items: data.length,
          category_list: data,
        },
      });
    } else {
      res.status(400).json({
        status: 400,
        status_txt: "Records not found!",
      });
    }

    return;
  };

  // create_new_order
  static create_new_order = async (order_details) => {
    try {
      const response = await FIREBASE_DB.collection("LATEST_ORDER_ID").doc("LATEST_ORDER_ID_NEW").get();
    let full_id = await response.data().id;
    let new_order_id = `ORDER_ID_${Number(full_id.split("_")[2]) + 1}`;


    await FIREBASE_DB.collection("LATEST_ORDER_ID").doc("LATEST_ORDER_ID_NEW").set({
      id : new_order_id
    });

    this.NEW_ORDER_TEMPLATE.AD_DETAILS = order_details;
    this.NEW_ORDER_TEMPLATE.isOrderVerified = true;
    await FIREBASE_DB.collection("ORDERS")
      .doc(new_order_id)
      .set(this.NEW_ORDER_TEMPLATE);

      return {
        status : 200
      }
    } catch (error) {
      return {
        status : 500,
        err : true,
        msg : "Please Try Again After some time."
      }
    }
  };

  // get_order_by_id
  static get_order_by_id = async (orderID) => {
    let snapshot = await FIREBASE_DB.collection("ORDERS").doc(orderID).get();
    return snapshot.data();
  };

  // update_order_status_by_id
  static update_order_by_id = async (orderID, key, value) => {
    await FIREBASE_DB.collection("ORDERS")
      .doc(orderID)
      .update({
        [key]: value,
      });
  };

  // get_editions_by_nid
  static get_editions_by_nid = async (req, res) => {
    const NID = req.body.NID ? req.body.NID : null;

    if (NID === null) {
      res.json({
        status: 404,
        status_txt: "NID Required",
      });

      return 0;
    }

    let response = await FIREBASE_DB.collection("EDITIONS")
      .doc(String(NID))
      .get();

    if (!response) {
      res.json({
        status: 404,
        status_txt: "No Editions found",
      });

      return 0;
    }

    res.json({
      status: 200,
      status_txt: "ok",
      data: response.data(),
    });
  };
}
