import { IClassRecord } from "backend/src/model/model";
import { StudentAttendance, ClassRecord } from "../types/types";

const API_BASE_URL = "http://localhost:8888";

export const postClassRecord = async (classData: ClassRecord) => {
  try {
    const response = await fetch(`${API_BASE_URL}/post-class_record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(classData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    return response.json;
  } catch (error) {
    throw (error as Error).message;
  }
};

export const postAttendance = async (classId: string, attendanceData: StudentAttendance) => {

  try {
    const response = await fetch(`${API_BASE_URL}/post-attendance/${classId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(attendanceData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    return response.json;
  } catch (error) {
    throw (error as Error).message;
  }
};

export const getClassRecord = async (_id: string | undefined) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-class-record/${_id}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const classRecord = await response.json();
    return classRecord;
  } catch (error) {
    throw (error as Error).message;
  }
};

export const updateClassRecord = async (
  classId: string,
  data: IClassRecord
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/update-class-record/${classId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const updatedClassRecord = await response.json();
    return updatedClassRecord;
  } catch (error) {
    throw (error as Error).message;
  }
};

export const getAllClassRecords = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-all-class-records`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data.error || "An error occured";
      throw new Error(error);
    }

    return data;
  } catch (error) {
    throw (error as Error).message;
  }
};

export const handleDelete = async (
  id: string,
  type: "admin" | "student" | "class-record"
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete-${type}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Item successfully deleted from the database
      console.log(`${type} with ID ${id} deleted successfully.`);
    } else {
      // Failed to delete item from the database
      console.error(`Failed to delete ${type} with ID ${id}.`);
    }
  } catch (error) {
    // Handle any errors that occur during the deletion process
    console.error(
      `An error occurred while deleting ${type} with ID ${id}.`,
      error
    );
  }
};
