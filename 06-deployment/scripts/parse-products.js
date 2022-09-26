const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname,'../../products.json')

function parse(product) {
    const {alt_description,urls,links,user,categories} = product

    return {
        description: alt_description,
        imgThumb: urls.thumb,
        img: urls.full,
        link:links.html,
        userId:user.id,
        userName: user.name,
        userLink: user.links.html,
        tags:categories
    }
}

const rawdata = fs.readFileSync(filePath)
const data = JSON.parse(rawdata)
const products = data.map(item => parse(item));
fs.writeFileSync(path.join(__dirname,'../../products-01.json'),JSON.stringify(products))