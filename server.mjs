import express from "express";
import cors from "cors";
import memeber from "./routes/memeber.mjs";

const PORT = process.env.PORT || 5051;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/memeber", memeber);


app.listen(PORT, ()=>{
    console.log(`Server is running on port: http://localhost:${PORT}`);
})