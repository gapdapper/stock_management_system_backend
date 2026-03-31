import type { TransactionStatus } from "@/models/transaction";
import { LazadaProductPattern } from "./aliases/lazada-pattern";
import { PaymentTypeAliases } from "./aliases/payment";
import { ShopeeProductPattern } from "./aliases/shopee-pattern";
import { TikTokProductPattern } from "./aliases/tiktok-pattern";
import * as platformProductMappingRepository from "@/repositories/platformProductMappingRepository";
import * as variantMappingRepository from "@/repositories/variantMappingRepository";
import * as productVariantRepository from "@/repositories/productVariantRepository";
import { platform } from "@/db/schema";

// #region variant/product finder
export function variantIdFinder(
  productId: number,
  productName: string,
  variant: string,
  provider: string,
) {
  const variantSource = platformMapper(provider).productPattern;

  const DEFAULT_COLOR = 14;
  const DEFAULT_SIZE = 5;

  const rules = variantSource
    .filter((p: any) => p.productId === productId)
    .sort((a: any, b: any) => b.priority - a.priority);

  const matchPatterns = (patternsGroup: any[], text: string) => {
    for (const group of patternsGroup) {
      for (const pattern of group.patterns) {
        if (pattern.test(text)) {
          return group;
        }
      }
    }
    return null;
  };

  for (const rule of rules) {
    const isAliasMatched = rule.aliases.some((a: RegExp) =>
      a.test(productName),
    );
    if (!isAliasMatched) continue;
    let colorId = DEFAULT_COLOR;
    let sizeId = DEFAULT_SIZE;

    if (variant) {
      const colorMatch = matchPatterns(
        rule.externalVariant.colorPatterns,
        variant,
      );
      const sizeMatch = matchPatterns(
        rule.externalVariant.sizePatterns,
        variant,
      );

      if (colorMatch) colorId = colorMatch.colorId;
      if (sizeMatch) sizeId = sizeMatch.sizeId;

      if (colorMatch || sizeMatch) {
        return { colorId, sizeId };
      }
    }

    if (productName) {
      const colorMatch = matchPatterns(
        rule.inlineVariant.colorPatterns,
        productName,
      );
      const sizeMatch = matchPatterns(
        rule.inlineVariant.sizePatterns,
        productName,
      );

      if (colorMatch) colorId = colorMatch.colorId;
      if (sizeMatch) sizeId = sizeMatch.sizeId;

      if (colorMatch || sizeMatch) {
        return { colorId, sizeId };
      }
    }
  }

  return { colorId: DEFAULT_COLOR, sizeId: DEFAULT_SIZE };
}

export function productIdFinder(productName: string, provider: string) {
  const productPattern = platformMapper(provider).productPattern;

  const prioritizedPatterns = productPattern.sort(
    (a: any, b: any) => b.priority - a.priority,
  );

  for (const p of prioritizedPatterns) {
    for (const a of p.aliases) {
      const matched = a.test(productName);
      if (matched) {
        return p.productId;
      }
    }
  }
}
// #endregion variant/product finder

// #region mapper
export function paymentTypeMapper(rawPaymentType: string): number {
  const mapping: Record<string, number> = {
    "Credit Card": 1,
    PayPal: 2,
    COD: 3,
    "Bank Transfer": 4,
  };
  return mapping[rawPaymentType] || 1;
}

export function platformMapper(rawPlatform: string): any {
  const mapping: Record<string, any> = {
    shopee: {
      id: 1,
      productPattern: ShopeeProductPattern,
    },
    lazada: {
      id: 2,
      productPattern: LazadaProductPattern,
    },
    tiktok: {
      id: 3,
      productPattern: TikTokProductPattern,
    },
  };
  return mapping[rawPlatform] || 1;
}

export function statusMapper(
  rawStatus: string,
  provider: string,
): TransactionStatus {
  if (provider === "shopee") {
    const statusMapping: Record<string, string> = {
      สำเร็จแล้ว: "completed",
      จัดส่งสำเร็จแล้ว: "delivered",
      ยกเลิกแล้ว: "cancelled",
      การจัดส่ง: "shipped",
      ที่ต้องจัดส่ง: "order placed",
    };
    if (rawStatus.startsWith("ผู้ซื้อได้รับสินค้าแล้ว")) return "delivered";
    return (
      (statusMapping[rawStatus as string] as TransactionStatus) ||
      "order placed"
    );
  }

  if (provider === "lazada") {
    const statusMapping: Record<string, string> = {
      confirmed: "completed",
      delivered: "delivered",
      ยกเลิกแล้ว: "cancelled",
      shipped: "shipped",
      pending: "order placed",
    };

    return (
      (statusMapping[rawStatus as string] as TransactionStatus) ||
      "order placed"
    );
  }

  if (provider === "tiktok") {
    const statusMapping: Record<string, string> = {
      เสร็จสมบูรณ์: "completed",
      ยกเลิกแล้ว: "cancelled",
      จัดส่งแล้ว: "shipped",
      ที่จะจัดส่ง: "order placed",
    };

    return (
      (statusMapping[rawStatus as string] as TransactionStatus) ||
      "order placed"
    );
  }

  return "order placed";
}

// #endregion mapper

// #region payment type finder
export function lookupPaymentTypeId(rawPaymentType: string): number {
  if (!rawPaymentType) return 12;
  const cleanRawPaymentType = rawPaymentType.trim().toLowerCase();
  for (const p of PaymentTypeAliases) {
    for (const alias of p.pattern) {
      const matched = alias.test(cleanRawPaymentType);
      if (matched) {
        return p.id;
      }
    }
  }
  return 12;
}
// #endregion payment type finder

// #region other helpers
export function cleanSheetData(rawData: any[]): any[] {
  const cleanedData = rawData.map((row) => {
    const newRow: any = {};

    for (const key in row) {
      const value = row[key];

      if (typeof value === "string") {
        newRow[key] = value.replaceAll("\t", " ").trim();
      } else {
        newRow[key] = value;
      }
    }

    return newRow;
  });
  return cleanedData;
}
// #endregion other helpers


// #region improved resolver
function normalize(text: string) {
  return text.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();
}

export async function resolveVariant(
  platformId: number,
  externalProductSku: string,
  productName: string,
  variation: string,
) {
  // ✅ 1. หา product จาก SKU ก่อน
  let productId = null;

  if (externalProductSku) {
    const formattedSku =
      platformId === 2 ? externalProductSku.split("-")[0] : externalProductSku;
    const mappedProduct =
      await platformProductMappingRepository.findProductBySkuAndPlatform(
        formattedSku!,
        platformId,
      );

    if (mappedProduct) {
      console.log(`Found product mapping for SKU ${formattedSku} on platform ${platformId}: productId ${mappedProduct.productId}`);
      productId = mappedProduct.productId;
    }
  }

  // 🟡 fallback
  // if (!productId) {
  //   productId = productIdFinder(productName, ""); // ใช้ของเดิมไปก่อน
  // }

  if (!productId) return null;

  // ✅ 2. build raw text
  const rawVariant = normalize(`${productName} ${variation}`);

  // ✅ 4. fallback parser
  const parsed = smartVariantResolver(rawVariant, variation, platformId);

  const productVariant =
    await productVariantRepository.findByProductIdAndAttributesId(
      productId,
      parsed.colorId,
      parsed.sizeId,
    );

    console.log("Resolver Debug:", {
      productId,
      rawVariant,
      parsed,
      foundVariant: !!productVariant,
    });

  if (!productVariant) {
    return {
      productId,
      productVariantId: null,
      rawVariant,
    };
  }

  return {
    productId,
    productVariantId: productVariant.id,
    rawVariant,
  };
}

type VariantResult = {
  colorId: number;
  sizeId: number;
};

const DEFAULT_COLOR = 14; // No Color
const DEFAULT_SIZE = 5; // No Size

type SizeKey = "s" | "m" | "l" | "xl" | null;
type VersionKey = "v2" | null;

function normalizeVariant(str: string) {
  return (str || "")
    .toLowerCase()
    .replace(/\./g, "") // v.2 -> v2
    .replace(/:/g, " ") // variant3:L -> variant3 L
    .replace(/\s+/g, " ")
    .trim();
}

// -------------------------
// 🔥 EXTRACT SIZE (robust)
// -------------------------
function extractSize(text: string): SizeKey {
  // 1. size l
  let match = text.match(/\bsize\s*(s|m|l|xl)\b/);
  if (match) return match[1] as SizeKey;

  // 2. variant3 l
  match = text.match(/\bvariant\d*\s*(s|m|l|xl)\b/);
  if (match) return match[1] as SizeKey;

  // 3. standalone (strict word only)
  match = text.match(/\b(s|m|l|xl)\b/);
  if (match) return match[1] as SizeKey;

  return null;
}

// -------------------------
// 🔥 EXTRACT VERSION
// -------------------------
function extractVersion(text: string): VersionKey {
  if (/\bv2\b|version\s*2/.test(text)) return "v2";
  return null;
}

export function smartVariantResolver(
  text: string,
  rawVariation: string,
  platformId: number,
): VariantResult {
  const normalizedText = normalizeVariant(text);
  const normalizedVar = normalizeVariant(rawVariation);

  // 🔥 IMPORTANT: variation priority สูงกว่า
  const combined = `${normalizedVar} ${normalizedText}`;

  let colorId = DEFAULT_COLOR;
  let sizeId = DEFAULT_SIZE;

  // -------------------------
  // 🔥 GENERIC PARSING (ใหม่)
  // -------------------------
  const size = extractSize(combined);
  const version = extractVersion(combined);

  // -------------------------
  // 🔥 SIZE MAPPING (generic)
  // -------------------------
  if (version === "v2") {
    if (size === "m")
      sizeId = 6; // M V2
    else if (size === "l") sizeId = 7; // L V2
  } else {
    if (size === "s") sizeId = 1;
    else if (size === "m") sizeId = 2;
    else if (size === "l") sizeId = 3;
    else if (size === "xl") sizeId = 4;
  }

  // -------------------------
  // 🔥 COLOR (specific ก่อน)
  // -------------------------
  if (/red\s*white|แดง\s*ขาว/.test(combined)) {
    colorId = 5;
  } else if (/black\s*white|ดำ\s*ขาว/.test(combined)) {
    colorId = 6;
  } else if (/new\s*red/.test(combined)) {
    colorId = 7;
  } else if (/new\s*green/.test(combined)) {
    colorId = 8;
  }

  // -------------------------
  // 🔥 SPECIAL CASE: Jenga Colorful standalone → No Color
  // -------------------------
  if (/genga\s*colorful/i.test(combined)) {
    colorId = 14;
  }

  // -------------------------
  // 🔥 SPECIAL CASE: Lazada (platformId === 2)
  // -------------------------
  if (
    /genga.*colorful|colorful.*genga/i.test(combined) &&
    platformId === 2 &&
    rawVariation
  ) {
    if (size === "m") sizeId = 6;
    else if (size === "l") sizeId = 7;
  }

  // -------------------------
  // 🔥 SPECIAL CASE: TikTok (platformId === 3)
  // -------------------------
  if (platformId === 3) {
    const isV2 = version === "v2";

    if (/colorful\s*genga/i.test(combined)) {
      if (isV2) {
        if (size === "s")
          sizeId = 6; // business rule เดิม
        else if (size === "m") sizeId = 6;
        else if (size === "l") sizeId = 7;
      } else {
        if (size === "s") sizeId = 1;
        else if (size === "m") sizeId = 2;
        else if (size === "l") sizeId = 3;
      }
      colorId = 14;
    }

    if (/^genga\b/i.test(combined) && !/colorful/i.test(combined)) {
      if (size === "s") sizeId = 1;
      else if (size === "m") sizeId = 2;
      else if (size === "l") sizeId = 3;
      colorId = 14;
    }
  }

  // -------------------------
  // 🔥 COLOR (generic)
  // -------------------------
  else if (/colorful/.test(combined) && !/genga/.test(combined)) {
    colorId = 9;
  } else if (/red|แดง/.test(combined)) {
    colorId = 1;
  } else if (/blue|น้ำเงิน/.test(combined)) {
    colorId = 2;
  } else if (/green|เขียว/.test(combined)) {
    colorId = 3;
  } else if (/orange|ส้ม/.test(combined)) {
    colorId = 4;
  } else if (/white|ขาว/.test(combined)) {
    colorId = 13;
  }

  // -------------------------
  // 🔥 SPECIAL (points)
  // -------------------------
  if (/6\s*point/.test(combined)) {
    colorId = 10;
  } else if (/9\s*point/.test(combined)) {
    colorId = 11;
  } else if (/12\s*point/.test(combined)) {
    colorId = 12;
  }

  return { colorId, sizeId };
}
// #endregion improved resolver 