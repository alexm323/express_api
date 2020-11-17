const express = require('express')
const router = new express.Router()
const ExpressError = require("../expressError")
const items = require("../fakeDb")
// simple router get request, just send back the list of items we have in our fake DB
router.get("/", function (req, res) {
    res.json({ items })
})

// allow a user to post an item to the fakeDb
router.post("/", function (req, res, next) {
    // try and catch 
    // if either the name or the price of an item is falsey then we throw an express error and give a code 400 (bad request) code
    try {
        if (!req.body.name || !req.body.price) throw new ExpressError("You must include a valid name and price", 400)
        // otherwise we have a newItem that we want to add to the list with a name and price
        const newItem = { name: req.body.name, price: req.body.price }
        // push it to our fake database
        items.push(newItem)
        // return a 201(created) code , send back json response indicating that the item has been added
        return res.status(201).json({ added: newItem })
        // generic error
    } catch (e) {
        next(e)
    }

})
// get a single item
router.get("/:name", function (req, res) {
    // find on an arr returns that item, check for a matching param from the route
    const foundItem = items.find(item => item.name === req.params.name)
    // console.log(foundItem)
    // if the item doesnt exist it returns undefined and so we throw an error
    if (foundItem === undefined) {
        throw new ExpressError("Item not found", 404)

    }
    // otherwise we return a 200 (ok status code) and send json back to the user
    return res.status(200).json(foundItem)
})
// allow a user to update an existing item in the fakedb
router.patch("/:name", function (req, res) {
    // if we find an item with the requested parameter name
    const foundItem = items.find(item => item.name === req.params.name)
    // if its not defined we throw an error
    if (foundItem === undefined) {
        throw new ExpressError("Item not found", 404)
    }
    // otherwise we update the found item to have a name equivalent to the request name 
    foundItem.name = req.body.name
    // update the price as well
    foundItem.price = req.body.price
    // console.log(foundItem)
    // send back a response that indicated the fake db has been updated and send the item back to the user
    res.json({ updated: foundItem })
})
// delete an item
router.delete("/:name", function (req, res) {
    // find the index of an item to delete
    const foundItemIndex = items.findIndex(item => item.name === req.params.name)
    // findIndex method returns -1 if nothing is found , so if nothing is found throw an error
    if (foundItemIndex === -1) {
        throw new ExpressError("Item not found so cannot be deleted", 404)

    }
    // delete one item starting at the index of the found item
    items.splice(foundItemIndex, 1)
    // confirm that the item was deleted and return that information back
    res.json({ message: "Deleted" })
})

module.exports = router;
