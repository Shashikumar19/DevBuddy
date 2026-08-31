const cron = require('node-cron');
const { subDays, startOfDay, endOfDay } = require('date-fns');
const Connectionreuest = require('../models/connectionrequest');
const sendEmail = require('./sendEmail')

cron.schedule("50 18 * * *", async () => {

    try {
        const yesterdays = subDays(new Date(), 0);
        const startTime = startOfDay(yesterdays);
        const endtime = endOfDay(yesterdays);
        console.log("yesterday", yesterdays);
        console.log("starttime", startTime);
        console.log("endtime", endtime)

        const requestedConnections = await Connectionreuest.find({
            status: "intrested",
            createdAt: {
                $gte: startTime,
                $lt: endtime,
            }
        }).populate("fromUserId toUserId");

        const toEmail = [...new Set(requestedConnections.map((raw) => raw.toUserId.email))]
   
        for (let email of toEmail) {
            const res = await sendEmail.run();
            console.log(res, email);

        }
    } catch (error) {
        console.log("error-->", error)
    }
})
