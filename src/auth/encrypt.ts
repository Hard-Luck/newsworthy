import { hashPassword } from '.';

const password = process.argv[2];
const env = process.argv[3];
process.env.NODE_ENV = env;

hashPassword(password).then(console.log).catch(console.error);
