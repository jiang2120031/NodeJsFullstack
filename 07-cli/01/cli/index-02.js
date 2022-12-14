#!/usr/bin/env node

const yargs = require('yargs')
const Table = require('cli-table')
const ApiClient = require('./api-client')

yargs
    .option('endpoint', {
        alias: 'e',
        default: 'http://localhost:1337',
        describe: 'The endpoint of the API',

    })
    .command(
        'list products',
        'Get a list of products',
        {
            tag: {
                alias: 't',
                describe: 'Filter results by tag'
            },
            limit: {
                alias: 'l',
                type: 'number',
                default: 25,
                describe: 'Limit the number of results'
            },
            offset: {
                alias: 'o',
                type: 'number',
                default: 0,
                describe: 'Skip number of results'
            }
        },
        listProducts
    )
    .command('view product <id>', 'View a product', {}, viewProduct)
    .command(
        'edit product <id>',
        'Edit a product',
        {
            key: {
                alias: 'k',
                required: true,
                describe: 'Product key to edit'
            },
            value: {
                alias: 'v',
                required: true,
                describe: 'New value for product key'
            },
            username: {
                alias: 'u',
                required: true,
                describe: 'Login username'
            },
            password: {
                alias: 'p',
                required: true,
                describe: 'Login password'
            }
        },
        editProduct
    )
    .help()
    .demandCommand(1, 'You need at least one command before moving on')
    .parse()

async function viewProduct(opts) {
    const { endpoint, id } = opts;
    const api = new ApiClient({ endpoint })
    const product = await api.getProduct(id);
    const cols = process.stdout.columns - 3
    const table = new Table({
        colWidths: [15, cols - 15]
    })

    Object.keys(product).forEach(k => table.push({ [k]: JSON.stringify(product) }))

    console.log(table.toString())
}

async function listProducts(opts) {
    const { tag, offset, limit, endpoint } = opts
    const api = new ApiClient({ endpoint })
    const products = await api.listProducts({ tag, offset, limit })
    console.log(products)
    const cols = process.stdout.columns - 10
    const colsId = 30
    const colsProp = Math.floor((cols - colsId) / 3)
    const table = new Table({
        head: ['ID', 'Description', 'Tags', 'User'],
        colWidths: [colsId, colsProp, colsProp, colsProp]
    })

    products.forEach(p => table.push([
        p._id,
        p.description.replace(/\n|\r/g, ' '),
        p.userName,
        p.tags.slice(0, 3).join(', ')
    ]))

    console.log(table.toString())
}

async function editProduct(opts) {
    const { id, key, value, endpoint, username, password } = opts
    const change = { [key]: value }
    const api = new ApiClient({ username, password, endpoint })
    await api.editProduct(id, change)
    viewProduct({ id, endpoint })
}
