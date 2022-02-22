jest.mock('redis', () => ({
    createClient: jest.fn().mockImplementation(() => ({
        duplicate: jest.fn().mockImplementation(() => ({
            on: jest.fn(),
            connect: jest.fn().mockResolvedValue(true),
            xRead: jest.fn().mockResolvedValue({}),
        })),
    })),
}));
