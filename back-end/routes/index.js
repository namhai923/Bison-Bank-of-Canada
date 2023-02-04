import express from "express";
import user from "./user/index.js";
// import admin from "./admin/index.js";

let router = express.Router();

router.use("/user", user);
// router.use("/admin", admin);

export default router;
