import { vi } from "vitest";

export function mockFetchJson(body: unknown, status = 200) {
    const fetchMock = vi.fn(async () => ({
        ok: status >= 200 && status < 300,
        status,
        json: async () => body,
    }));

    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
}
