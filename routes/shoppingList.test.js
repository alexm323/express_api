const request = require("supertest")

const app = require("../app")
let items = require("../fakeDb")

let bacon = {
    name: "Bacon",
    price: 2.99
}
let lettuce = {
    name: "Lettuce",
    price: 1.49
}
let tomato = {
    name: "Tomato",
    price: 0.99
}
let groceries = [
    bacon, lettuce, tomato
]
beforeEach(function () {
    for (let item of groceries) {
        items.push(item)
    }
});

afterEach(function () {
    // make sure this *mutates*, not redefines 'cats'
    // this is an option for emptying out an array rather than initializing a new array like cats = [] would do 

    items.length = 0;

})

describe("GET /items", () => {
    test("Get all groceries", async () => {
        const res = await request(app).get("/items")
        expect(res.statusCode).toBe(200)
        // console.log(res.body)
        // expect(res.body.items.length).toBe(3)
    })
})
describe("/GET /items/:name", () => {
    test("Find a single item", async () => {
        const res = await request(app).get(`/items/Bacon`)
        expect(res.statusCode).toBe(200)
        // console.log(res)
        expect(res.body.name).toEqual('Bacon')
    })
})

describe("POST /items", () => {
    test("Try creating a new item", async () => {
        const res = await request(app).post("/items").send({ "name": "cheerios", "price": 3.99 })
        expect(res.statusCode).toBe(201)
        // console.log(res.body)
        expect(items[3].name).toEqual("cheerios")
    })
    test("Try creating an invalid item", async () => {
        const res = await request(app).post('/items').send({})
        expect(res.statusCode).toBe(400)
        // console.log(res.body)
    })
})



describe("/PATCH /items/:name", () => {
    test("Update an item", async () => {
        const res = await request(app).patch(`/items/Bacon`).send({ name: "Soylent Bacon", price: 5.99 })
        expect(res.statusCode).toBe(200)
        // console.log(res)
        expect(res.body.updated.name).toEqual('Soylent Bacon')
    })
})

describe("/Delete /items/:name", () => {
    test("Delete an item", async () => {
        const res = await request(app).delete(`/items/Lettuce`)
        expect(res.statusCode).toBe(200)
        expect(res.body.message).toEqual('Deleted')
    })
})

