import { CronJob } from "cron";
import * as productVariantService from "@/services/productVariantService";

let job: CronJob | null = null;

export function startLowStockNotifyJob() {
  if (job) return; // Job already started
  const schedule = "0 12 * * *";

  job = new CronJob(
    schedule, // Runs every day at lunch time
    async () => {
      await productVariantService.checkLowStockProduct();
    },
    null,
    true,
    "Asia/Bangkok",
  );

  job.start();
}
