const mockSelect = jest.fn();
const mockWhere = jest.fn();
const mockInsert = jest.fn();
const mockUpdate = jest.fn();
const mockSet = jest.fn();
const mockReturning = jest.fn();
const mockFindFirst = jest.fn();

jest.mock("@/db/connect", () => ({
  __esModule: true,
  default: {
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,

        query: {
      dailyUploadLog: {
        findFirst: mockFindFirst,
      },
    },
  },
}));

jest.mock("drizzle-orm", () => ({
  eq: jest.fn(),
  sql: jest.fn(() => "mock-sql-expression"),
}));

import {
  updateDailyUploadLog,
  findUploadLog
} from "@/repositories/dailyUploadLogRepository";

// #region UTC-04-10
describe("UTC-04-10: updateDailyUploadLog()", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUpdate.mockReturnValue({
      set: mockSet,
    });

    mockSet.mockReturnValue({
      where: mockWhere,
    });

    mockWhere.mockReturnValue({
      returning: mockReturning,
    });
  });

  it("ID-01: Should update uploadAt and return updated row", async () => {
    const uploadDate = new Date("2026-03-04T10:00:00Z");

    const mockResult = [
      { id: 1, uploadAt: uploadDate },
    ];

    mockReturning.mockResolvedValue(mockResult);

    const result = await updateDailyUploadLog(uploadDate);

    expect(mockUpdate).toHaveBeenCalled();
    expect(mockSet).toHaveBeenCalledWith({
      uploadAt: uploadDate,
    });
    expect(mockWhere).toHaveBeenCalled();
    expect(mockReturning).toHaveBeenCalled();

    expect(result).toEqual(mockResult);
  });

  it("ID-02: Should return empty array if no row updated", async () => {
    mockReturning.mockResolvedValue([]);

    const result = await updateDailyUploadLog(new Date());

    expect(result).toEqual([]);
  });

  it("ID-03: Should throw error when database fails", async () => {
    mockReturning.mockRejectedValue(new Error("Database error"));

    await expect(updateDailyUploadLog(new Date()))
      .rejects
      .toThrow("Database error");
  });
});

// #region UTC-04-11
describe("UTC-04-11: findUploadLog()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ID-01: Should return upload log when record exists", async () => {
    const mockResult = {
      id: 1,
      uploadAt: new Date("2026-03-04T10:00:00Z"),
    };

    mockFindFirst.mockResolvedValue(mockResult);

    const result = await findUploadLog();

    expect(mockFindFirst).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });

  it("ID-02: Should return undefined when no record exists", async () => {
    mockFindFirst.mockResolvedValue(undefined);

    const result = await findUploadLog();

    expect(result).toBeUndefined();
  });

  it("ID-03: Should throw error when database fails", async () => {
    mockFindFirst.mockRejectedValue(new Error("Database error"));

    await expect(findUploadLog())
      .rejects
      .toThrow("Database error");
  });
});