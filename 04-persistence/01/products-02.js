const fs = require('fs').promises
const path = require('path')
const cuid = require('cuid')
const db = require('./db')

module.exports = 
{
    list,
    get,
    create
}

const Product =  db.model('Product',{
    _id:{type:String, default: cuid},
    description: String,
    imgThumb: String,
    img: String,
    link: String,
    userId: String,
    userName: String,
    userLink: String,
    tags: {type: [String], index: true }
})

async function list(opt = {}){
    const {limit =25, offset = 0,tag} = opt

    const query = tag ? { tags: tag } : {}
    const products = await Product.find(query)
    .sort({_id:1})
    .skip(offset)
    .limit(limit);

    return products;
}

async function get(_id)
{
    const result = Product.findById(_id);
    return result;
}

async function create(fields)
{
    const product = await new Product(fields).save();
    return product;
}