import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function TeacherDashboard() {
  const user = JSON.parse(Cookies.get("user"));
  const [activeTab, setActiveTab] = useState("subjects");

  const [subjects, setSubjects] = useState([]);
  const [details, setDetails] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const API = "https://ptabackend.azurewebsites.net";

useEffect(() => {
    loadAnnouncements();
    loadDetails();
    loadSubjects();
    loadTeachers();
}, [loadAnnouncements, loadDetails, loadSubjects, loadTeachers]);

  async function loadSubjects() {
    try {
      const res = await fetch(`${API}/student/subjects/${user.id}`);
      const data = await res.json();
      setSubjects(data);
    } catch (err) {
      console.error("loadSubjects failed", err);
    }
  }

  async function loadDetails() {
    try {
      const res = await fetch(`${API}/student/details/${user.id}`);
      if (!res.ok) {
        const txt = await res.text();
        console.error("loadDetails failed:", txt);
        setDetails(null);
        return;
      }
      const data = await res.json();
      setDetails(data);
    } catch (err) {
      console.error("loadDetails failed", err);
    }
  }

  async function loadAnnouncements() {
    try {
      const res = await fetch(`${API}/announcements/${user.id}`);
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error("loadAnnouncements failed", err);
    }
  }

  async function loadTeachers() {
    try {
      const res = await fetch(`${API}/student/teachers/${user.id}`);
      const data = await res.json();
      setTeachers(data);
    } catch (err) {
      console.error("loadTeachers failed", err);
    }
  }

  async function loadMessages(teacherId) {
    setSelectedTeacher(teacherId);
    try {
      const res = await fetch(`${API}/messages/${user.id}/${teacherId}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("loadMessages failed", err);
    }
  }

  async function sendMessage() {
    if (!selectedTeacher || !newMessage) return;
    try {
      await fetch(`${API}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: user.id,
          receiver_id: parseInt(selectedTeacher, 10),
          message: newMessage,
        }),
      });
      setNewMessage("");
      await loadMessages(selectedTeacher);
    } catch (err) {
      console.error("sendMessage failed", err);
    }
  }

  function logout() {
    Cookies.remove("user");
    window.location.href = "/";
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <div className="w-60 bg-gradient-to-b from-green-700 to-green-900 text-white p-5">
        <h2 className="text-2xl font-bold mb-6">Student Panel</h2>
        <ul className="space-y-3">
          {["subjects", "details", "announcements", "messages"].map((tab) => (
            <li
              key={tab}
              className={`cursor-pointer capitalize p-2 rounded ${
                activeTab === tab ? "bg-green-500" : "hover:bg-green-600"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
          <li
            onClick={logout}
            className="cursor-pointer mt-6 bg-red-600 hover:bg-red-700 p-2 rounded text-center"
          >
            Logout
          </li>
        </ul>
      </div>

      {/* Main */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === "subjects" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Your Subjects</h2>
            <ul className="space-y-3">
              {subjects.length === 0 && <div className="text-sm text-gray-500">No subjects assigned</div>}
              {subjects.map((s) => (
                <li key={s.id} className="p-3 border rounded bg-white flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-gray-500">Teacher: {s.teacher_name || "—"}</div>
                  </div>
                  <div className="text-xs text-gray-500">ID: {s.id}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "details" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Your Details</h2>
            <div className="p-4 border rounded bg-white">
              {details ? (
                <>
                  <div className="mb-2"><strong>Attendance:</strong> {details.attendance}</div>
                  <div className="mb-2"><strong>Marks:</strong> {details.marks}</div>
                  {/* StudentDetails table doesn't have created_at — show record id instead */}
                  <div className="text-xs text-gray-500">Record ID: {details.id ?? "N/A"}</div>
                </>
              ) : (
                <div className="text-sm text-gray-500">No details available</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "announcements" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Announcements</h2>
            <div className="space-y-3">
              {announcements.length === 0 && <div className="text-sm text-gray-500">No announcements</div>}
              {announcements.map((a, i) => (
                <div key={i} className="p-3 border rounded bg-white">
                  <div className="flex justify-between items-center">
                    <strong>{a.title}</strong>
                    <span className="text-xs text-gray-500">{a.created_at}</span>
                  </div>
                  <div className="text-sm text-gray-700 mt-1">{a.content}</div>
                  <div className="text-xs text-gray-500 mt-2">Subject: {a.subject_name} • Teacher: {a.teacher_name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Messages with Teachers</h2>
            <div className="flex">
              {/* Teachers list */}
              <div className="w-1/3 border-r pr-4">
                <h3 className="font-semibold mb-2">Teachers</h3>
                {teachers.map((t) => (
                  <div
                    key={t.id}
                    className={`cursor-pointer p-2 rounded ${selectedTeacher === t.id ? "bg-green-200" : "hover:bg-gray-100"}`}
                    onClick={() => loadMessages(t.id)}
                  >
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.email}</div>
                  </div>
                ))}
                {teachers.length === 0 && <div className="text-sm text-gray-500">No teachers found</div>}
              </div>

              {/* Chat */}
              <div className="flex-1 pl-4 flex flex-col">
                <div className="flex-1 overflow-y-auto border p-3 rounded bg-white mb-3">
                  {messages.map((m, i) => (
                    <div key={i} className={`mb-2 ${m.sender_id === user.id ? "text-right text-green-700" : "text-gray-700"}`}>
                      <div className="inline-block p-2 rounded" style={{ background: m.sender_id === user.id ? "#ecfdf5" : "#f3f4f6" }}>
                        {m.message}
                      </div>
                    </div>
                  ))}
                  {selectedTeacher === "" && <div className="text-sm text-gray-500">Select a teacher to view messages</div>}
                </div>

                <div className="flex space-x-2">
                  <input
                    className="border p-2 flex-1"
                    placeholder="Type message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={!selectedTeacher}
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    disabled={!selectedTeacher || !newMessage}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
