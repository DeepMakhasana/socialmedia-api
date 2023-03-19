const app = require("./app");
const dbConnect = require("./config/dbconfig");
const errorHandler = require("./middleware/errorHandler");


// database connection
dbConnect(process.env.MONGODB_URL);


app.listen(process.env.PORT, () => {
    console.log(`Sever start on http://localhost:${process.env.PORT}`);
})

// error Handler
app.use(errorHandler);