const cuid = require('cuid')
const {isEmail} = require('validator')
const db = require('./db')

module.exports =
{
    list,
    get,
    create
}

function emailSchama(opts ={}){
    const { required } = opts
    return {
        type:String,
        required: !!required,
        validate: {
            validator:isEmail,
            message: props => `${props.value} is not a valid email`
        }
    }
}

const Order = db.model('Order',{
    _id: {type:String, default: cuid},
    buyerEmail: emailSchama({required: true}),
    products:[
        {
            type:String,
            ref: 'Product',
            index: true,
            required: true
        }
    ],
    status: {
        type: String,
        index: true,
        default: 'CREATED',
        enum: ['CREATED','PENDING','COMPLETED']
    }
})

async function create(fields) {
    const order = await new Order(fields).save();
    order.populate('products')
    return order
}

async function list(opts ={}) {
    const {offset = 0,limit =25,productId,status} = opts

    let query = productId? {products:productId}:{}
    query = status ? {...query, status:status} : query;

    const orders = await Order.find(query)
                    .populate('products')
                    .sort({_id:1})
                    .skip(offset)
                    .limit(limit)
    return orders
}

async function get(_id){
    const order = await Order.findById(_id)
    .populate('products')
    .exec()
    return order
}

