import * as dailyUploadLogRepository from "@/repositories/dailyUploadLogRepository";
import axios from "axios";

const HEADERS = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.WEBHOOK_TOKEN}`,
};

const URL = "https://api.line.me/v2/bot/message/push";

export const checkDailyUploadLog = async (date: Date) => {
    date.setHours(0, 0, 0, 0);

    const lastUploadLog = await dailyUploadLogRepository.findUploadLog();
    if (lastUploadLog && lastUploadLog.uploadAt >= date) {
        console.log("LINE notification was skipped: upload already done today.");
    } else {
        await axios.post(URL, {
            to: "Cd06404215eac49328d5c1d4029193a7c",
            messages: [
                {
                    type: "text",
                    text: "วันนี้ยังไม่พบการอัปโหลดไฟล์เข้าระบบ กรุณาตรวจสอบและอัปโหลดให้เรียบร้อยค่ะ/ครับ 🙏",
                },
            ],
        },
        { headers: HEADERS })
    }
}

export const getUploadLog = async () => {
    const uploadLog = await dailyUploadLogRepository.findUploadLog();
    return uploadLog;
}