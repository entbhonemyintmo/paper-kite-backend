const cron = require("node-cron");
const api = require("axios");

const CronExpression = require("../utils/cronExpression");

const Batch = require("../models/Batch");
const { BatchStatus } = require("../utils/batchStatus");
const { default: mongoose } = require("mongoose");
const toSendSchema = require("../models/ToSend");

/**
 * check in progress batch and
 * update status to in progress if there is not currently sending batch
 */
cron.schedule(CronExpression.EVERY_SECOND, async () => {
  const inProgressBatch = await Batch.findOne({
    status: BatchStatus.IN_PROGRESS,
  });

  if (!inProgressBatch) {
    await Batch.findOneAndUpdate(
      {
        status: BatchStatus.PENDING,
        scheduleAt: { $lte: new Date().toISOString() },
      },
      { status: BatchStatus.IN_PROGRESS },
      { new: true }
    );
  }
});

/**
 * send messsage to 10 phone numbers at every 5s
 */
cron.schedule(CronExpression.EVERY_5_SECONDS, async () => {
  try {
    const inProgressBatch = await Batch.findOne({
      status: BatchStatus.IN_PROGRESS,
    });

    if (!inProgressBatch) {
      return;
    }

    const toSends = inProgressBatch.toSend
      .filter((obj) => !obj.isSent)
      .slice(0, 10);

    if (!toSends.length) {
      await Batch.findByIdAndUpdate(inProgressBatch.id, {
        status: BatchStatus.COMPLETED,
        compeleteDate: new Date().toISOString(),
      });
    }

    const promises = toSends.map(async (toSend) => {
      try {
        const res = await api.post(
          `${process.env.SMS_GATEWAY_URL}/send`,
          toSend
        );

        if (res.status === 200) {
          await Batch.findOneAndUpdate(
            { _id: inProgressBatch.id, "toSend._id": toSend.id },
            {
              $set: {
                "toSend.$.isSent": true,
                "toSend.$.dateSent": new Date().toISOString(),
              },
              $inc: {
                success: 1,
              },
            }
          );

          console.log("Message sent successfully");
        } else {
          await Batch.findOneAndUpdate(
            { _id: inProgressBatch.id, "toSend._id": toSend.id },
            {
              $set: {
                "toSend.$.isSent": true,
                "toSend.$.dateSent": new Date().toISOString(),
              },
              $inc: {
                failed: 1,
              },
            }
          );
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error processing batch:", error);
  }
});
