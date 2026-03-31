import db from "@/db/connect";
import * as schema from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const findProductBySkuAndPlatform = async (
  externalProductSku: string,
  platformId: number,
) => {
  const mapping = await db.query.platformProductMapping.findFirst({
    where: and(
      eq(schema.platformProductMapping.externalProductSku, externalProductSku),
      eq(schema.platformProductMapping.platformId, platformId),
    ),
  });

  return mapping;
};
