import React from "react";
import { Link } from "react-router-dom";

const AttendanceSystem = () => {
  return (
    <>
      <h3 className="text-3xl font-bold m-4">Attendance System</h3>
      <div className="flex center gap-4 ml-4 mt-14">
        <div className="bg-neutral-300 rounded-md p-4">
          <p className="text-2xl font-bold m-2">Class Session</p>
          <p>Shows the current running live class on your User Session</p>
          <div className="bg-neutral-400 rounded-md p-2">
            <p className="text-2xl font-bold">Intro to Programming</p>
            <p className="text-lg font-bold">Class 2</p>
            <div className="flex justify-between mt-8">
              <p>Attendance: 23/30</p>
              <button className="bg-red-500 px-2 py-1 text-white font-bold">End Class</button>
            </div>
          </div>
          <Link
            to="/admin/attendance_system/class_session"
            className="bg-neutral-400 mt-2 mr-0 ml-auto block px-2 py-1 rounded-sm w-max"
          >
            See More
          </Link>
        </div>
        <div className="bg-neutral-300 rounded-md p-4">
          <p className="text-2xl font-bold m-2">Class History</p>
          <p>Shows the current running live class on your User Session</p>
          <div className="bg-neutral-400 rounded-md p-2">
            <p className="text-2xl font-bold">Intro to Programming</p>
            <p className="text-lg font-bold">Class 2</p>
            <div className="flex justify-end mt-8">
              <button className="bg-blue-300  px-3 py-1">Download PDF</button>
              <button className="bg-green-300 px-3 py-1">Edit</button>
              <button className="bg-yellow-100 px-3 py-1">Print</button>
            </div>
          </div>
          <Link
            to="/admin/attendance_system/class_history"
            className="bg-neutral-400 mt-2 mr-0 ml-auto block px-2 py-1 rounded-sm w-max"
          >
            See More
          </Link>
        </div>
      </div>
    </>
  );
};

export default AttendanceSystem;
