import supertest from 'supertest';
import express from 'express';
import { createTestConfig } from '../../test/config/test-config.js';

import LogoutController from './logout.js';
import type { IAuthRequest } from './unleash-types.js';
import SessionService from '../services/session-service.js';
import FakeSessionStore from '../../test/fixtures/fake-session-store.js';
import noLogger from '../../test/fixtures/no-logger.js';
import { addDays } from 'date-fns';
import { vi } from 'vitest';

test('should redirect to "/" after logout', async () => {
    const baseUriPath = '';
    const app = express();
    const config = createTestConfig({ server: { baseUriPath } });
    const sessionStore = new FakeSessionStore();
    const sessionService = new SessionService(
        { sessionStore },
        { getLogger: noLogger },
    );
    app.use(
        '/logout',
        new LogoutController(config, {
            sessionService,
        }).router,
    );
    const request = supertest(app);
    expect.assertions(0);
    await request
        .post(`${baseUriPath}/logout`)
        .expect(302)
        .expect('Location', `${baseUriPath}/`);
});

test('should redirect to "/basePath" after logout when baseUriPath is set', async () => {
    const baseUriPath = '/basePath';
    const app = express();
    const config = createTestConfig({ server: { baseUriPath } });
    const sessionStore = new FakeSessionStore();
    const sessionService = new SessionService(
        { sessionStore },
        { getLogger: noLogger },
    );
    app.use('/logout', new LogoutController(config, { sessionService }).router);
    const request = supertest(app);
    expect.assertions(0);
    await request
        .post('/logout')
        .expect(302)
        .expect('Location', `${baseUriPath}/`);
});

test('should set "Clear-Site-Data" header', async () => {
    const baseUriPath = '';
    const app = express();
    const config = createTestConfig({ server: { baseUriPath } });
    const sessionStore = new FakeSessionStore();
    const sessionService = new SessionService(
        { sessionStore },
        { getLogger: noLogger },
    );

    app.use('/logout', new LogoutController(config, { sessionService }).router);
    const request = supertest(app);
    expect.assertions(0);
    await request
        .post(`${baseUriPath}/logout`)
        .expect(302)
        .expect('Clear-Site-Data', '"cookies", "storage"');
});

test('should not set "Clear-Site-Data" header', async () => {
    const baseUriPath = '';
    const app = express();
    const config = createTestConfig({
        server: { baseUriPath },
        session: { clearSiteDataOnLogout: false },
    });
    const sessionStore = new FakeSessionStore();
    const sessionService = new SessionService(
        { sessionStore },
        { getLogger: noLogger },
    );

    app.use('/logout', new LogoutController(config, { sessionService }).router);
    const request = supertest(app);
    expect.assertions(1);
    await request
        .post(`${baseUriPath}/logout`)
        .expect(302)
        .expect((res) =>
            expect(res.headers['Clear-Site-Data']).toBeUndefined(),
        );
});

test('should clear "unleash-session" cookies', async () => {
    const baseUriPath = '';
    const app = express();
    const config = createTestConfig({ server: { baseUriPath } });
    const sessionStore = new FakeSessionStore();
    const sessionService = new SessionService(
        { sessionStore },
        { getLogger: noLogger },
    );

    app.use('/logout', new LogoutController(config, { sessionService }).router);

    const request = supertest(app);
    expect.assertions(0);
    await request
        .post(`${baseUriPath}/logout`)
        .expect(302)
        .expect(
            'Set-Cookie',
            'unleash-session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        );
});

test('should clear "unleash-session" cookie even when disabled clear site data', async () => {
    const baseUriPath = '';
    const app = express();
    const config = createTestConfig({
        server: { baseUriPath },
        session: { clearSiteDataOnLogout: false },
    });
    const sessionStore = new FakeSessionStore();
    const sessionService = new SessionService(
        { sessionStore },
        { getLogger: noLogger },
    );

    app.use('/logout', new LogoutController(config, { sessionService }).router);

    const request = supertest(app);
    expect.assertions(0);
    await request
        .post(`${baseUriPath}/logout`)
        .expect(302)
        .expect(
            'Set-Cookie',
            'unleash-session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        );
});

test('should call destroy on session', async () => {
    const baseUriPath = '';
    const fakeSession = {
        destroy: vi.fn(),
    };
    const app = express();
    const config = createTestConfig({ server: { baseUriPath } });
    app.use((req: IAuthRequest, res, next) => {
        req.session = fakeSession;
        next();
    });
    const sessionStore = new FakeSessionStore();
    const sessionService = new SessionService(
        { sessionStore },
        { getLogger: noLogger },
    );

    app.use('/logout', new LogoutController(config, { sessionService }).router);

    const request = supertest(app);
    await request.post(`${baseUriPath}/logout`);

    expect(fakeSession.destroy.mock.calls.length).toBe(1);
});

test('should handle req.logout with callback function', async () => {
    // passport >=0.6.0
    const baseUriPath = '';
    const logoutFunction = vi.fn((cb: (err?: any) => void) => cb());
    const app = express();
    const config = createTestConfig({ server: { baseUriPath } });
    app.use((req: IAuthRequest, res, next) => {
        req.logout = logoutFunction;
        next();
    });
    const sessionStore = new FakeSessionStore();
    const sessionService = new SessionService(
        { sessionStore },
        { getLogger: noLogger },
    );

    app.use('/logout', new LogoutController(config, { sessionService }).router);

    const request = supertest(app);
    await request.post(`${baseUriPath}/logout`);

    expect(logoutFunction).toHaveBeenCalledTimes(1);
    expect(logoutFunction).toHaveBeenCalledWith(expect.anything());
});

test('should handle req.logout without callback function', async () => {
    // passport <0.6.0
    const baseUriPath = '';
    const logoutFunction = vi.fn();
    const app = express();
    const config = createTestConfig({ server: { baseUriPath } });
    app.use((req: IAuthRequest, res, next) => {
        req.logout = logoutFunction;
        next();
    });
    const sessionStore = new FakeSessionStore();
    const sessionService = new SessionService(
        { sessionStore },
        { getLogger: noLogger },
    );

    app.use('/logout', new LogoutController(config, { sessionService }).router);

    const request = supertest(app);
    await request.post(`${baseUriPath}/logout`);

    expect(logoutFunction).toHaveBeenCalledTimes(1);
    expect(logoutFunction).toHaveBeenCalledWith();
});

test('should redirect to alternative logoutUrl', async () => {
    const fakeSession = {
        destroy: vi.fn(),
        logoutUrl: '/some-other-path',
    };
    const app = express();
    const config = createTestConfig();
    app.use((req: IAuthRequest, res, next) => {
        req.session = fakeSession;
        next();
    });
    const sessionStore = new FakeSessionStore();
    const sessionService = new SessionService(
        { sessionStore },
        { getLogger: noLogger },
    );

    app.use('/logout', new LogoutController(config, { sessionService }).router);

    const request = supertest(app);
    await request
        .post('/logout')
        .expect(302)
        .expect('Location', '/some-other-path');
});

test('Should destroy sessions for user', async () => {
    const app = express();
    const config = createTestConfig();
    const fakeSession = {
        destroy: vi.fn(),
        user: {
            id: 1,
        },
    };
    app.use((req: IAuthRequest, res, next) => {
        req.session = fakeSession;
        next();
    });
    const sessionStore = new FakeSessionStore();
    const sessionService = new SessionService(
        { sessionStore },
        { getLogger: noLogger },
    );
    await sessionStore.insertSession({
        sid: '1',
        sess: {
            user: {
                id: 1,
            },
        },
        expired: addDays(new Date(), 2),
    });
    await sessionStore.insertSession({
        sid: '2',
        sess: {
            user: {
                id: 1,
            },
        },
        expired: addDays(new Date(), 2),
    });
    const activeSessionsBeforeLogout = await sessionStore.getSessionsForUser(1);
    expect(activeSessionsBeforeLogout).toHaveLength(2);
    app.use('/logout', new LogoutController(config, { sessionService }).router);
    await supertest(app).post('/logout').expect(302);
    const activeSessions = await sessionStore.getSessionsForUser(1);
    expect(activeSessions).toHaveLength(0);
});
