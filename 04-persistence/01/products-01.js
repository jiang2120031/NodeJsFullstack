const fs = require('fs').promises
const path = require('path')
const cuid = require('cuid')
const db = require('./db')

const productsFile = path.join(__dirname,'../products.json')

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
    console.log(tag);
    const data = await fs.readFile(productsFile)

    return JSON.parse(data)
    .filter((v,i) => !tag || v.tags.indexOf(tag)>=0)
    .slice(offset,offset+limit);
}

async function get(id)
{
    const data = await fs.readFile(productsFile)
    const result = JSON.parse(data).find(x => x.id == id);
    console.log(result);
    return result;
}

async function create(fields)
{
    console.log(fields)
    const product = await new Product(fields).save();
    return product;
}