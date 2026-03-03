const mockSelect = jest.fn();
const mockFrom = jest.fn();
const mockLeftJoin = jest.fn();

jest.mock("@/db/connect", () => ({
  __esModule: true,
  default: {
    select: mockSelect,
  },
}));

import { findAllWithVariant } from "@/repositories/productRepository";

// #region UTC-01-13
describe("UTC-01-13: findAllWithVariant()", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockSelect.mockReturnValue({
      from: mockFrom,
    });

    mockFrom.mockReturnValue({
      leftJoin: mockLeftJoin,
    });

    mockLeftJoin
      .mockReturnValueOnce({ leftJoin: mockLeftJoin })
      .mockReturnValueOnce({ leftJoin: mockLeftJoin });
  });

  it("should return wooden toy product rows when query succeeds", async () => {
    const mockRows = [
      {
        productId: 1,
        productName: "Wooden Train",
        productImageUrl: "wooden-train.jpg",
        variantId: 101,
        qty: 50,
        minStock: 10,
        variantUpdatedAt: new Date("2025-02-01"),
        variantImageUrl: "wooden-train-red.jpg",
        size: "Small",
        color: "Red",
      },
      {
        productId: 2,
        productName: "Wooden Puzzle",
        productImageUrl: "wooden-puzzle.jpg",
        variantId: 201,
        qty: 30,
        minStock: 5,
        variantUpdatedAt: new Date("2025-02-02"),
        variantImageUrl: "wooden-puzzle-blue.jpg",
        size: "Medium",
        color: "Blue",
      },
    ];

    mockLeftJoin.mockResolvedValueOnce(mockRows);

    const result = await findAllWithVariant();

    expect(mockSelect).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockRows);
  });

  it("should return empty array when no wooden toy data found", async () => {
    mockLeftJoin.mockResolvedValueOnce([]);

    const result = await findAllWithVariant();

    expect(result).toEqual([]);
  });

  it("should throw error when database fails", async () => {
    mockSelect.mockImplementation(() => {
      throw new Error("Database error");
    });

    await expect(findAllWithVariant()).rejects.toThrow(
      "Database error"
    );
  });
});