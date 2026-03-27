import type { TransactionStatus } from "@/models/transaction";
import { LazadaProductPattern } from "./aliases/lazada-pattern";
import { PaymentTypeAliases } from "./aliases/payment";
import { ShopeeProductPattern } from "./aliases/shopee-pattern";
import { TikTokProductPattern } from "./aliases/tiktok-patternt";

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
    const isAliasMatched = rule.aliases.some((a: RegExp) => a.test(productName));
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
