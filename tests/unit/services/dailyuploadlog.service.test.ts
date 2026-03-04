import * as dailyUploadLogRepository from "@/repositories/dailyUploadLogRepository";
import { getUploadLog } from "@/services/dailyUploadLogService";

jest.mock("@/repositories/dailyUploadLogRepository", () => ({
  findUploadLog: jest.fn(),
}));

describe("UTC-SVC-UPLOADLOG-01: getUploadLog()", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("ID-01: Should return upload log when repository returns data", () => {
    it("should return upload log object", async () => {
      const mockData = {
        id: 1,
        uploadAt: new Date("2026-03-05"),
      };

      (dailyUploadLogRepository.findUploadLog as jest.Mock)
        .mockResolvedValue(mockData);

      const result = await getUploadLog();

      expect(dailyUploadLogRepository.findUploadLog).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });
  });

  describe("ID-02: Should return undefined when repository returns undefined", () => {
    it("should return undefined", async () => {
      (dailyUploadLogRepository.findUploadLog as jest.Mock)
        .mockResolvedValue(undefined);

      const result = await getUploadLog();

      expect(dailyUploadLogRepository.findUploadLog).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });
  });

  describe("ID-03: Should throw error when repository throws error", () => {
    it("should propagate error", async () => {
      const mockError = new Error("Database error");

      (dailyUploadLogRepository.findUploadLog as jest.Mock)
        .mockRejectedValue(mockError);

      await expect(getUploadLog()).rejects.toThrow("Database error");

      expect(dailyUploadLogRepository.findUploadLog).toHaveBeenCalledTimes(1);
    });
  });
});