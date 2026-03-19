jest.mock("@/services/productVariantService", () => ({
  editProductVariant: jest.fn(),
  restockProductVariant: jest.fn(),
}));

jest.mock("@/services/imageService", () => ({
  uploadImage: jest.fn(),
}));

import { type Request, type Response, type NextFunction } from "express";
import { editProductVariant, uploadProductVariantImage, restockProductVariant } from "@/controllers/productVariantController";
import * as productVariantService from "@/services/productVariantService";
import * as imageService from "@/services/imageService";

// #region UTC-01-03
describe("UTC-01-03: editProductVariant", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
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
  it("should return 200 and success message when variant is updated", async () => {
    mockRequest = {
      params: { id: "10" },
      body: {
        productId: 1,
        colorId: 2,
        sizeId: 3,
        qty: 25,
        minStock: 5,
        imageUrl: "wooden-car-red.png",
        updatedAt: new Date("2026-03-01"),
        createdAt: new Date("2026-01-01"),
      },
    };

    (productVariantService.editProductVariant as jest.Mock)
      .mockResolvedValue({ message: "success" });

    await editProductVariant(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(productVariantService.editProductVariant).toHaveBeenCalledWith({
      id: 10,
      ...mockRequest.body,
    });

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "success",
    });

    expect(mockNext).not.toHaveBeenCalled();
  });

  // Case 2: Invalid ID
  it("should return 400 when variant ID is invalid", async () => {
    mockRequest = {
      params: { id: "abc" },
    };

    await editProductVariant(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Invalid variant ID",
    });

    expect(productVariantService.editProductVariant).not.toHaveBeenCalled();
  });

  // Case 3: Service Error
  it("should call next(error) when service throws error", async () => {
    mockRequest = {
      params: { id: "10" },
      body: {
        productId: 1,
        colorId: 2,
        sizeId: 3,
        qty: 25,
        minStock: 5,
        imageUrl: "wooden-car-red.png",
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    };

    const error = new Error("Database failure");

    (productVariantService.editProductVariant as jest.Mock)
      .mockRejectedValue(error);

    await editProductVariant(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(error);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });
});


// #region UTC-01-04
describe("UTC-01-04: uploadProductVariantImage", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      params: { id: "20" },
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
      originalname: "wooden-car-blue.png",
      mimetype: "image/png",
    } as Express.Multer.File;

    (imageService.uploadImage as jest.Mock).mockResolvedValue(
      "http://mock-storage.com/wooden-car-blue.png"
    );

    await uploadProductVariantImage(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(imageService.uploadImage).toHaveBeenCalledWith(
      "variant",
      20,
      mockRequest.file
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      result: "http://mock-storage.com/wooden-car-blue.png",
    });

    expect(mockNext).not.toHaveBeenCalled();
  });

  // Case 2: Missing file
  it("should return 400 when no file is uploaded", async () => {
    mockRequest.file = undefined;

    await uploadProductVariantImage(
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

  // Case 3: Service error
  it("should call next(error) when service throws error", async () => {
    mockRequest.file = {
      originalname: "wooden-car-blue.png",
      mimetype: "image/png",
    } as Express.Multer.File;

    const error = new Error("Storage failure");

    (imageService.uploadImage as jest.Mock).mockRejectedValue(error);

    await uploadProductVariantImage(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(error);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });
});


// #region UTC-01-05
describe("UTC-01-05: restockProductVariant", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
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
  it("should return 200 and success message when restock succeeds", async () => {
    mockRequest = {
      body: {
        items: [
          { variantId: 10, qty: 5 },
          { variantId: 11, qty: 3 },
        ],
      },
    };

    (productVariantService.restockProductVariant as jest.Mock)
      .mockResolvedValue(undefined);

    await restockProductVariant(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(productVariantService.restockProductVariant).toHaveBeenCalledWith(
      mockRequest.body.items
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "success",
    });

    expect(mockNext).not.toHaveBeenCalled();
  });

  // Case 2: Empty array
  it("should return 400 when items array is empty", async () => {
    mockRequest = {
      body: { items: [] },
    };

    await restockProductVariant(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Restock payload is required",
    });

    expect(productVariantService.restockProductVariant).not.toHaveBeenCalled();
  });

  // Case 3: Not array
  it("should return 400 when items is not an array", async () => {
    mockRequest = {
      body: { items: null },
    };

    await restockProductVariant(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Restock payload is required",
    });

    expect(productVariantService.restockProductVariant).not.toHaveBeenCalled();
  });

  // Case 4: Service error
  it("should call next(error) when service throws error", async () => {
    mockRequest = {
      body: {
        items: [{ variantId: 10, qty: 5 }],
      },
    };

    const error = new Error("Database failure");

    (productVariantService.restockProductVariant as jest.Mock)
      .mockRejectedValue(error);

    await restockProductVariant(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(error);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });
});