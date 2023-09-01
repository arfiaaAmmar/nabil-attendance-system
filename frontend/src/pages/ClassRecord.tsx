import { useEffect, useRef, useState } from "react";
import { IClassRecord } from "shared-types/types";
import { getAllClassRecords } from "../api/classRecordApi";
import { Link } from "react-router-dom";
import SearchBox from "../components/SearchBox";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { GeneratePDFContent } from "../utils/pdfHandlers";


export const ClassRecords = () => {
  const [records, setRecords] = useState<IClassRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false);
  const [filteredRecord, setFilteredRecord] = useState<
    IClassRecord[] | undefined
  >();
  const [selectedRecord, setSelectedRecord] = useState<
    IClassRecord | undefined
  >();
  const [updatedRecord, setUpdatedRecord] = useState<
    IClassRecord | undefined
  >();
  const [actionModal, setActionModal] = useState({
    editRecordModal: false,
    viewRecordModal: false,
    printRecord: false,
    manualAttendance: false,
  });

  const [manualAttendance, setManualAttendance] = useState({
    studentName: "",
    studentId: "",
    attendanceTime: "",
  });

  const handleDownloadPDF = async (_id: string) => {
    const selectedRecord = records.find((record) => record.classId === _id);

    if (selectedRecord) {
      setSelectedRecord(selectedRecord);
      setActionModal({
        editRecordModal: false,
        viewRecordModal: true,
        printRecord: false,
        manualAttendance: false,
      });
    }
  };

  const handleUpdateRecord = async (classId: string | undefined) => {
    try {
      setUpdatedRecord(updatedRecord);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const handleUploadButton = () => {
    if (fileInputRef.current){
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const selectedFile = fileInputRef.current.files[0]

      if(selectedFile){
        console.log('Selected file', selectedFile);
        // handleUploadExcelForAttendance(selectedFile)
      } else {
        console.log('No file selected,');
      }
    }
  }

  useEffect(() => {
    const fetchAllClassRecords = async () => {
      const data = await getAllClassRecords();
      setRecords(data);
    };

    fetchAllClassRecords();
  }, []);

  useEffect(() => {
    if (records) {
      const filteredList = records.filter((record) =>
        [
          "lecturer",
          "course",
          "classroom",
          "date",
          "startTime",
          "endTime",
        ].some((prop) => {
          const propertyValue = record[prop as keyof IClassRecord];

          if (propertyValue === null || propertyValue === undefined) {
            return false; // Skip filtering for null or undefined values
          }

          if (Array.isArray(propertyValue)) {
            return propertyValue.some((attendance) =>
              attendance.studentName
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            );
          } else {
            return propertyValue
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
          }
        })
      );
      setFilteredRecord(filteredList);
    }
  }, [records, searchQuery]);

  return (
    <div className="m-4">
      <h3 className="text-3xl font-bold">
        <Link to="/admin/attendance_system">Attendance System</Link> {">"} Class
        Records
      </h3>
      <p>To view, download, edit and print past class sessions.</p>
      <SearchBox query={searchQuery} onChange={setSearchQuery} />
      <div className="bg-neutral-400 flex px-4 py-2 justify-evenly h-14 mt-4">
        <p className="font-semibold w-3/12">Date & Time</p>
        <p className="font-semibold w-4/12">Subject</p>
        <p className="font-semibold w-3/12">Lecturer</p>
        <p className="font-semibold w-2/12">Action</p>
      </div>
      <div className="bg-neutral-200 h-[70vh] overflow-y-auto">
        {filteredRecord?.map((record, index) => (
          <div key={index} className="flex px-4 py-2 justify-evenly">
            <p className="w-3/12">
              {record.date} {record?.startTime}
            </p>
            <p className="w-4/12">{record?.course}</p>
            <p className="w-3/12">{record?.lecturer}</p>
            <div className="w-2/12">
              <PDFDownloadLink
                document={
                  <GeneratePDFContent selectedRecord={selectedRecord} />
                }
                fileName="my_pdf.pdf"
                className="bg-blue-300  px-3 py-1"
                // onClick={() => handleDownloadPDF(record?.classId)}
              >
                {({ loading }) => (loading ? "Loading..." : "Download PDF")}
              </PDFDownloadLink>
              <button
                className="bg-green-300 px-3 py-1"
                onClick={() =>
                  setActionModal({ ...actionModal, editRecordModal: true })
                }
              >
                Edit
              </button>
              <button className="bg-yellow-100 px-3 py-1">Print</button>
              <button
                className="bg-orange-300 px-3 py-1"
                onClick={() => handleDownloadPDF(record.classId)}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {actionModal.viewRecordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-md p-8 w-full h-full">
            <PDFViewer width="100%" height="100%">
              <GeneratePDFContent selectedRecord={selectedRecord} />
            </PDFViewer>
            <button
              className="bg-red-400 mx-2 my-1 rounded-md"
              onClick={() =>
                setActionModal({ ...actionModal, viewRecordModal: false })
              }
            >
              Close
            </button>
            <PDFDownloadLink
              className="bg-green-400 mx-2 my-1 rounded-md"
              document={<GeneratePDFContent selectedRecord={selectedRecord} />}
              fileName="class_record.pdf"
            >
              {({ loading }) =>
                loading ? "Loading document..." : "Download now!"
              }
            </PDFDownloadLink>
          </div>
        </div>
      )}
      {actionModal.editRecordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-md p-8 w-5/6 h-5/6 relative">
            <h1>Edit Record</h1>
            <SearchBox query={searchQuery} onChange={setSearchQuery} />
            <div className="flex justify-between">
              <div className="bg-neutral-400 rounded-md p-4 mt-4 mb-0 w-80">
                <div className="flex">
                  <p className="font-semibold w-1/3">Class </p>
                  <p className="w-2/3">: {selectedRecord?.classroom}</p>
                </div>
                <div className="flex">
                  <p className="font-semibold w-1/3">Course </p>
                  <p className="w-2/3">: {selectedRecord?.course}</p>
                </div>
                <div className="flex">
                  <p className="font-semibold w-1/3">Date </p>
                  <p className="w-2/3">: {selectedRecord?.date}</p>
                </div>
                <div className="flex">
                  <p className="font-semibold w-1/3">Start Time</p>
                  <p className="w-2/3">: {selectedRecord?.startTime}</p>
                </div>
                <div className="flex">
                  <p className="font-semibold w-1/3">End Time</p>
                  <p className="w-2/3 ">: {selectedRecord?.endTime}</p>
                </div>
              </div>
              <div className="flex justify-between mt-auto mb-0">
                <div>
                  <button
                    className="bg-purple-400 rounded-md py-2 px-2 mr-2"
                    onClick={() =>
                      setActionModal({ ...actionModal, manualAttendance: true })
                    }
                  >
                    Manual Attendance
                  </button>
                  <input
                    type="file"
                    accept=".xlsx"
                    placeholder="Upload Excel File"
                    className="bg-green-300 px-2 py-1 font-semibold"
                    ref={fileInputRef}
                  />
                  <button
                    className="bg-green-600 px-2 py-1 font-semibold ml-2"
                    onClick={handleUploadButton}
                  >
                    Upload Excel
                  </button>
                  <input
                    type="file"
                    name="Upload Excel"
                    id="uploadExcel"
                    accept=".xlsx, .xls"
                    aria-label="Upload Excel"
                  />
                  <PDFDownloadLink
                    className="bg-yellow-600 rounded-md py-2 px-2"
                    document={
                      <GeneratePDFContent selectedRecord={selectedRecord} />
                    }
                    fileName="class_record.pdf"
                  >
                    {({ loading }) =>
                      loading ? "Loading document..." : "Download PDF"
                    }
                  </PDFDownloadLink>
                </div>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 flex gap-2">
              <button
                className="bg-red-400 px-2 py-1 rounded-md "
                onClick={() =>
                  setActionModal({ ...actionModal, editRecordModal: false })
                }
              >
                Close
              </button>
              <button
                className="bg-green-400 px-2 py-1 rounded-md"
                onClick={() => handleUpdateRecord(selectedRecord?.classId)}
              >
                Update Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassRecords;
