import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

let conn;
try {
    console.log("Connecting to Local MongoDB");
    conn = await client.connect();
} catch (e) {
    console.error(e);
}

let db = conn.db("member");

async function closeConnection() {
    try {
        if (conn) {
            await conn.close();
            console.log("MongoDB connection closed");
        }
    } catch (e) {
        console.error("Error closing MongoDB connection:", e);
    }
}

export { db, closeConnection, client };
