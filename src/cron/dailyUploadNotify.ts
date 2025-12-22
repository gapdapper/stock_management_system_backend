import { CronJob } from 'cron';
import * as dailyUploadLogService from '@/services/dailyUploadLogService';

let job: CronJob | null = null;

export function startDailyUploadNotifyJob() {
    if (job) return; // Job already started

    job = new CronJob(
        '* * * * *', // Runs every day at lunch time
        async () => {
            await dailyUploadLogService.checkDailyUploadLog(new Date());
        },
        null,
        true,
        'Asia/Bangkok'
    );

    job.start();
}
