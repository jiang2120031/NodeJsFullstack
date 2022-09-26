const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname,'../products.json')

module.exports = {list}

async function list(opt = {}){
    const {limit =25, offset = 0} = opt
    const data = await fs.readFile(productsFile)
    return JSON.parse(data).slice(offset,offset+limit);
}