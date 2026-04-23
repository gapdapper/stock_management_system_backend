// tests/unit/repository/platformMappingRepository.test.ts
import { findProductBySkuAndPlatform } from "@/repositories/platformProductMappingRepository";
import db from "@/db/connect";

// ---- mock db ----
jest.mock("@/db/connect", () => ({
  query: {
    platformProductMapping: {
      findFirst: jest.fn(),
    },
  },
}));

// #region UTC-04-12
describe("UTC-04-12: findProductBySkuAndPlatform", () => {
  // ใช้ mock function ของ db.query.platformProductMapping.findFirst
  const mockFindFirst = db.query.platformProductMapping.findFirst as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks(); // ล้าง mock หลังแต่ละ test
  });

  it("TC-01: should return mapping when SKU and platformId match", async () => {
    const mockData = {
      id: 1,
      externalProductSku: "SKU123",
      platformId: 10,
      productId: 99,
    };

    mockFindFirst.mockResolvedValue(mockData);

    const result = await findProductBySkuAndPlatform("SKU123", 10);

    expect(mockFindFirst).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockData);
  });

  it("TC-02: should return null when mapping does not exist", async () => {
    mockFindFirst.mockResolvedValue(null);

    const result = await findProductBySkuAndPlatform("SKU_NOT_FOUND", 10);

    expect(mockFindFirst).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });

  it("TC-03: should return null when SKU is empty", async () => {
    mockFindFirst.mockResolvedValue(null);

    const result = await findProductBySkuAndPlatform("", 10);

    expect(mockFindFirst).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });

  it("TC-04: should return null when platformId is invalid", async () => {
    mockFindFirst.mockResolvedValue(null);

    const result = await findProductBySkuAndPlatform("SKU123", -1);

    expect(mockFindFirst).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });

  it("TC-05: should throw error when database fails", async () => {
    mockFindFirst.mockRejectedValue(new Error("DB Error"));

    await expect(
      findProductBySkuAndPlatform("SKU123", 10)
    ).rejects.toThrow("DB Error");
  });
});
// #endregion UTC-04-12