import { OAuth2Client } from "google-auth-library";
import yargs from "yargs";

type GoogleCredentialsOptions = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
};

export type OAuth2ClientArgument = {
  oauth2Client: OAuth2Client;
};

export function addGoogleCredentialsOptions<T>(yargs: yargs.Argv<T>) {
  return yargs
    .options({
      clientId: {
        type: "string",
        default: process.env.NODE_CLIENT_ID,
        defaultDescription: "$NODE_CLIENT_ID",
        demandOption: true,
      },
      clientSecret: {
        type: "string",
        default: process.env.NODE_CLIENT_SECRET,
        defaultDescription: "$NODE_CLIENT_SECRET",
        demandOption: true,
      },
      refreshToken: {
        type: "string",
        default: process.env.NODE_REFRESH_TOKEN,
        defaultDescription: "$NODE_REFRESH_TOKEN",
        demandOption: true,
      },
    })
    .middleware(injectOAuth2Client);
}

function injectOAuth2Client(_argv: any): OAuth2ClientArgument {
  const argv = _argv as GoogleCredentialsOptions; // FIXME:

  return {
    oauth2Client: createOAuth2Client(argv),
  };
}

function createOAuth2Client({ clientId, clientSecret, refreshToken }: GoogleCredentialsOptions) {
  const client = new OAuth2Client(clientId, clientSecret);
  client.credentials = { refresh_token: refreshToken };

  return client;
}
