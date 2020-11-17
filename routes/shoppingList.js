const express = require('express')
const router = new express.Router()
const ExpressError = require("../expressError")
const items = require("../fakeDb")

router.get("/", function (req, res) {
    res.json({ items })
})


router.post("/", function (req, res, next) {
    try {
        if (!req.body.name || !req.body.price) throw new ExpressError("You must include a valid name and price", 400)
        const newItem = { name: req.body.name, price: req.body.price }
        items.push(newItem)
        return res.status(201).json({ added: newItem })
    } catch (e) {
        next(e)
    }

})

module.exports = router;
