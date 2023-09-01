export type CollegeCourses =
  | "Food & Beverage"
  | "Information Technology"
  | "Security"
  | "Secretary";
export type Classrooms = "Classroom 1" | "Classroom 2" | "Classroom 3";

//Student DB
export type IAdmin = {
  _id: string;
  email: string;
  name: string;
  password?: string;
  phone: number;
};

export type IStudent = {
  studentId: string;
  name: string;
  email: string;
  phone: string;
  course: string;
};

//Class Session / Class History
export type IStudentAttendance = {
  studentName: string;
  studentId: string;
  attendanceTime: string;
};

export type IClassRecord = {
  classId: string;
  lecturer: string | null;
  classroom: Classrooms | string;
  course: CollegeCourses | string;
  date: string;
  startTime: string;
  endTime: string;
  attendance?: IStudentAttendance[];
};
