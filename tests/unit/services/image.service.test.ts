jest.mock("@/repositories/productRepository", () => ({
  findById: jest.fn(),
  updateById: jest.fn(),
}));

jest.mock("@/repositories/productVariantRepository", () => ({
  findById: jest.fn(),
  updateById: jest.fn(),
}));

jest.mock("@/db/supabase", () => ({
  supabase: {
    storage: {
      from: jest.fn(),
    },
  },
}));

jest.mock("sharp", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

import { uploadImage } from "@/services/imageService";
import * as productRepository from "@/repositories/productRepository";
import * as productVariantRepository from "@/repositories/productVariantRepository";
import { supabase } from "@/db/supabase";
import sharp from "sharp";
import BadRequestError from "@/utils/errors/bad-request";
import { StorageError } from "@supabase/storage-js";

type ProductType = {
  id: number;
  createdAt: Date;
  productName: string;
  imageUrl: string | null;
  updatedAt: Date;
};

type VariantType = {
  id: number;
  createdAt: Date;
  imageUrl: string | null;
  updatedAt: Date;
  productId: number;
  colorId: number | null;
  sizeId: number | null;
  qty: number;
  minStock: number;
};

// #region UTC-01-09
describe("UTC-01-09: uploadImage()", () => {
  const mockFile: Express.Multer.File = {
    buffer: Buffer.from("test"),
    mimetype: "image/png",
    size: 1024,
  } as Express.Multer.File;

  const mockProduct: ProductType = {
    id: 1,
    productName: "Test Product",
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockVariant: VariantType = {
    id: 2,
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    productId: 1,
    colorId: null,
    sizeId: null,
    qty: 10,
    minStock: 1,
  };

  const mockUpload = jest.fn<
    Promise<{ error: StorageError | null }>,
    [string, Buffer, { contentType: string }]
  >();

  const mockRemove = jest.fn<
    Promise<{ error: StorageError | null }>,
    [string[]]
  >();

  const mockGetPublicUrl = jest.fn<{ data: { publicUrl: string } }, [string]>();

  beforeEach(() => {
    jest.clearAllMocks();

    (supabase.storage.from as jest.Mock).mockReturnValue({
      upload: mockUpload,
      getPublicUrl: mockGetPublicUrl,
      remove: mockRemove,
    });

    const sharpMock = jest.mocked(sharp);

    sharpMock.mockImplementation(
      () =>
        ({
          resize: jest.fn().mockReturnThis(),
          webp: jest.fn().mockReturnThis(),
          toBuffer: jest.fn().mockResolvedValue(Buffer.from("webp")),
        }) as any,
    );
  });

  it("ID-01: Should throw BadRequestError when entityType invalid", async () => {
    await expect(
      uploadImage("invalid" as any, 1, mockFile),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it("ID-02: Should throw when file is undefined", async () => {
    await expect(
      uploadImage("product", 1, undefined as unknown as Express.Multer.File),
    ).rejects.toThrow("No file provided");
  });

  it("ID-03: Should throw when file type invalid", async () => {
    const invalidFile = {
      ...mockFile,
      mimetype: "application/pdf",
    };

    await expect(
      uploadImage("product", 1, invalidFile as Express.Multer.File),
    ).rejects.toThrow("Invalid file type");
  });

  it("ID-04: Should throw BadRequestError when file too large", async () => {
    const largeFile = {
      ...mockFile,
      size: 6 * 1024 * 1024,
    };

    await expect(
      uploadImage("product", 1, largeFile as Express.Multer.File),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it("ID-05: Should throw when product not found", async () => {
    (productRepository.findById as jest.Mock).mockResolvedValue(undefined);

    await expect(uploadImage("product", 1, mockFile)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });

  it("ID-06: Should throw when upload fails", async () => {
    (productRepository.findById as jest.Mock).mockResolvedValue(mockProduct);

    mockUpload.mockResolvedValue({
      error: new StorageError("upload failed"),
    });

    await expect(uploadImage("product", 1, mockFile)).rejects.toThrow(
      "Failed to upload product image",
    );
  });

  it("ID-07: Should upload and update product successfully", async () => {
    (productRepository.findById as jest.Mock).mockResolvedValue(mockProduct);

    mockUpload.mockResolvedValue({ error: null });

    mockGetPublicUrl.mockReturnValue({
      data: { publicUrl: "http://test-url" },
    });

    const result = await uploadImage("product", 1, mockFile);

    expect(result).toBe("http://test-url");

    expect(productRepository.updateById).toHaveBeenCalledWith(1, {
      imageUrl: "http://test-url",
    });
  });

  it("ID-08: Should remove old image if exists", async () => {
    const productWithImage: ProductType = {
      ...mockProduct,
      imageUrl: "http://localhost/storage/v1/object/public/product/1/old.webp",
    };

    (productRepository.findById as jest.Mock).mockResolvedValue(
      productWithImage,
    );

    mockUpload.mockResolvedValue({ error: null });

    mockGetPublicUrl.mockReturnValue({
      data: { publicUrl: "http://new-url" },
    });

    await uploadImage("product", 1, mockFile);

    expect(mockRemove).toHaveBeenCalledWith(
      expect.arrayContaining([expect.any(String)]),
    );
  });

  it("ID-09: Should upload and update variant successfully", async () => {
    (productVariantRepository.findById as jest.Mock).mockResolvedValue(
      mockVariant,
    );

    mockUpload.mockResolvedValue({ error: null });

    mockGetPublicUrl.mockReturnValue({
      data: { publicUrl: "http://variant-url" },
    });

    const result = await uploadImage("variant", 2, mockFile);

    expect(result).toBe("http://variant-url");

    expect(productVariantRepository.updateById).toHaveBeenCalledWith(2, {
      imageUrl: "http://variant-url",
    });
  });
});
