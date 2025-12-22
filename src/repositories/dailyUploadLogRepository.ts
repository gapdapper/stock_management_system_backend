import db from "@/db/connect";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

export const getUploadLog = async () => {
    const uploadLog = await db.query.dailyUploadLog.findFirst();
    return uploadLog;
}

export const updateDailyUploadLog = async (uploadAt: Date) => {
    const result = await db.update(schema.dailyUploadLog).set({
        uploadAt: uploadAt,
    }).where(eq(schema.dailyUploadLog.id, 1)).returning();
    return result;
}