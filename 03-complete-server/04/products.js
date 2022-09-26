const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname,'../products.json')

module.exports = {list}

async function list(opt = {}){
    const {limit =25, offset = 0,tag} = opt
    console.log(tag);
    const data = await fs.readFile(productsFile)

    return JSON.parse(data)
    .filter((v,i) => !tag || v.tags.indexOf(tag)>=0)
    .slice(offset,offset+limit);
    
}