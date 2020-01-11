'use strict';

const COLUMNS = [
    'name',
    'description',
    'sort_order',
    'legal_values',
    'created_at',
];
const TABLE = 'context_fields';

const mapRow = row => ({
    name: row.name,
    desription: row.description,
    sortOrder: row.sort_order,
    legalValues: row.legal_values ? row.legal_values.split(',') : undefined,
    createdAt: row.created_at,
});

class ContextFieldStore {
    constructor(db, customContextFields, getLogger) {
        this.db = db;
        this.logger = getLogger('context-field-store.js');
        this._createFromConfig(customContextFields);
    }

    async _createFromConfig(customContextFields) {
        if (customContextFields) {
            this.logger.info(
                'Create custom context fields',
                customContextFields
            );
            const conextFields = await this.getAll();
            customContextFields
                .filter(c => !conextFields.some(cf => cf.name === c.name))
                .forEach(async field => {
                    try {
                        await this.create(field);
                    } catch (e) {
                        this.logger.error(e);
                    }
                });
        }
    }

    fieldToRow(data) {
        return {
            name: data.name,
            sort_order: data.sortOrder, // eslint-disable-line
            legal_values: data.legalValues ? data.legalValues.join('') : null, // eslint-disable-line
            updated_at: data.createdAt, // eslint-disable-line
        };
    }

    getAll() {
        return this.db
            .select(COLUMNS)
            .from(TABLE)
            .orderBy('sort_order', 'asc')
            .map(mapRow);
    }

    create(contextField) {
        return this.db(TABLE).insert(this.fieldToRow(contextField));
    }
}

module.exports = ContextFieldStore;
