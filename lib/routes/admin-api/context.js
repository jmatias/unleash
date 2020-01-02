'use strict';

const Controller = require('../controller');

const builtInContextFields = [
    { name: 'environment' },
    { name: 'userId' },
    { name: 'appName' },
];

class ContextController extends Controller {
    constructor(config) {
        super(config);
        this.contextFields = builtInContextFields.concat(
            config.customContextFields
        );
        this.store = config.stores.contextFieldStore;
        this.get('/', this.getContextFields);
    }

    async getContextFields(req, res) {
        const fields = await this.store.getAll();
        res.status(200)
            .json(fields)
            .end();
    }
}

module.exports = ContextController;
