import dotenv from 'dotenv';

dotenv.config();

type IEnvironment = {
  mongodb_url: string,
  jwt_secret: string,
  jwt_refresh_secret: string,
  collect_api_token: string,
  admin_password: string,
  aws_access_key_id: string,
  aws_secret_access_key: string
}

const environment: IEnvironment = {
  mongodb_url: process.env.MONGODB_URL as string,
  jwt_secret: process.env.jwt_secret as string,
  jwt_refresh_secret: process.env.jwt_refresh_secret as string,
  collect_api_token: process.env.collect_api_token as string,
  admin_password: process.env.admin_psw as string,
  aws_access_key_id:  process.env.AWS_ACCESS_KEY_ID as string,
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY as string,
}

export default environment;