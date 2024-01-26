const express = require("express")
const router = express.Router();

const  {findUserChat, findUserChats, createChat} = require("../controllers/chatController")

router.post('/', createChat);
router.get("/:userId", findUserChats);
router.get("/find/:firstId/:secondId", findUserChat);

module.exports = router;