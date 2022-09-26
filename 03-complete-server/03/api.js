const Products = require('./products')

module.exports = {
    listProducts
}

async function listProducts (req,res){
    res.setHeader('Access-Control-Allow-Origin','*')
    const {limit =25, offset = 0} = req.query
    
    try{
        res.json(await Products.list({
            offset:Number(offset),
            limit: Number(limit)
        }))
    }catch(err)
    {
        res.status(500).json({error: err.message})
    }
}