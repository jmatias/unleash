import dbInit, {
    type ITestDb,
} from '../../../test/e2e/helpers/database-init.js';
import getLogger from '../../../test/fixtures/no-logger.js';
import {
    type IUnleashTest,
    setupAppWithCustomConfig,
} from '../../../test/e2e/helpers/test-helper.js';
import { DEFAULT_ENV } from '../../util/constants.js';

let app: IUnleashTest;
let db: ITestDb;

beforeAll(async () => {
    db = await dbInit('environment_api_serial', getLogger, {
        dbInitMethod: 'legacy' as const,
    });
    app = await setupAppWithCustomConfig(
        db.stores,
        {
            experimental: {
                flags: {
                    strictSchemaValidation: true,
                },
            },
        },
        db.rawDatabase,
    );
});

afterAll(async () => {
    await app.destroy();
    await db.destroy();
});

test('Can list all existing environments', async () => {
    await app.request
        .get('/api/admin/environments')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
            expect(res.body.version).toBe(1);
            expect(res.body.environments[0]).toStrictEqual({
                name: DEFAULT_ENV,
                enabled: true,
                sortOrder: 1,
                type: 'production',
                protected: true,
                requiredApprovals: null,
                projectCount: 1,
                apiTokenCount: 0,
                enabledToggleCount: 0,
            });
        });
});

test('Can update sort order', async () => {
    const envName = 'update-sort-order';
    await db.stores.environmentStore.create({
        name: envName,
        type: 'production',
    });
    await app.request
        .put('/api/admin/environments/sort-order')
        .send({
            [DEFAULT_ENV]: 2,
            [envName]: 1,
        })
        .expect(200);

    await app.request
        .get('/api/admin/environments')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
            const updatedSort = res.body.environments.find(
                (t) => t.name === envName,
            );
            const defaultEnv = res.body.environments.find(
                (t) => t.name === DEFAULT_ENV,
            );
            expect(updatedSort.sortOrder).toBe(1);
            expect(defaultEnv.sortOrder).toBe(2);
        });
});

test('Sort order will fail on wrong data format', async () => {
    const envName = 'sort-order-env';

    await app.request
        .put('/api/admin/environments/sort-order')
        .send({
            [DEFAULT_ENV]: 'test',
            [envName]: 1,
        })
        .expect(400);
});

test('Can update environment enabled status', async () => {
    const envName = 'enable-environment';
    await db.stores.environmentStore.create({
        name: envName,
        type: 'production',
    });
    await app.request
        .post(`/api/admin/environments/${envName}/on`)
        .set('Content-Type', 'application/json')
        .expect(204);
});

test('Can update environment disabled status', async () => {
    const envName = 'disable-environment';

    await db.stores.environmentStore.create({
        name: envName,
        type: 'production',
    });

    await app.request
        .post(`/api/admin/environments/${envName}/off`)
        .set('Content-Type', 'application/json')
        .expect(204);
});

test('Can not update non-existing environment enabled status', async () => {
    const envName = 'non-existing-env';

    await app.request
        .post(`/api/admin/environments/${envName}/on`)
        .set('Content-Type', 'application/json')
        .expect(404);
});

test('Can not update non-existing environment disabled status', async () => {
    const envName = 'non-existing-env';

    await app.request
        .post(`/api/admin/environments/${envName}/off`)
        .set('Content-Type', 'application/json')
        .expect(404);
});

test('Can get specific environment', async () => {
    const envName = 'get-specific';
    await db.stores.environmentStore.create({
        name: envName,
        type: 'production',
    });
    await app.request
        .get(`/api/admin/environments/${envName}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
            const { body } = res;
            expect(body.name).toBe(envName);
            expect(body.type).toBe('production');
        });
});

test('Getting a non existing environment yields 404', async () => {
    await app.request
        .get('/api/admin/environments/this-does-not-exist')
        .expect(404);
});

test('Can deprecate and undeprecate protected environments', async () => {
    await app.request
        .post(`/api/admin/environments/${DEFAULT_ENV}/off`)
        .expect(204);
    await app.request
        .post(`/api/admin/environments/${DEFAULT_ENV}/on`)
        .expect(204);
});
