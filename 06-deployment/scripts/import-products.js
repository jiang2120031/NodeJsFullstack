const db = require('../models/db')
const Products = require('../models/products')

const products = require('../../products-01.json')

;(async function () {
    for(var i=0;i<products.length;i++) {
        console.log(await Products.create(products[i]))
    }
    db.disconnect();
})()