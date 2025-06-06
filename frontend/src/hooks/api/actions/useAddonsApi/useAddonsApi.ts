import { useCallback } from 'react';
import useAPI from '../useApi/useApi.js';
import type { AddonSchema } from 'openapi';

const useAddonsApi = () => {
    const { makeRequest, createRequest, errors, loading } = useAPI({
        propagateErrors: true,
    });

    const URI = 'api/admin/addons';

    const createAddon = async (addonConfig: Omit<AddonSchema, 'id'>) => {
        const path = URI;
        const req = createRequest(path, {
            method: 'POST',
            body: JSON.stringify(addonConfig),
        });

        return makeRequest(req.caller, req.id);
    };

    const removeAddon = async (id: number) => {
        const path = `${URI}/${id}`;
        const req = createRequest(path, {
            method: 'DELETE',
        });

        return makeRequest(req.caller, req.id);
    };

    const updateAddon = useCallback(
        async (addonConfig: AddonSchema) => {
            const path = `${URI}/${addonConfig.id}`;
            const req = createRequest(path, {
                method: 'PUT',
                body: JSON.stringify(addonConfig),
            });

            return makeRequest(req.caller, req.id);
        },
        [createRequest, makeRequest],
    );

    return {
        createAddon,
        updateAddon,
        removeAddon,
        errors,
        loading,
    };
};

export default useAddonsApi;
