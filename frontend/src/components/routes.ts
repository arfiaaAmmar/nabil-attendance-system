export type AppRoutesType = {
  displayText: string;
  path: string;
  children?: AppRoutesType[]
};

export const adminRoutes: AppRoutesType[] = [
  {
    displayText: "Student Database",
    path: "/admin/student_database",
  },
  {
    displayText: "Attendance System",
    path: "/admin/attendance_system",
    children: [
      {
        displayText: "Class Session",
        path: "/admin/attendance_system/class_session"
      },
      {
        displayText: "Class Records",
        path: "/admin/attendance_system/class_history"
      }
    ]
  },
];
