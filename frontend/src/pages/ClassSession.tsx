import { useEffect, useState } from "react";
import { ClassRecord, StudentAttendance } from "../types/types";
import { getAllClassRecords, postClassRecord } from "../api/classRecordApi";
import SearchBox from "../components/SearchBox";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";


const ClassSession = () => {
  const [studentList, setStudentList] = useState<StudentAttendance[]>();
  const [filteredStudentList, setFilteredStudentList] =
    useState<StudentAttendance[]>();
  const [classSessionModal, setClassSessionModal] = useState(false);
  const [error, setError] = useState<string | unknown>("");
  const [success, setSuccess] = useState("");
  // const [errorSuccess, setErrorSuccess] = useState({

  const formatDateTime = () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB");
    const formattedTime = now.toLocaleTimeString("en-US", { hour12: false });
    return `${formattedDate}-${formattedTime}`;
  };

  // })
  const [searchQuery, setSearchQuery] = useState("");
  const [manualAttendanceModal, setManualAttendanceModal] = useState(false);
  const [classRecordForm, setClassRecordForm] = useState<ClassRecord>({
    classId: "",
    lecturer: sessionStorage.getItem("userName"),
    classroom: "",
    course: "",
    date: new Date().toLocaleDateString("en-GB"),
    startTime: "Not set",
    endTime: "Not set",
    attendance: studentList,
  });
  useEffect(() => {
    async () => {
      try {
        const data = await getAllClassRecords();
        setStudentList(data);
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };
  }, []);

  useEffect(() => { 
    if (studentList) {
      const filteredList = studentList.filter((student) =>
        ["studentName", "studentId", "attendanceTime"].some((prop) =>
          student[prop as keyof StudentAttendance]
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
      setFilteredStudentList(filteredList);
    }
  }, [studentList, searchQuery]);

  const handleSubmitClassSession = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      classRecordForm.classroom === "" ||
      classRecordForm.course === "" ||
      classRecordForm.startTime === "" ||
      classRecordForm.endTime === ""
    ) {
      setError("Please fill in all class info");
      return;
    }
    try {
      //Post class
      await postClassRecord({
        classId: `${classRecordForm.course}-${formatDateTime()}`,
        lecturer: sessionStorage.getItem("userName"),
        classroom: classRecordForm.classroom,
        course: classRecordForm.course,
        startTime: classRecordForm.startTime,
        endTime: classRecordForm.endTime,
        attendance: studentList,
        date: classRecordForm.date,
      });
      setSuccess("Successfully started class!");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
      // Fetch updated student attendance list and update in current class record
      // const updatedAttendance = await getCurrentClassRecord();
      // setStudentList(updatedAttendance);

      console.log("New user registered successfully");
    } catch (error: unknown) {
      console.error("Error registering new user:", error);
      setError(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setClassRecordForm((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEndClass = async () => {
    //user fill form which is student id
    //search id in studentDB
    //display in modal to confirm
    //set add attendance
    // Clear form inputs
    setClassRecordForm({
      classId: "",
      lecturer: sessionStorage.getItem("userName"),
      classroom: "Not set",
      course: "Not set",
      date: new Date().toLocaleDateString("en-GB"),
      startTime: "Not set",
      endTime: "Not set",
      attendance: [],
    });
  };

  return (
    <div className="m-4">
      <h3 className="text-3xl font-bold">
        <Link to="/admin/attendance_system">Attendance System</Link> {">"} Class
        Session
      </h3>
      <p className="mb-8">
        To view, download, edit and print past class sessions.
      </p>
      <SearchBox query={searchQuery} onChange={setSearchQuery} />
      <div className="flex justify-between">
        <div className="bg-neutral-400 rounded-md p-4 mt-4 mb-0 w-80">
          <div className="flex">
            <p className="font-semibold w-1/3">Class </p>
            <p className="w-2/3">: {classRecordForm.classroom}</p>
          </div>
          <div className="flex">
            <p className="font-semibold w-1/3">Course </p>
            <p className="w-2/3">: {classRecordForm.course}</p>
          </div>
          <div className="flex">
            <p className="font-semibold w-1/3">Date </p>
            <p className="w-2/3">: {classRecordForm.date}</p>
          </div>
          <div className="flex">
            <p className="font-semibold w-1/3">Start Time</p>
            <p className="w-2/3">: {classRecordForm.startTime}</p>
          </div>
          <div className="flex">
            <p className="font-semibold w-1/3">End Time</p>
            <p className="w-2/3 ">: {classRecordForm.endTime}</p>
          </div>
          <button className="bg-red-500 px-2 py-1 rounded-md text-white font-bold mr-0 ml-auto mt-4">
            End Class
          </button>
        </div>
        <div className="flex justify-between mt-auto mb-0">
          <div>
            <button
              className="bg-purple-400 rounded-md py-2 px-2 mr-2"
              onClick={() => setManualAttendanceModal(true)}
            >
              Manual Attendance
            </button>
            <button className="bg-green-500 rounded-md py-2 px-2 mr-2">
              Upload Excel
            </button>
            {/* <input
              type="file"
              name="Upload Excel"
              id="uploadExcel"
              accept=".xlsx, .xls"
              aria-label="Upload Excel"
            /> */}
            <button className="bg-yellow-600 rounded-md py-2 px-2 ">
              Download PDF
            </button>
          </div>
        </div>
      </div>
      <div className="bg-neutral-400 flex px-4 py-2 justify-evenly h-14 mt-4">
        <p className="font-semibold w-1/12">No.</p>
        <p className="font-semibold w-5/12">Full Name</p>
        <p className="font-semibold w-3/12">Student ID</p>
        {/* <p className="font-semibold w-1/6">Intake Session</p> */}
        {/* <p className="font-semibold w-1/6">Course</p> */}
        <p className="font-semibold w-1/6">Status</p>
      </div>
      <div className="bg-neutral-200 h-[30vh] overflow-y-auto">
        {filteredStudentList?.map((student, index) => (
          <div
            key={student.studentId}
            className="flex px-4 py-2 justify-evenly h-14"
          >
            <p className="w-1/12">{index + 1}</p>
            <p className="w-5/12">{student.studentName}</p>
            <p className="w-3/12">{student.studentId}</p>
            <p className="w-3/12"> Next time </p>
          </div>
        ))}
      </div>
      {manualAttendanceModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-md p-8">
            <p className="text-lg mb-4">Start Class</p>
            {typeof error === "string" ? (
              <p className="text-red-500 font-bold">{error}</p>
            ) : success ? (
              <p className="text-green-600 font-bold">{success}</p>
            ) : null}

            <form onSubmit={handleSubmitClassSession}>
              <select
                name="classroom"
                id="classroom"
                className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
                value={classRecordForm.classroom}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select classroom
                </option>
                <option value="Classroom 1">Classroom 1</option>
                <option value="Classroom 2">Classroom 2</option>
                <option value="Classroom 3">Classroom 3</option>
                <option value="Classroom 4">Classroom 4</option>
              </select>
              <select
                name="course"
                id="course"
                className="border-2 border-neutral-400 rounded-md w-full mt-4 text-neutral-600"
                value={classRecordForm.course}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select a course
                </option>
                <option value="IT">Information Technology</option>
                <option value="Security">Security</option>
                <option value="Secretary">Secretary</option>
                <option value="FnB">Food & Beverage</option>
              </select>
              <input type="time" name="startTime" id="startTime" />
              <input type="time" name="endTime" id="endTime" />
              <div className="flex justify-between mt-4">
                <Button
                  onClick={handleSubmitClassSession}
                  variant="contained"
                  className="bg-green-600 text-white font-bold"
                  type="submit"
                >
                  Submit
                </Button>
                <Button
                  onClick={() => setManualAttendanceModal(false)}
                  variant="outlined"
                  className="text-gray-600"
                >
                  Close
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* -------------------------MODALS-------------------------------------------- */}
      {/* <ManualAttendance
        classId={classId}
        manualAttendanceModal={manualAttendanceModal}
        setManualAttendanceModal={setManualAttendanceModal}
      /> */}
    </div>
  );
};

export default ClassSession;
