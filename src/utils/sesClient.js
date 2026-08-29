const  { SESClient,VerifyEmailIdentityCommand } = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = "ap-south-2";
// Credentials are automatically resolved using the AWS SDK credential provider chain.
// For more information, see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials-node.html
// Create SES service object.
const sesClient = new SESClient({ region: REGION,
    //credentials are important 
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY,
        secretAccessKey:process.env.AWS_SECRETE_KEY
    }    
 });
// module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]

// Optional :- sandbox needs to sides verification so need to verif the email before sending

const EMAIL_ADDRESS = "rathodshashikumar72@gmail.com";

const createVerifyEmailIdentityCommand = (emailAddress) => {
  return new VerifyEmailIdentityCommand({ EmailAddress: emailAddress });
};

const verifyEmail = async (email) => {
  const verifyEmailIdentityCommand =
    createVerifyEmailIdentityCommand(email);
  try {
    return await sesClient.send(verifyEmailIdentityCommand);
  } catch (err) {
    console.log("Failed to verify email identity.", err);
    return err;
  }
};
// snippet-end:[ses.JavaScript.identities.verifyEmailIdentityV3]
module.exports = { verifyEmail,sesClient};


