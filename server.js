import app from "./app.js";
import dbConnection from "./DbConfig/dbConfig.js";
const PORT = process.env.PORT || 3001;

// crypto.randomBytes(16).toString("hex")

app.listen(PORT, async () => {
  await dbConnection();

  console.log(`Server is on PORT ${PORT}`);
});
