import {MongoClient} from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

let conn;
try{
    console.log("Connecting to Local MongoDB");
    conn = await client.connect();

} catch(e){
    console.error(e);
}

let db = conn.db("memeber");

export default db;