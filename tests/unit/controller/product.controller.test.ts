jest.mock("@/services/productService", () => ({
  getAllProductsWithVariant: jest.fn(),
}));

jest.mock("@/services/imageService", () => ({
  uploadImage: jest.fn(),
}));

import { type Request,type Response, type NextFunction } from "express";
import { getAllProductsWithVariant, uploadProductImage } from "@/controllers/productController";
import * as imageService from "@/services/imageService";
import * as productService from "@/services/productService";

// #region UTC-01-01
describe("UTC-01-01: getAllProductsWithVariant", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Case 1: Success
  it("should return 200 and shaped toy product list when service resolves", async () => {
    (productService.getAllProductsWithVariant as jest.Mock)
      .mockResolvedValue([
        {
          id: 1,
          productName: "Robot Action Figure",
          totalStock: 35,
          productImageUrl: "robot.jpg",
          lastUpdated: new Date("2026-01-20"),
          variants: [
            {
              size: "Medium",
              sub: [
                {
                  variantId: 101,
                  color: "Red",
                  stock: 20,
                  minStock: 5,
                  variantImageUrl: "robot-red.jpg",
                },
                {
                  variantId: 102,
                  color: "Blue",
                  stock: 15,
                  minStock: 5,
                  variantImageUrl: "robot-blue.jpg",
                },
              ],
            },
          ],
        },
      ]);

    await getAllProductsWithVariant(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);

    expect(mockResponse.json).toHaveBeenCalledWith({
      products: [
        {
          id: 1,
          productName: "Robot Action Figure",
          totalStock: 35,
          productImageUrl: "robot.jpg",
          lastUpdated: new Date("2026-01-20"),
          variants: [
            {
              size: "Medium",
              sub: [
                {
                  variantId: 101,
                  color: "Red",
                  stock: 20,
                  minStock: 5,
                  variantImageUrl: "robot-red.jpg",
                },
                {
                  variantId: 102,
                  color: "Blue",
                  stock: 15,
                  minStock: 5,
                  variantImageUrl: "robot-blue.jpg",
                },
              ],
            },
          ],
        },
      ],
    });

    expect(mockNext).not.toHaveBeenCalled();
  });

  // Case 2: Error
  it("should call next(error) when service throws error", async () => {
    (productService.getAllProductsWithVariant as jest.Mock)
      .mockRejectedValue(new Error("Database connection failed"));

    await getAllProductsWithVariant(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(
      new Error("Database connection failed")
    );

    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});


// #region UTC-01-02
describe("UTC-C01-02: uploadProductImage (Minimal)", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      params: { id: "1" },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Case 1: Success
  it("should return 200 and image URL when upload is successful", async () => {
    mockRequest.file = {
      originalname: "wooden-train.png",
      mimetype: "image/png",
    } as Express.Multer.File;

    (imageService.uploadImage as jest.Mock).mockResolvedValue(
      "http://mock-storage.com/wooden-train.png"
    );

    await uploadProductImage(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(imageService.uploadImage).toHaveBeenCalledWith(
      "product",
      1,
      mockRequest.file
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      result: "http://mock-storage.com/wooden-train.png",
    });

    expect(mockNext).not.toHaveBeenCalled();
  });

  // Case 2: Product not found
  it("should call next(error) when product is not found", async () => {
    mockRequest.file = {
      originalname: "wooden-train.png",
      mimetype: "image/png",
    } as Express.Multer.File;

    const error = {
      status: 404,
      errors: [
        {
          message: "Product or Product Variant not found",
          context: {},
        },
      ],
    };

    (imageService.uploadImage as jest.Mock).mockRejectedValue(error);

    await uploadProductImage(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(error);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  // Case 3: Missing file
  it("should return 400 when no file is uploaded", async () => {
    mockRequest.file = undefined;

    await uploadProductImage(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "No files uploaded",
    });

    expect(imageService.uploadImage).not.toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
  });

  // Case 4: Generic system error
  it("should call next(error) when unexpected error occurs", async () => {
    mockRequest.file = {
      originalname: "wooden-train.png",
      mimetype: "image/png",
    } as Express.Multer.File;

    const error = new Error("Something went wrong");

    (imageService.uploadImage as jest.Mock).mockRejectedValue(error);

    await uploadProductImage(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(error);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });
});