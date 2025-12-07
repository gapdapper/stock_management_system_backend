import {
  ProductAliases,
  ExtraCase,
  ExtraCaseVariantMap,
} from "@/utils/sheets/aliases/product";
import { ColorAliases, SizeAliases } from "./aliases/variant";

// #region product finder
export function lookupProductId(rawName: string, variant: string): number | null {
  const extra = findExtraCase(rawName);
  if (extra) {
    console.log("Found extra case:", extra);
    const extraCaseProduct = lookupProductIdWithVariant(variant, extra.id);
    if (extraCaseProduct) {
      return extraCaseProduct.productId;
    }
  }

  const cleanRawName = rawName.trim().replaceAll(" ", "").toLowerCase();

  for (const p of ProductAliases) {
    // first screening with exact match on alias
    for (const alias of p.alias) {
      if (!alias) continue;
      if (alias.trim().toLowerCase().replaceAll(" ", "") === cleanRawName) {
        return p.id;
      }
    }
  }

  for (const p of ProductAliases) {
    // second screening with regex match on alias
    for (const alias of p.pattern) {
      const regex = new RegExp(`(${alias})`, "g");
      if (regex.test(rawName)) {
        console.log("Regex match found");
        console.log("rawName:", rawName);
        return p.id;
      }
    }
  }

  console.log("No match found for rawName:", rawName);
  return null;
}
// #endregion product finder

// #region product finder extra cases
export function lookupProductIdWithVariant(
  variant: string,
  extraCaseId: number
): { productId: number; variantId: number } | null {
  const variantGroup = findExtraCaseVariantGroup(extraCaseId);

  for (const vg of variantGroup) {
    for (const v of vg.variantPattern) {
      if (v.variantName === variant) {
        return { productId: vg.id, variantId: v.id };
      }
    }
  }
  return null;
}

export function findExtraCaseVariantGroup(extraCaseId: number) {
  return ExtraCaseVariantMap[extraCaseId] ?? null;
}

export function findExtraCase(rawName: string) {
  for (const c of ExtraCase) {
    for (const alias of c.alias) {
      if (rawName.includes(alias) || rawName === alias) {
        return c;
      }
    }
  }
  return null;
}
// #endregion product finder extra cases


// #region variant finder
export function lookupVariantId(rawName: string, variant: string): {ColorId: number, SizeId: number} {
  let ColorId = 7;
  let SizeId = 5;

  // find color
  for (const color of ColorAliases) {
    for (const pattern of color.pattern) {
      const regex = new RegExp(`(${pattern})`, "g");
      if (regex.test(variant)) {
        ColorId = color.id;
        break;
      }
    }
  }

  for (const size of SizeAliases) {
    for (const pattern of size.pattern) {
      const regex = new RegExp(`(${pattern})`, "g");
      if (regex.test(variant)) {
        SizeId = size.id;
        break;
      }
    }
  }

  // fallback to rawName if no variant provided
  if (!variant) {
    for (const color of ColorAliases) {
      for (const pattern of color.pattern) {
        const regex = new RegExp(`(${pattern})`, "g");
        if (regex.test(rawName)) {
          ColorId = color.id;
          break;
        }
    }
  }
    for (const size of SizeAliases) {
      for (const pattern of size.pattern) {
        const regex = new RegExp(`(${pattern})`, "g");
        if (regex.test(rawName)) {
          SizeId = size.id;
          break;
        }
    }
  }
}

  return {ColorId, SizeId};
}
// #endregion variant finder