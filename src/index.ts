
import * as express from 'express';
import * as bodyParser from "body-parser";
import "reflect-metadata";
import { createConnection } from "typeorm";
import * as appController from "./controllers/appController";



const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 3000);


app.listen(app.get("port"), () => {
    console.log(("  Server is started at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
});


app.get("/api/commonstudents", appController.getCommonStudents);
app.post("/api/register", appController.registerStudent);
app.post("/api/suspend", appController.suspendStudent);
app.post("/api/retrievefornotifications", appController.retrieveForNotifications);



createConnection().then(async connection => {
   // console.log("DataBase is connected.");

}).catch(error => console.log("Error occured during DB Connection: ", error));

module.exports = app;
