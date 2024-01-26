const express = require("express")
const router = express.Router();

const {getMessage, createMessage} = require("../controllers/messageController");

router.post('/', createMessage);
router.get("/:chatId", getMessage);

module.exports = router;