import { LazadaProductPattern } from "./aliases/lazada-pattern";
import { PaymentTypeAliases } from "./aliases/payment";
import { ShopeeProductPattern } from "./aliases/shopee-pattern";
import { TikTokProductPattern } from "./aliases/tiktok-patternt";

// #region variant/product finder
export function variantIdFinder(
  productId: number,
  productName: string,
  variant: string,
  provider: string
) {
  const variantSource = platformMapper(provider).productPattern;
  let colorId = 14; // default = No Color
  let sizeId = 5; // default = No Size
  let isColorMatched = false;
  let isSizeMatched = false;

  for (const p of variantSource) {
    if (p.productId === productId) {
      if (
        p.inlineVariant.colorPatterns.length === 0 &&
        p.inlineVariant.sizePatterns.length === 0 &&
        p.externalVariant.colorPatterns.length === 0 &&
        p.externalVariant.sizePatterns.length === 0
      ) {
        return { colorId: 14, sizeId: 5 };
      }

      if (p.externalVariant.colorPatterns.length > 0) {
        for (const colorPattern of p.externalVariant.colorPatterns) {
          for (const pattern of colorPattern.patterns) {
            const matched = pattern.test(variant);
            if (matched) {
              colorId = colorPattern.colorId;
              isColorMatched = true;
              break;
            }
          }
        }
      }

      if (p.externalVariant.sizePatterns.length > 0) {
        for (const sizePattern of p.externalVariant.sizePatterns) {
          for (const pattern of sizePattern.patterns) {
            const matched = pattern.test(variant);
            if (matched) {
              sizeId = sizePattern.sizeId;
              isSizeMatched = true;
              break;
            }
          }
        }
      }

      if (isColorMatched && isSizeMatched) {
        return { colorId, sizeId };
      }

      if (p.inlineVariant.colorPatterns.length > 0 && !isColorMatched) {
        for (const colorPattern of p.inlineVariant.colorPatterns) {
          for (const pattern of colorPattern.patterns) {
            const matched = pattern.test(productName);
            if (matched) {
              colorId = colorPattern.colorId;
              isColorMatched = true;
              break;
            }
          }
        }
      }

      if (p.inlineVariant.sizePatterns.length > 0 && !isSizeMatched) {
        for (const sizePattern of p.inlineVariant.sizePatterns) {
          for (const pattern of sizePattern.patterns) {
            const matched = pattern.test(productName);
            if (matched) {
              sizeId = sizePattern.sizeId;
              isSizeMatched = true;
              break;
            }
          }
        }
      }

      return { colorId, sizeId };
    }
  }
  return { colorId, sizeId };
}

export function productIdFinder(productName: string, provider: string) {
  const productPattern = platformMapper(provider).productPattern;

  const prioritizedPatterns = productPattern.sort(
    (a: any, b: any) => b.priority - a.priority
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
