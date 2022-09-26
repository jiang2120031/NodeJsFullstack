const { config } = require('yargs');
const auth = require('../../../06-deployment/auth');

const axios = require('axios').default;

class ApiClient {
    endpoint
    username
    password
    authToken
    constructor(opts) {
        this.endpoint = opts.endpoint;
        this.username = opts.username;
        this.password = opts.password;
        this.authToken = opts.authToken;
        console.log(opts)
    }

    async listProducts(opts) {
        const { offset = 0, limit = 25, tag } = opts

        try {
            const response = await axios.get(`${this.endpoint}/products?offset=${offset}&limit=${limit}&tag=${tag}`);
            return response.data
        } catch (error) {
            console.error(error);
        }
    }

    async getProduct(id) {
        try {
            const response = await axios.get(`${this.endpoint}/products/${id}`);
            return response.data;
        }
        catch (err) {
            console.error(err)
        }
    }

    async editProduct(id, change) {
        let authToken = this.authToken;
        let config = {}
        if (authToken) {
            config = {
                headers: {
                    'Authorization': 'Bearer ' + authToken
                }
            }
        }

        if (!authToken) {
            const tokenResponse = await this.login(this.username, this.password);
            config = {
                headers: {
                    'Authorization': 'Bearer ' + tokenResponse.token
                }
            }
        }

        const resposne = await axios.put(`${this.endpoint}/products/${id}`, change, config);

        return resposne.data;

    }

    async login(username, password) {
        try {
            const tokenResponse = await axios.post(`${this.endpoint}/login`, { username: username, password: password });
            return tokenResponse.data;
        }
        catch (err) {
            console.error(err)
        }
    }

    async loginReturnToken() {
        try {
            const tokenResponse = await axios.post(`${this.endpoint}/login`, { username: this.username, password: this.password });
            return tokenResponse.data.token;
        }
        catch (err) {
            throw err
        }
    }

    async loginReturnResponse() {
        try {
            const tokenResponse = await axios.post(`${this.endpoint}/login`, { username: this.username, password: this.password });
            return tokenResponse
        }
        catch (err) {
            return err
        }
    }
}

module.exports = ApiClient
