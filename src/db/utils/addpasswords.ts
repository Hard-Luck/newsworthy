import { hashPassword } from '../../auth';
import users from '../data/development-data/users';
import fs from 'fs';
type User = {
  username: string;
  password?: string;
  avatar_url: string;
  name: string;
};
async function main() {
  for (let i = 0; i < users.length; i++) {
    const user = users[i] as User;
    user.password = await hashPassword(user.username);
  }
  fs.writeFileSync(
    `${__dirname}/../data/development-data/users.ts`,
    `const users = ${JSON.stringify(users)}`
  );
}
main();
