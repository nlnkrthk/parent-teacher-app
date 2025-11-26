import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function TeacherDashboard() {
  const user = JSON.parse(Cookies.get("user"));
  const [activeTab, setActiveTab] = useState("subjects");

  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [messages, setMessages] = useState([]);

  const [subjectName, setSubjectName] = useState("");
  const [announcement, setAnnouncement] = useState({ subject_id: "", title: "", content: "" });
  const [newMessage, setNewMessage] = useState("");
  const [selectedReceiver, setSelectedReceiver] = useState("");

  // new states for adding/removing students to/from subjects
  const [selectedSubjectForStudent, setSelectedSubjectForStudent] = useState("");
  const [selectedStudentForSubject, setSelectedStudentForSubject] = useState("");

  // new states for "Add Details" modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [modalStudentId, setModalStudentId] = useState(null);
  const [modalAttendance, setModalAttendance] = useState("");
  const [modalMarks, setModalMarks] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalExisting, setModalExisting] = useState(false);

  // Student Report states
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  
  const API = "https://ptabackend.azurewebsites.net";

  // Load subjects + students + teacher announcements on mount
useEffect(() => {
    loadStudents();
    loadSubjects();
    loadTeacherAnnouncements();
}, [loadStudents, loadSubjects, loadTeacherAnnouncements]);


  async function openDetailsModal(studentId) {
    setModalStudentId(studentId);
    setModalAttendance("");
    setModalMarks("");
    setModalExisting(false);
    setModalLoading(true);
    try {
      const res = await fetch(`${API}/student/details/${studentId}`);
      if (!res.ok) {
        // no existing details or error — still open modal for entry
        setModalExisting(false);
      } else {
        const data = await res.json();
        if (data) {
          setModalAttendance(data.attendance ?? "");
          setModalMarks(data.marks ?? "");
          setModalExisting(true);
        } else {
          setModalExisting(false);
        }
      }
    } catch (err) {
      console.error("Failed to load student details:", err);
      setModalExisting(false);
    } finally {
      setModalLoading(false);
      setShowDetailsModal(true);
    }
  }

  function closeDetailsModal() {
    setShowDetailsModal(false);
    setModalStudentId(null);
  }

  async function addStudentDetails() {
    if (!modalStudentId) return alert("No student selected");
    // basic validation
    if (modalAttendance === "" || modalMarks === "") return alert("Enter attendance and marks");
    try {
      const res = await fetch(`${API}/student/details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: parseInt(modalStudentId, 10),
          attendance: modalAttendance,
          marks: modalMarks,
        }),
      });
      if (res.ok) {
        alert("Details added");
        closeDetailsModal();
      } else {
        const txt = await res.text();
        alert("Failed to add details: " + txt);
      }
    } catch (err) {
      console.error(err);
      alert("Error adding details");
    }
  }

  // Generate AI report for a student
  async function generateReport(studentId) {
    setReportData(null);
    setReportLoading(true);
    setShowReportModal(true);
    try {
      const res = await fetch(`${API}/summarize/student/${studentId}`);
      if (!res.ok) {
        const txt = await res.text();
        setReportData({ error: txt || "Failed to fetch report" });
      } else {
        const data = await res.json();
        setReportData(data);
      }
    } catch (err) {
      console.error("generateReport error:", err);
      setReportData({ error: err.message });
    } finally {
      setReportLoading(false);
    }
  }

  function closeReportModal() {
    setShowReportModal(false);
    setReportData(null);
    setReportLoading(false);
  }
  
  // load teacher subjects
  async function loadSubjects() {
    try {
      const res = await fetch(`${API}/teacher/subjects/${user.id}`);
      const data = await res.json();
      setSubjects(data);
    } catch (err) {
      console.error("Failed to load subjects", err);
    }
  }

  async function loadStudents() {
    try {
      const res = await fetch(`${API}/teacher/students/${user.id}`);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Failed to load students", err);
    }
  }

  // load announcements created by this teacher
  async function loadTeacherAnnouncements() {
    try {
      const res = await fetch(`${API}/teacher/announcements/${user.id}`);
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error("Failed to load teacher announcements", err);
    }
  }

  async function addSubject() {
    if (!subjectName) return alert("Enter subject name");
    await fetch(`${API}/subjects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: subjectName, teacher_id: user.id }),
    });
    alert("Subject added!");
    setSubjectName("");
    await loadSubjects(); // refresh list
  }

  async function postAnnouncement() {
    if (!announcement.subject_id || !announcement.title || !announcement.content)
      return alert("Fill all fields");
    await fetch(`${API}/announcements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject_id: announcement.subject_id,
        teacher_id: user.id,
        title: announcement.title,
        content: announcement.content,
      }),
    });
    alert("Announcement added!");
    setAnnouncement({ subject_id: "", title: "", content: "" });
    await loadTeacherAnnouncements(); // refresh teacher announcements
  }

  async function sendMessage() {
    if (!selectedReceiver || !newMessage) return;
    await fetch(`${API}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_id: user.id,
        receiver_id: selectedReceiver,
        message: newMessage,
      }),
    });
    alert("Message sent!");
    setNewMessage("");
    loadMessages(selectedReceiver);
  }

  async function loadMessages(receiverId) {
    setSelectedReceiver(receiverId);
    const res = await fetch(`${API}/messages/${user.id}/${receiverId}`);
    const data = await res.json();
    setMessages(data);
  }

  // add student to subject
  async function addStudentToSubject() {
    if (!selectedSubjectForStudent || !selectedStudentForSubject)
      return alert("Select subject and enter student id");
    try {
      const res = await fetch(`${API}/subjects/addStudent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: parseInt(selectedStudentForSubject, 10),
          subject_id: parseInt(selectedSubjectForStudent, 10),
        }),
      });
      if (res.ok) {
        alert("Student added to subject");
        setSelectedStudentForSubject(""); // clear input
      } else {
        const txt = await res.text();
        alert("Failed to add student: " + txt);
      }
    } catch (err) {
      console.error(err);
      alert("Error adding student to subject");
    }
  }

  // remove student from subject
  async function removeStudentFromSubject() {
    if (!selectedSubjectForStudent || !selectedStudentForSubject)
      return alert("Select subject and enter student id");
    try {
      const res = await fetch(`${API}/subjects/removeStudent`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: parseInt(selectedStudentForSubject, 10),
          subject_id: parseInt(selectedSubjectForStudent, 10),
        }),
      });
      if (res.ok) {
        alert("Student removed from subject");
        setSelectedStudentForSubject("");
      } else {
        const txt = await res.text();
        alert("Failed to remove student: " + txt);
      }
    } catch (err) {
      console.error(err);
      alert("Error removing student from subject");
    }
  }

  function logout() {
    Cookies.remove("user");
    window.location.href = "/";
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* ---------- Sidebar ---------- */}
      <div className="w-60 bg-gradient-to-b from-indigo-700 to-indigo-900 text-white p-5">
        <h2 className="text-2xl font-bold mb-6">Teacher Panel</h2>
        <ul className="space-y-3">
          {["subjects", "students", "announcements", "messages"].map((tab) => (
            <li
              key={tab}
              className={`cursor-pointer capitalize p-2 rounded ${
                activeTab === tab ? "bg-indigo-500" : "hover:bg-indigo-600"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}

          <li
            key="studentReport"
            className={`cursor-pointer p-2 rounded ${activeTab === "studentReport" ? "bg-indigo-500" : "hover:bg-indigo-600"}`}
            onClick={() => { setActiveTab("studentReport"); }}
          >
            Student Report
          </li>

          <li
            onClick={logout}
            className="cursor-pointer mt-6 bg-red-600 hover:bg-red-700 p-2 rounded text-center"
          >
            Logout
          </li>
        </ul>
      </div>

      {/* ---------- Main Content ---------- */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === "studentReport" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Student Reports</h2>
            <table className="w-full border">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 && (
                  <tr><td colSpan="3" className="p-2 text-sm text-gray-500">No students found</td></tr>
                )}
                {students.map((s) => (
                  <tr key={s.id} className="border">
                    <td className="p-2 border">{s.name}</td>
                    <td className="p-2 border">{s.email}</td>
                    <td className="p-2 border">
                      <button
                        className="bg-indigo-600 text-white px-3 py-1 rounded"
                        onClick={() => generateReport(s.id)}
                      >
                        Generate Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "subjects" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Manage Subjects</h2>
            <div className="flex space-x-2 mb-4">
              <input
                className="border p-2 flex-1"
                placeholder="Enter new subject"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
              />
              <button onClick={addSubject} className="bg-indigo-600 text-white px-4 py-2 rounded">
                Add
              </button>
            </div>

            {/* Show subjects for this teacher */}
            <div>
              <h3 className="font-semibold mb-2">Your Subjects</h3>
              <ul className="space-y-2">
                {subjects.length === 0 && <li className="text-sm text-gray-500">No subjects yet</li>}
                {subjects.map((s) => (
                  <li key={s.id} className="p-2 border rounded bg-white">
                    {s.name} <span className="text-xs text-gray-500 ml-2">({s.id})</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Add / Remove student to/from subject */}
            <div className="mt-6 p-4 border rounded bg-white">
              <h3 className="font-semibold mb-2">Assign Student to Subject</h3>
              <div className="flex flex-wrap gap-2 items-center">
                <select
                  className="border p-2"
                  value={selectedSubjectForStudent}
                  onChange={(e) => setSelectedSubjectForStudent(e.target.value)}
                >
                  <option value="">Select subject</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                {/* Input for entering student id directly */}
                <input
                  className="border p-2"
                  placeholder="Enter student id (e.g. 123)"
                  value={selectedStudentForSubject}
                  onChange={(e) => setSelectedStudentForSubject(e.target.value)}
                />

                {/* (You can still view students under Students tab to get IDs) */}

                <button
                  onClick={addStudentToSubject}
                  className="bg-green-600 text-white px-3 py-2 rounded"
                >
                  Add
                </button>
                <button
                  onClick={removeStudentFromSubject}
                  className="bg-red-600 text-white px-3 py-2 rounded"
                >
                  Remove
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Use Add to assign a student to the selected subject. Use Remove to unassign.</p>
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Students in Your Classes</h2>
            <table className="w-full border">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border">
                    <td className="p-2 border">{s.name}</td>
                    <td className="p-2 border">{s.email}</td>
                    <td className="p-2 border">
                      <button
                        className="bg-indigo-600 text-white px-3 py-1 rounded mr-2"
                        onClick={() => openDetailsModal(s.id)}
                      >
                        Add details
                      </button>
                      <span className="text-xs text-gray-500">ID: {s.id}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "announcements" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Post Announcement</h2>
            <div className="space-y-3">
              {/* Subject dropdown instead of typing ID */}
              <select
                className="border p-2 w-full"
                value={announcement.subject_id}
                onChange={(e) => setAnnouncement({ ...announcement, subject_id: e.target.value })}
              >
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Title"
                className="border p-2 w-full"
                value={announcement.title}
                onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
              />
              <textarea
                placeholder="Content"
                className="border p-2 w-full"
                rows="4"
                value={announcement.content}
                onChange={(e) => setAnnouncement({ ...announcement, content: e.target.value })}
              />
              <button
                onClick={postAnnouncement}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Post
              </button>
            </div>

            {/* List announcements created by this teacher */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Your Announcements</h3>
              {announcements.length === 0 && <div className="text-sm text-gray-500">No announcements yet</div>}
              <ul className="space-y-3">
                {announcements.map((a) => (
                  <li key={a.id} className="p-3 border rounded bg-white">
                    <div className="flex justify-between items-center">
                      <strong>{a.title}</strong>
                      <span className="text-xs text-gray-500">{a.created_at}</span>
                    </div>
                    <div className="text-sm text-gray-700 mt-1">{a.content}</div>
                    <div className="text-xs text-gray-500 mt-2">Subject: {a.subject_name} ({a.subject_id})</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Messages with Parents</h2>
            <div className="flex">
              {/* Student list */}
              <div className="w-1/3 border-r pr-4">
                <h3 className="font-semibold mb-2">Select Parent/Student</h3>
                {students.map((s) => (
                  <div
                    key={s.id}
                    className={`cursor-pointer p-2 rounded ${
                      selectedReceiver === s.id ? "bg-indigo-200" : "hover:bg-gray-100"
                    }`}
                    onClick={() => loadMessages(s.id)}
                  >
                    {s.name}
                  </div>
                ))}
              </div>

              {/* Chat */}
              <div className="flex-1 pl-4 flex flex-col">
                <div className="flex-1 overflow-y-auto border p-3 rounded bg-white mb-3">
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={`mb-2 ${
                        m.sender_id === user.id ? "text-right text-indigo-700" : "text-gray-700"
                      }`}
                    >
                      {m.message}
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    className="border p-2 flex-1"
                    placeholder="Type message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Details Modal */}
        {showDetailsModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded p-6 w-96">
              <h3 className="text-lg font-semibold mb-3">Add Details for Student ID: {modalStudentId}</h3>
              <div className="space-y-3">
                {modalLoading ? (
                  <div className="text-sm text-gray-500">Loading existing details...</div>
                ) : (
                  <>
                    {modalExisting && (
                      <div className="text-sm text-gray-600">Existing details loaded — edit to update.</div>
                    )}
                    <input
                      className="border p-2 w-full"
                      placeholder="Attendance (e.g. 90%)"
                      value={modalAttendance}
                      onChange={(e) => setModalAttendance(e.target.value)}
                    />
                    <input
                      className="border p-2 w-full"
                      placeholder="Marks (e.g. 85)"
                      value={modalMarks}
                      onChange={(e) => setModalMarks(e.target.value)}
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <button onClick={closeDetailsModal} className="px-3 py-1 rounded border">
                        Cancel
                      </button>
                      <button
                        onClick={addStudentDetails}
                        className="px-3 py-1 rounded bg-indigo-600 text-white"
                      >
                        {modalExisting ? "Update" : "Save"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded p-6 w-11/12 md:w-3/4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold mb-3">AI Student Report</h3>
                <button onClick={closeReportModal} className="text-sm text-gray-600">Close</button>
              </div>
              {reportLoading ? (
                <div className="text-sm text-gray-500">Generating report...</div>
              ) : reportData ? (
                reportData.error ? (
                  <div className="text-red-600">{reportData.error}</div>
                ) : (
                  <>
                    <div className="mb-2">
                      <strong>{reportData.student?.name}</strong> — {reportData.student?.email}
                    </div>
                    <div className="mb-2 text-sm text-gray-600">
                      Attendance: {reportData.details?.attendance ?? "N/A"} • Marks: {reportData.details?.marks ?? "N/A"}
                    </div>
                    <div className="mt-4 p-4 bg-gray-50 border rounded whitespace-pre-line">
                      {reportData.ai_summary || "No summary returned"}
                    </div>
                  </>
                )
              ) : (
                <div className="text-sm text-gray-500">No report data</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}