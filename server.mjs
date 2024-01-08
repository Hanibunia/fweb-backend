import express from "express";
import cors from "cors";
import memberRouter from "./routes/memeber.mjs";
import loginRouter from "./routes/login.mjs"; // Make sure to import the correct file



const PORT = process.env.PORT || 5050;
const app = express();
app.use(express.json({ limit: "10mb" }));


app.use(cors());
app.use(express.json());

app.use("/member", memberRouter);
app.use("/login", loginRouter);


app.listen(PORT, ()=>{
    console.log(`Server is running on port: http://localhost:${PORT}`);
})
