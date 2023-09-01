import { Schema, Document, model } from "mongoose";

type CollegeCourses =
  | "Food & Beverage"
  | "Information Technology"
  | "Security"
  | "Secretary";
type Classrooms = "Classroom 1" | "Classroom 2" | "Classroom 3";

// Define the User interface
export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface IStudent extends Document {
  studentId: string;
  name: string;
  phone: string;
  email: string;
  course: string;
}

export interface IClassRecord extends Document {
  classId: string;
  lecturer: string;
  classroom: Classrooms | string;
  course: CollegeCourses | string;
  date: string;
  startTime: string;
  endTime: string;
  attendance: {
    studentName: string;
    studentId: string;
    attendanceTime: string;
  }[];
}

// Define the User schema
const adminSchema = new Schema<IAdmin>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
});

// Create and export the User model
export const AdminModel = model<IAdmin>("Admin", adminSchema);

//Create a student database schema
const studentSchema = new Schema<IStudent>({
  studentId: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  course: { type: String, required: true },
});

export const StudentModel = model<IStudent>("Student", studentSchema);

//Create a class record/history schema
const classRecord = new Schema<IClassRecord>({
  classId: { type: String, required: true},
  lecturer: { type: String, required: true },
  course: { type: String, required: true },
  classroom: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  attendance: [
    {
      studentName: { type: String },
      studentId: { type: String },
      attendanceTime: { type: String },
    },
  ],
});

export const ClassRecordModel = model<IClassRecord>(
  "Class Record",
  classRecord
);


//If class time is not finish = Class in session 
//All class time is not finished go to Class Session