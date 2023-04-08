import express from "express";

const dbrouter = express.Router();

// importing controller
import datebase_Controller from "../../Controllers/firebasedb/dbController.js";



dbrouter.route('/get_newspapers').get(datebase_Controller.get_newspapers);
dbrouter.route('/get_cat_config').get(datebase_Controller.get_category_config);
dbrouter.route('/get_category_list').get(datebase_Controller.get_category_list);
dbrouter.route('/get_editions').post(datebase_Controller.get_editions_by_nid);
export default dbrouter;
