import db from "../db/connection";
export async function getAllUsers() {
    const { rows } = await db.query("SELECT username, name, avatar_url FROM users");
    return rows;
}