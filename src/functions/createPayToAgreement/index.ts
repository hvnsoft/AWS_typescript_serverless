const { ENV, REGION } = process.env;
const isProd = ENV === 'prod';
import {
  createPayToAgreement,
  createZaiAuthToken,
  CreateZaiAuthTokenResponse,
  getPayToAgreement,
  isAuthTokenExpired,
} from '/opt/zai';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { AppSyncResolverHandler } from 'aws-lambda';

const secretManager = new SecretsManagerClient({ region: REGION });

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

const initZai = async () => {
  // get secret from aws secrets manager after init from aws-sdk v3
  try {
    const zaiEnv = isProd ? 'prod' : 'dev';
    const response = await secretManager.send(
      new GetSecretValueCommand({ SecretId: `ZaiSecrets-${zaiEnv}` })
    );

    // access zaiClientSecret from secret
    if (response.SecretString) {
      const secrets = JSON.parse(response.SecretString);
      zaiClientSecret = secrets.zaiClientSecret;
    }
  } catch (err: any) {
    console.log('ERROR get secret: ', err);
    throw new Error(err.message);
  }

  if (isAuthTokenExpired(zaiAuthToken)) {
    try {
      zaiAuthToken = await createZaiAuthToken({ zaiClientSecret });
      console.log('zaiAuthToken: ', zaiAuthToken);
    } catch (err: any) {
      console.log('ERROR createZaiAuthToken: ', err);
      throw new Error(err.message);
    }
  }

  return {
    zaiAuthToken,
    zaiClientSecret,
  };
};

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  console.log('EVENT RECEIVED: ', JSON.stringify(ctx));
  const { sub, sourceIp } = ctx.identity as AppSyncIdentityCognito;
  const { agreementUuid } = ctx.arguments.input;

  console.log('sourceIp: ', sourceIp);

  await initZai();

  let agreement;
  try {
    agreement = await getPayToAgreement(
      zaiAuthToken?.access_token,
      agreementUuid
    );
    console.log('agreement: ', agreement);
  } catch (err: any) {
    console.log('ERROR getPayToAgreement: ', err);
    throw new Error(err.message);
  }

  if (sub !== agreement?.user_external_id) {
    throw new Error('UNAUTHORISED_PAYTO');
  }

  let createdAgreement;
  try {
    createdAgreement = await createPayToAgreement(
      zaiAuthToken?.access_token,
      agreementUuid
    );
    console.log('createdAgreement: ', createdAgreement);
  } catch (err: any) {
    console.log('ERROR createPayToAgreement: ', err);
    throw new Error(err.message);
  }

  return {
    agreementUuid: createdAgreement.agreement_uuid,
    status: createdAgreement.status,
    createdAt: createdAgreement.created_at,
    updatedAt: createdAgreement.updated_at,
  };
};
