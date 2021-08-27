const express = require('express');

const router = express.Router();

const card_checker = require("../util/validation")

const card_controller = require("../controller/card")

router.get('/api/card', card_controller.card_api)

router.get('/api/card/read_card/:id', card_controller.read_card)

router.post('/api/card/add_card/:id', card_checker.check_null, card_checker.check_card_number_length, card_controller.add_card)

router.delete('/api/card/delete_card/:card_number', card_controller.delete_card)

module.exports = router;