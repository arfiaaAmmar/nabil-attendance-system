import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { MONGODB_URI, app, port } from "./config/config";
import { getStudent, getAllStudents, registerStudent, removeStudent } from "./controllers/studentDbController";
import { deleteAttendanceRecord, deleteClassRecord, getAllClassRecords, getClassRecord, postAttendance, postClassRecord, updateClassRecord } from "./controllers/classRecordController";
import { deleteAdmin, getAdminData, loginAdmin, registerAdmin, updateAdminData } from "./controllers/adminController";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined");
}
//
//MongoDBの接続
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

//Endpoints
//User & Admin
app.post("/register-admin", registerAdmin);
app.post("/admin-login", loginAdmin);
app.get("/get-admin-data", getAdminData);
app.put("/update-admin-data", updateAdminData)
app.delete("/delete-admin/:adminId", deleteAdmin)
//Student DB
app.post("/register-student", registerStudent);
app.get("/get-student", getStudent)
app.get("/get-all-students", getAllStudents);
app.delete("/delete-student/:studentId", removeStudent);
//Class Record
app.post("/post-class-record", postClassRecord);
app.post("/post-attendance/:classId", postAttendance)
app.get("/get-class-record/:classId", getClassRecord);
app.get("/get-all-class-records", getAllClassRecords);
app.put("/update-class-record/:classId", updateClassRecord);
app.delete("/delete-class-record/:classId", deleteClassRecord);
app.delete("/delete-attendance/:classId", deleteAttendanceRecord);

//サーバーの起動
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

//
