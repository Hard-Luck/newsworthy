import db from "../db/connection";
export async function getAllUsers() {
    const { rows } = await db.query("SELECT username, name, avatar_url FROM users");
    return rows;
}

export async function getUserByUsername(username: string) {
    const { rows } = await db.query(
        "SELECT username, name, avatar_url FROM users WHERE username = $1",
        [username]
    );
    if (!rows[0]) {
        return Promise.reject({ status: 404, msg: "Not found" });
    }
    return rows[0];

}