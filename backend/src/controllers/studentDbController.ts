// studentController.ts
import { Request, Response } from "express";
import { IStudent, StudentModel } from "../model/model";

export const registerStudent = async (req: Request, res: Response) => {
  try {
    const { email, name, phone, course } = req.body;

    // Check if user already exists
    const existingUser = await StudentModel.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "User already exist" });

    // Create random matrik number based on current time
    const randomNumber = Math.floor(Math.random() * 10000);
    const formattedRandomNumber = randomNumber.toString().padStart(4, "0");

    const studentIdGeneration = `DKM-${formattedRandomNumber}-${formattedRandomNumber}`;

    // Create new user
    await StudentModel.create({
      studentId: studentIdGeneration,
      email,
      name,
      phone,
      course,
    });

    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    console.error("Error registering user", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getStudent = async (req: Request, res:Response) => {
  const { studentId } = req.params

  try {
    const student: IStudent | null = await StudentModel.findOne({ studentId })

    if(!student) return res.status(404).json({ message:"Student not found"})

    res.json(student)
  } catch (error ){
    console.error('Error retrieving student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await StudentModel.find({}, { password: 0 }).exec();

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }

    res.json(students);
  } catch (error) {
    return res.status(401).json({ message: "Students not found" });
  }
};

export const removeStudent = async (req: Request, res: Response) => {
  const { studentId } = req.params;

  try {
    // Check if student exists
    const existingStudent = await StudentModel.findById(studentId);
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Remove the student
    await StudentModel.findByIdAndDelete(studentId);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Failed to delete student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};