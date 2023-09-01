import { Request, Response } from "express";
import { IClassRecord, ClassRecordModel } from "../model/model";

export const postClassRecord = async (req: Request, res: Response) => {
  try {
    const {
      classId,
      lecturer,
      course,
      classroom,
      startTime,
      endTime,
      date,
      attendance,
    } = req.body;
    
    //Create new class record
    const newClassRecord = await ClassRecordModel.create({
      classId,
      lecturer,
      course,
      classroom,
      startTime,
      endTime,
      date,
      attendance,
    });
    res.status(201).json(newClassRecord);
  } catch (error) {
    console.error("Error creating class record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postAttendance = async (req: Request, res: Response) => {
  const { classId } = req.params;
  const attendanceBody = req.body as Pick<IClassRecord, "attendance">;

  try {
    const classRecord = await ClassRecordModel.findById(classId);

    if (!classRecord)
      return res.status(404).json({ message: "Class record not found" });

    classRecord.attendance.push(...attendanceBody.attendance);
    const updatedClassRecord = await classRecord.save();

    res.status(201).json(updatedClassRecord);
  } catch (error) {
    console.error("Error adding attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getClassRecord = async (req: Request, res: Response) => {
  const { _id } = req.params;

  try {
    // Retrieve class record by ID
    const classRecord = await ClassRecordModel.findById(_id);
    if (!classRecord) {
      return res.status(404).json({ message: "Class record not found" });
    }
    res.json(classRecord);
  } catch (error) {
    console.error("Error retrieving class record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllClassRecords = async (req: Request, res: Response) => {
  try {
    // Retrieve class record by ID
    const classRecord = await ClassRecordModel.find({}, { password: 0 }).exec();
    if (!classRecord) {
      return res.status(404).json({ message: "Class record not found" });
    }
    res.json(classRecord);
  } catch (error) {
    console.error("Error retrieving class record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateClassRecord = async (req: Request, res: Response) => {
  const { classId } = req.params;
  const updatedData = req.body; // Updated data can contain both student and class details

  try {
    // Find and update class record
    const classRecord = await ClassRecordModel.findById(classId);
    if (!classRecord) {
      return res.status(404).json({ message: "Class record not found" });
    }

    // Update class details
    classRecord.lecturer = updatedData.lecturer;
    classRecord.classroom = updatedData.classroom;
    classRecord.course = updatedData.course;
    classRecord.date = updatedData.date;
    classRecord.startTime = updatedData.startTime;
    classRecord.endTime = updatedData.endTime;
    classRecord.attendance = updatedData.attendance;

    // Save updated class record
    await classRecord.save();
    res.json(classRecord);
  } catch (error) {
    console.error("Error updating class record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteClassRecord = async (req: Request, res: Response) => {
  const { classId } = req.params;

  try {
    // Delete class record by ID
    const deletedRecord = await ClassRecordModel.findByIdAndDelete(classId);
    if (!deletedRecord) {
      return res.status(404).json({ message: "Class record not found" });
    }
    res.json({ message: "Class record deleted successfully" });
  } catch (error) {
    console.error("Error deleting class record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAttendanceRecord = async (req: Request, res: Response) => {
  const { classId } = req.params;

  try {
    // Delete class record by ID
    const deletedRecord = await ClassRecordModel.findByIdAndDelete(classId);
    if (!deletedRecord) {
      return res.status(404).json({ message: "Class record not found" });
    }
    res.json({ message: "Class record deleted successfully" });
  } catch (error) {
    console.error("Error deleting class record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
