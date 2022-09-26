#!/usr/bin/env node
const netrc = require('netrc')
const prompts = require('prompts')
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
            }
        },
        editProduct
    )
    .command('login', 'Log in to API', {}, login)
    .command('logout', 'Log out of API', {}, logout)
    .command('whoami', 'Check login status', {}, whoami)
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
    const { id, key, value, endpoint } = opts

    const authToken = await ensureLoggedIn({ endpoint })
    if (!authToken) return console.log('Please log in to continue.')

    const change = { [key]: value }

    const api = new ApiClient({ authToken, endpoint })
    await api.editProduct(id, change)
    viewProduct({ id, endpoint })
}

async function ensureLoggedIn({ endpoint }) {
    let { authToken } = loadConfig({ endpoint })
    if (authToken) return authToken

    authToken = await login({ endpoint })

    return authToken
}

async function login(opts) {
    const { endpoint } = opts
    const { username, password } = await prompts([
        {
            name: 'username',
            message: 'What is your username?',
            type: 'text'
        },
        {
            name: 'password',
            message: 'What is your password?',
            type: 'password'
        }
    ])

    try {
        const api = new ApiClient({ username, password, endpoint })
        const authToken = await api.loginReturnToken()
       
        saveConfig({ endpoint, username, authToken })

        console.log(`Logged in as ${username}`)
        return authToken
    } catch (err) {
        const shouldRetry = await askRetry(err)
        if (shouldRetry) return login(opts)
    }
    return null
}

async function askRetry(error)
{
    const {status} = error.response || {}
    const message = status ===401 ?'Incorrect username and/or password.' : error.message

    const { retry } = await prompts({
        name: 'retry',
        type: 'confirm',
        message: `${message} Retry?`
    })

    return retry;
}

function logout({ endpoint }) {
    saveConfig({ endpoint })
    console.log('You are now logged out.')
}

function whoami({ endpoint }) {
    const { username, authToken } = loadConfig({ endpoint })
    const message = username
        ? `You are logged in as ${username}-${authToken}`
        : 'You are not currently logged in.'
    console.log(message)
}

function saveConfig({ endpoint, username, authToken }) {
    const allConfig = netrc()
    const host = endpointToHost(endpoint)
    allConfig[host] = { login: username, authToken: authToken }
    netrc.save(allConfig)
}

function loadConfig({ endpoint }) {
    const host = endpointToHost(endpoint)
    const config = netrc()[host] || {}
    return { username: config.login, authToken: config.authToken }
}

function endpointToHost(endpoint) {
    const result = endpoint.replace('http://', "");
    return result;
}


