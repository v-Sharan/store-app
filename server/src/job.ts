import cron from "cron";
import https from "https";
import * as env from "dotenv";

env.config();

const url = process.env.API_URL!;

const jobs = new cron.CronJob("*/14 * * * *", function () {
  https
    .get(url, (res) => {
      if (res.statusCode === 200)
        console.log("GET Request Sent Successfully!.");
      else console.log("GET Request Failed", res.statusCode);
    })
    .on("error", (e) => console.log("Error while sending Request", e));
});

export default jobs;
