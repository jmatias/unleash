/* eslint camelcase: "off" */
'use strict';

const async = require('async');

exports.up = function(db, cb) {
    async.series(
        [
            db.createTable.bind(db, 'context_fields', {
                name: {
                    type: 'string',
                    length: 255,
                    primaryKey: true,
                    notNull: true,
                },
                built_in: { type: 'int', defaultValue: 0 },
                sort_order: { type: 'int', defaultValue: 10 },
                legal_values: { type: 'string', length: 255 },
                created_at: { type: 'timestamp', defaultValue: 'now()' },
                updated_at: { type: 'timestamp', defaultValue: 'now()' },
            }),
            db.runSql.bind(
                db,
                `
        INSERT INTO context_fields(name, built_in, sort_order) VALUES('environment', 0, 0);
        INSERT INTO context_fields(name, built_in, sort_order) VALUES('userId', 0, 1);
        INSERT INTO context_fields(name, built_in, sort_order) VALUES('appName', 0, 2);
        `
            ),
        ],
        cb
    );
};

exports.down = function(db, cb) {
    return db.dropTable('context_fields', cb);
};
