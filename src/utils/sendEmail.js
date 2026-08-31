const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");
const { mailBody } = require('./mailBody')

const createSendEmailCommand = (toAddress, fromAddress, sender, receiver) => {
  let composedMail = mailBody.replace('{{recipient}}', receiver);
  composedMail = composedMail.replaceAll('{{connectionrequester}}', sender);
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [
      ],
      ToAddresses: [
        toAddress,
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: composedMail,
        },
        Text: {
          Charset: "UTF-8",
          Data: "IM existed to send the email",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Connection Request",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async (sender, receiver) => {
  const sendEmailCommand = createSendEmailCommand(
    "rathodshashi2026@gmail.com",
    "rathodshashi2025@gmail.com",
    sender,
    receiver,
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };