const { PrismaClient } = require('@prisma/client');
const { mockDeep, mockReset } = require('jest-mock-extended');

const mockPrisma = mockDeep();

jest.mock('./prisma', () => {
  return mockPrisma;
});

beforeEach(() => {
  mockReset(mockPrisma);
});

module.exports = {
    prismaMock: mockPrisma
};
