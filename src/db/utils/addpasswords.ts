import { hashPassword } from '../../auth';
import users from '../data/development-data/users';
import fs from 'fs';

async function main() {
    for (let i = 0; i < users.length; i++) {
        const user = users[i] as any
        user.password = await hashPassword(user.username);
    }
    fs.writeFileSync(`${__dirname}/../data/development-data/users.ts`, `const users = ${JSON.stringify(users)}`);
}
main();