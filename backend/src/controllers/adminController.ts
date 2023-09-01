// adminController.ts
import { Request, Response } from "express";
import { IAdmin, AdminModel } from "../model/model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { JWT_SECRET } from "../config/config";
import { Document } from "mongoose";

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body as Omit<
      IAdmin,
      keyof Document
    >;

    // Check if user already exists
    const existingUser = await AdminModel.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await AdminModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await AdminModel.findOne({ email });

    if (!user) return res.status(401).json({ message: "User not found" });

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET!);

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Failed to login:", error);
    res.sendStatus(500).json({ message: "Internal server error" });
  }
};

export const getAdminData = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ message: "Authorization token not provided" });

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET!);
    const userId: ObjectId = new ObjectId(decoded.userId);

    const user = await AdminModel.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      email: user.email,
      name: user.name,
      phone: user.phone,
    });
  } catch (error) {
    return res.status(401).json({ message: "User not found" });
  }
};

export const updateAdminData = async (req: Request, res: Response) => {
  const { email, ...adminData } = req.body as Omit<IAdmin, "_id">;

  try {
    // Finding the existing admin based on the email, using lean()
    const selectedAdmin = await AdminModel.findOne({ email }).lean();

    if (!selectedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Updating the selectedAdmin with the new data
    Object.assign(selectedAdmin, adminData);

    // Saving the updated admin
    await AdminModel.updateOne({ _id: selectedAdmin._id }, adminData);

    return res
      .status(200)
      .json({ message: "Admin updated successfully", admin: selectedAdmin });
  } catch (error) {
    console.error("Error updating admin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  const { adminId } = req.params;

  try {
    // Check if student exists
    const existingStudent = await AdminModel.findById(adminId);
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Remove the student
    await AdminModel.findByIdAndDelete(adminId);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Failed to delete student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
