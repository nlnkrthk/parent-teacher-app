import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, Link, useNavigate, NavLink, useLocation } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// Simple localStorage helpers
function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // ignore
  }
}

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-title">ParentTeacher</Link>
        <div className="navbar-actions">
          <Link to="/parent/signup" className="nav-btn">Parent Sign Up</Link>
          <Link to="/parent/signin" className="nav-btn">Parent Sign In</Link>
          <Link to="/teacher/signup" className="nav-btn">Teacher Sign Up</Link>
          <Link to="/teacher/signin" className="nav-btn">Teacher Sign In</Link>
        </div>
      </nav>
      <main className="hero">
        <section className="hero-card">
          <h1 className="hero-title">Collaborate. Track Progress. Support Every Student.</h1>
          <p className="hero-subtitle">A simple hub for parents and teachers to communicate, share updates, and stay aligned.</p>
          <div className="cta-row">
            <button className="cta-btn primary" onClick={() => navigate('/parent/signup')}>Get Started as Parent</button>
            <button className="cta-btn" onClick={() => navigate('/teacher/signup')}>Get Started as Teacher</button>
          </div>
          <div className="features-grid">
            <div className="feature">
              <h3>Real-time Updates</h3>
              <p>Stay informed with announcements and progress updates.</p>
            </div>
            <div className="feature">
              <h3>Secure Messaging</h3>
              <p>Direct parent-teacher chats with privacy in mind.</p>
            </div>
            <div className="feature">
              <h3>Assignments & Feedback</h3>
              <p>Share assignments, track submissions, and provide feedback.</p>
            </div>
          </div>
          <div className="testimonials">
            <blockquote>“This app made our parent-teacher communication seamless.” — A Happy Parent</blockquote>
            <blockquote>“I save hours every week coordinating with families.” — A Grateful Teacher</blockquote>
          </div>
        </section>
      </main>
    </>
  );
}

function PageLayout({ children }) {
  return (
    <div className="App">
      {children}
    </div>
  );
}

function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="hero">
      <section className="hero-card" style={{ maxWidth: '520px' }}>
        <h1 className="hero-title" style={{ fontSize: '26px' }}>{title}</h1>
        {subtitle ? <p className="hero-subtitle">{subtitle}</p> : null}
        {children}
      </section>
    </main>
  );
}

function ParentSignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, isTeacher: false })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Signup failed');
      window.location.href = '/parent/signin';
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  }

  return (
    <AuthLayout title="Parent Sign Up" subtitle="Create your parent account to get started.">
      {error ? <div className="form-error">{error}</div> : null}
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Full Name</label>
          <input type="text" placeholder="Jane Doe" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Email</label>
          <input type="email" placeholder="jane@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="cta-btn primary" style={{ width: '100%' }}>Create Account</button>
        <p className="form-hint">Already have an account? <Link to="/parent/signin">Sign in</Link></p>
      </form>
    </AuthLayout>
  );
}

function ParentSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Login failed');
      window.location.href = data?.isTeacher ? '/teacher/dashboard' : '/parent/dashboard';
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <AuthLayout title="Parent Sign In" subtitle="Welcome back! Sign in to continue.">
      {error ? <div className="form-error">{error}</div> : null}
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Email</label>
          <input type="email" placeholder="jane@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="cta-btn primary" style={{ width: '100%' }}>Sign In</button>
        <p className="form-hint">New here? <Link to="/parent/signup">Create an account</Link></p>
      </form>
    </AuthLayout>
  );
}

function TeacherSignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, isTeacher: true })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Signup failed');
      window.location.href = '/teacher/signin';
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  }

  return (
    <AuthLayout title="Teacher Sign Up" subtitle="Join to connect with parents and manage your class.">
      {error ? <div className="form-error">{error}</div> : null}
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Full Name</label>
          <input type="text" placeholder="Mr. John Smith" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Email</label>
          <input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="cta-btn primary" style={{ width: '100%' }}>Create Account</button>
        <p className="form-hint">Already have an account? <Link to="/teacher/signin">Sign in</Link></p>
      </form>
    </AuthLayout>
  );
}

function TeacherSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Login failed');
      window.location.href = data?.isTeacher ? '/teacher/dashboard' : '/parent/dashboard';
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <AuthLayout title="Teacher Sign In" subtitle="Welcome back! Sign in to continue.">
      {error ? <div className="form-error">{error}</div> : null}
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Email</label>
          <input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="cta-btn primary" style={{ width: '100%' }}>Sign In</button>
        <p className="form-hint">New here? <Link to="/teacher/signup">Create an account</Link></p>
      </form>
    </AuthLayout>
  );
}

function App() {
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/parent/dashboard" element={<ParentDashboard />} />
        <Route path="/parent/dashboard/messages" element={<ParentMessages />} />
        <Route path="/parent/dashboard/assignments" element={<ParentAssignments />} />
        <Route path="/parent/dashboard/profile" element={<ParentProfile />} />
        <Route path="/parent/dashboard/report" element={<ParentReport />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/dashboard/students" element={<TeacherStudents />} />
        <Route path="/teacher/dashboard/classes" element={<TeacherClasses />} />
        <Route path="/teacher/dashboard/announcements" element={<TeacherAnnouncements />} />
        <Route path="/teacher/dashboard/messages" element={<TeacherMessages />} />
        <Route path="/teacher/dashboard/report" element={<TeacherReport />} />
        <Route path="/parent/signup" element={<ParentSignUp />} />
        <Route path="/parent/signin" element={<ParentSignIn />} />
        <Route path="/teacher/signup" element={<TeacherSignUp />} />
        <Route path="/teacher/signin" element={<TeacherSignIn />} />
      </Routes>
    </PageLayout>
  );
}

export default App;

function SidebarLayout({ title, links, children }) {
  const location = useLocation();
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>{title}</h2>
        <ul className="nav-list">
          {links.map((l) => (
            <li key={l.to} className="nav-item">
              <NavLink to={l.to} className={({ isActive }) => isActive || location.pathname === l.to ? 'active' : ''}>{l.label}</NavLink>
            </li>
          ))}
        </ul>
      </aside>
      <section className="content">
        {children}
      </section>
    </div>
  );
}

function ParentDashboard() {
  const links = [
    { to: '/parent/dashboard', label: 'Dashboard' },
    { to: '/parent/dashboard/messages', label: 'Messages' },
    { to: '/parent/dashboard/assignments', label: 'Assignments' },
    { to: '/parent/dashboard/profile', label: 'Profile' },
    { to: '/parent/dashboard/report', label: 'Report' }
  ];
  
  const [announcements, setAnnouncements] = useState([]);
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const storedAnnouncements = loadFromStorage('announcements', []);
    const storedMessages = loadFromStorage('messages', []);
    setAnnouncements(storedAnnouncements);
    setMessages(storedMessages);
  }, []);

  return (
    <SidebarLayout title="Parent Dashboard" links={links}>
      <h1>Dashboard</h1>
      <p>Welcome! Here you'll see announcements, upcoming events, and your child's progress.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
        {/* Announcements Section */}
        <div>
          <h2 style={{ color: '#e5e7eb', marginBottom: '16px' }}>Recent Announcements</h2>
          <div className="announcements-list">
            {announcements.length === 0 ? (
              <div className="announcement-empty">No announcements from teachers yet.</div>
            ) : announcements.slice(0, 3).map((a) => (
              <div key={a.id} className="announcement-card">
                <div className="announcement-header">
                  <div className="announcement-title">{a.title}</div>
                  <div className="announcement-meta">{a.className} • {new Date(a.createdAt).toLocaleString()}</div>
                </div>
                <div className="announcement-desc">{a.description}</div>
                {a.extra ? <div className="announcement-extra">{a.extra}</div> : null}
              </div>
            ))}
          </div>
          {announcements.length > 3 && (
            <Link to="/parent/dashboard/announcements" className="cta-btn" style={{ marginTop: '12px', display: 'inline-block' }}>
              View All Announcements
            </Link>
          )}
        </div>

        {/* Messages Section */}
        <div>
          <h2 style={{ color: '#e5e7eb', marginBottom: '16px' }}>Recent Messages</h2>
          <div className="announcements-list">
            {messages.length === 0 ? (
              <div className="announcement-empty">No messages from teachers yet.</div>
            ) : messages.slice(0, 3).map((m) => (
              <div key={m.id} className="announcement-card">
                <div className="announcement-header">
                  <div className="announcement-title">Message from Teacher</div>
                  <div className="announcement-meta">{new Date(m.createdAt).toLocaleString()}</div>
                </div>
                <div className="announcement-desc">{m.text}</div>
              </div>
            ))}
          </div>
          {messages.length > 3 && (
            <Link to="/parent/dashboard/messages" className="cta-btn" style={{ marginTop: '12px', display: 'inline-block' }}>
              View All Messages
            </Link>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}

function TeacherDashboard() {
  const links = [
    { to: '/teacher/dashboard', label: 'Dashboard' },
    { to: '/teacher/dashboard/students', label: 'Students' },
    { to: '/teacher/dashboard/classes', label: 'Classes' },
    { to: '/teacher/dashboard/announcements', label: 'Announcements' },
    { to: '/teacher/dashboard/messages', label: 'Messages' },
    { to: '/teacher/dashboard/report', label: 'Report' }
  ];
  const [announcements, setAnnouncements] = useState([]);
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const storedAnnouncements = loadFromStorage('announcements', []);
    const storedMessages = loadFromStorage('messages', []);
    setAnnouncements(storedAnnouncements);
    setMessages(storedMessages);
  }, []);

  return (
    <SidebarLayout title="Teacher Dashboard" links={links}>
      <h1>Dashboard</h1>
      <p>Welcome! Manage your students, classes, share announcements, and coordinate with parents.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
        {/* Announcements Section */}
        <div>
          <h2 style={{ color: '#e5e7eb', marginBottom: '16px' }}>Recent Announcements</h2>
          <div className="announcements-list">
            {announcements.length === 0 ? (
              <div className="announcement-empty">No announcements yet. Create one from the Announcements tab.</div>
            ) : announcements.slice(0, 3).map((a) => (
              <div key={a.id} className="announcement-card">
                <div className="announcement-header">
                  <div className="announcement-title">{a.title}</div>
                  <div className="announcement-meta">{a.className} • {new Date(a.createdAt).toLocaleString()}</div>
                </div>
                <div className="announcement-desc">{a.description}</div>
                {a.extra ? <div className="announcement-extra">{a.extra}</div> : null}
              </div>
            ))}
          </div>
          {announcements.length > 3 && (
            <Link to="/teacher/dashboard/announcements" className="cta-btn" style={{ marginTop: '12px', display: 'inline-block' }}>
              View All Announcements
            </Link>
          )}
        </div>

        {/* Messages Section */}
        <div>
          <h2 style={{ color: '#e5e7eb', marginBottom: '16px' }}>Recent Messages</h2>
          <div className="announcements-list">
            {messages.length === 0 ? (
              <div className="announcement-empty">No messages yet. Check the Messages tab to start conversations.</div>
            ) : messages.slice(0, 3).map((m) => (
              <div key={m.id} className="announcement-card">
                <div className="announcement-header">
                  <div className="announcement-title">Message from {m.fromStudent}</div>
                  <div className="announcement-meta">{new Date(m.createdAt).toLocaleString()}</div>
                </div>
                <div className="announcement-desc">{m.text}</div>
              </div>
            ))}
          </div>
          {messages.length > 3 && (
            <Link to="/teacher/dashboard/messages" className="cta-btn" style={{ marginTop: '12px', display: 'inline-block' }}>
              View All Messages
            </Link>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}

function TeacherStudents() {
  const links = [
    { to: '/teacher/dashboard', label: 'Dashboard' },
    { to: '/teacher/dashboard/students', label: 'Students' },
    { to: '/teacher/dashboard/classes', label: 'Classes' },
    { to: '/teacher/dashboard/announcements', label: 'Announcements' },
    { to: '/teacher/dashboard/messages', label: 'Messages' },
    { to: '/teacher/dashboard/report', label: 'Report' }
  ];
  const [students, setStudents] = useState([
    { id: '1', name: 'Ava Johnson', rollNumber: 'PT-001', email: 'ava.johnson@example.com', className: 'Grade 4', details: { attendancePercent: '', examMarks: '', assignmentsSubmitted: '' } },
    { id: '2', name: 'Leo Patel', rollNumber: 'PT-002', email: 'leo.patel@example.com', className: 'Grade 4', details: { attendancePercent: '', examMarks: '', assignmentsSubmitted: '' } },
    { id: '3', name: 'Mia Chen', rollNumber: 'PT-003', email: 'mia.chen@example.com', className: 'Grade 5', details: { attendancePercent: '', examMarks: '', assignmentsSubmitted: '' } }
  ]);
  const [form, setForm] = useState({ name: '', rollNumber: '', email: '', className: '' });
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [detailForm, setDetailForm] = useState({ attendancePercent: '', examMarks: '', assignmentsSubmitted: '' });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleAdd(e) {
    e.preventDefault();
    setError('');
    if (!form.name || !form.rollNumber || !form.email) {
      setError('Please fill name, roll number, and email.');
      return;
    }
    if (students.some((s) => s.rollNumber.toLowerCase() === form.rollNumber.toLowerCase())) {
      setError('Roll number already exists.');
      return;
    }
    const id = String(Date.now());
    setStudents((list) => [
      ...list,
      { id, name: form.name, rollNumber: form.rollNumber, email: form.email, className: form.className || '—', details: { attendancePercent: '', examMarks: '', assignmentsSubmitted: '' } }
    ]);
    setForm({ name: '', rollNumber: '', email: '', className: '' });
    setIsModalOpen(false);
  }

  function handleDelete(id) {
    setStudents((list) => list.filter((s) => s.id !== id));
  }

  function openDetails(student) {
    setSelectedStudentId(student.id);
    const d = student.details || { attendancePercent: '', examMarks: '', assignmentsSubmitted: '' };
    setDetailForm({ attendancePercent: d.attendancePercent || '', examMarks: d.examMarks || '', assignmentsSubmitted: d.assignmentsSubmitted || '' });
    setIsDetailOpen(true);
  }

  function saveDetails(e) {
    e.preventDefault();
    setStudents((list) => list.map((s) => {
      if (s.id !== selectedStudentId) return s;
      return { ...s, details: { attendancePercent: detailForm.attendancePercent, examMarks: detailForm.examMarks, assignmentsSubmitted: detailForm.assignmentsSubmitted } };
    }));
    setIsDetailOpen(false);
  }

  return (
    <SidebarLayout title="Teacher Dashboard" links={links}>
      <h1>Students</h1>
      <p>Manage your roster. Add students and view key details.</p>

      <div>
        <button className="cta-btn primary" onClick={() => setIsModalOpen(true)}>Add Student</button>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll No</th>
              <th>Email</th>
              <th>Class</th>
              <th style={{ width: '160px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.rollNumber}</td>
                <td>{s.email}</td>
                <td>{s.className}</td>
                <td>
                  <button className="table-btn" onClick={() => openDetails(s)} style={{ marginRight: 8 }}>Details</button>
                  <button className="table-btn" onClick={() => handleDelete(s.id)}>Remove</button>
                </td>
              </tr>
            ))}
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8' }}>No students yet. Add your first student above.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {isModalOpen ? (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add Student</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
            {error ? <div className="form-error">{error}</div> : null}
            <form className="form" onSubmit={handleAdd}>
              <div className="form-grid">
                <div className="form-row">
                  <label>Name</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g., John Doe" />
                </div>
                <div className="form-row">
                  <label>Roll Number</label>
                  <input name="rollNumber" value={form.rollNumber} onChange={handleChange} placeholder="e.g., PT-010" />
                </div>
                <div className="form-row">
                  <label>Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
                </div>
                <div className="form-row">
                  <label>Class</label>
                  <input name="className" value={form.className} onChange={handleChange} placeholder="e.g., Grade 5" />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="table-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="cta-btn primary">Add Student</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isDetailOpen ? (
        <div className="modal-overlay" onClick={() => setIsDetailOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Student Details</h3>
              <button className="modal-close" onClick={() => setIsDetailOpen(false)}>Close</button>
            </div>
            <form className="form" onSubmit={saveDetails}>
              <div className="form-grid">
                <div className="form-row">
                  <label>Attendance (%)</label>
                  <input name="attendancePercent" type="number" min="0" max="100" value={detailForm.attendancePercent} onChange={(e) => setDetailForm({ ...detailForm, attendancePercent: e.target.value })} placeholder="e.g., 92" />
                </div>
                <div className="form-row">
                  <label>Exam Marks</label>
                  <input name="examMarks" value={detailForm.examMarks} onChange={(e) => setDetailForm({ ...detailForm, examMarks: e.target.value })} placeholder="e.g., Math:95, Eng:88" />
                </div>
                <div className="form-row">
                  <label>Assignments Submitted</label>
                  <input name="assignmentsSubmitted" type="number" min="0" value={detailForm.assignmentsSubmitted} onChange={(e) => setDetailForm({ ...detailForm, assignmentsSubmitted: e.target.value })} placeholder="e.g., 8" />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="table-btn" onClick={() => setIsDetailOpen(false)}>Cancel</button>
                <button type="submit" className="cta-btn primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </SidebarLayout>
  );
}

function TeacherClasses() {
  const links = [
    { to: '/teacher/dashboard', label: 'Dashboard' },
    { to: '/teacher/dashboard/students', label: 'Students' },
    { to: '/teacher/dashboard/classes', label: 'Classes' },
    { to: '/teacher/dashboard/announcements', label: 'Announcements' },
    { to: '/teacher/dashboard/messages', label: 'Messages' },
    { to: '/teacher/dashboard/report', label: 'Report' }
  ];

  const [classes, setClasses] = useState(() => loadFromStorage('classes', [
    { id: 'c4', name: 'Grade 4' },
    { id: 'c5', name: 'Grade 5' },
    { id: 'c6', name: 'Grade 6' }
  ]));
  const [students, setStudents] = useState([
    { id: '1', name: 'Ava Johnson', rollNumber: 'PT-001', email: 'ava.johnson@example.com', className: 'Grade 4' },
    { id: '2', name: 'Leo Patel', rollNumber: 'PT-002', email: 'leo.patel@example.com', className: 'Grade 4' },
    { id: '3', name: 'Mia Chen', rollNumber: 'PT-003', email: 'mia.chen@example.com', className: 'Grade 5' }
  ]);
  const [selectedClass, setSelectedClass] = useState(classes[0]?.name || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', rollNumber: '', email: '' });
  const [error, setError] = useState('');

  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [classError, setClassError] = useState('');

  useEffect(() => {
    saveToStorage('classes', classes);
  }, [classes]);

  const classStudents = students.filter((s) => s.className === selectedClass);

  function handleAddStudent(e) {
    e.preventDefault();
    setError('');
    if (!form.name || !form.rollNumber || !form.email) {
      setError('Please fill name, roll number, and email.');
      return;
    }
    if (students.some((s) => s.rollNumber.toLowerCase() === form.rollNumber.toLowerCase())) {
      setError('Roll number already exists.');
      return;
    }
    const id = String(Date.now());
    setStudents((list) => [
      ...list,
      { id, name: form.name, rollNumber: form.rollNumber, email: form.email, className: selectedClass }
    ]);
    setForm({ name: '', rollNumber: '', email: '' });
    setIsModalOpen(false);
  }

  function handleCreateClass(e) {
    e.preventDefault();
    setClassError('');
    const trimmed = newClassName.trim();
    if (!trimmed) {
      setClassError('Please enter a class name.');
      return;
    }
    if (classes.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setClassError('Class already exists.');
      return;
    }
    const id = 'c-' + Date.now();
    const cls = { id, name: trimmed };
    setClasses((list) => [...list, cls]);
    setSelectedClass(cls.name);
    setNewClassName('');
    setIsCreateClassOpen(false);
  }

  return (
    <SidebarLayout title="Teacher Dashboard" links={links}>
      <h1>Classes</h1>
      <p>Create a class, then add students directly to it.</p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="cta-btn" onClick={() => setIsCreateClassOpen(true)}>Create Class</button>
        <button className="cta-btn primary" onClick={() => setIsModalOpen(true)} disabled={!selectedClass}>Add Student to {selectedClass || '—'}</button>
      </div>

      <div className="classes-grid">
        {classes.map((c) => (
          <button
            key={c.id}
            className={`class-card${selectedClass === c.name ? ' active' : ''}`}
            onClick={() => setSelectedClass(c.name)}
          >
            <div className="class-name">{c.name}</div>
            <div className="class-count">{students.filter((s) => s.className === c.name).length} students</div>
          </button>
        ))}
      </div>

      <div className="table-wrap" style={{ marginTop: 16 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll No</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {classStudents.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.rollNumber}</td>
                <td>{s.email}</td>
              </tr>
            ))}
            {classStudents.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', color: '#94a3b8' }}>No students in this class yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {isModalOpen ? (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add Student to {selectedClass}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
            {error ? <div className="form-error">{error}</div> : null}
            <form className="form" onSubmit={handleAddStudent}>
              <div className="form-grid">
                <div className="form-row">
                  <label>Name</label>
                  <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., John Doe" />
                </div>
                <div className="form-row">
                  <label>Roll Number</label>
                  <input name="rollNumber" value={form.rollNumber} onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} placeholder="e.g., PT-010" />
                </div>
                <div className="form-row">
                  <label>Email</label>
                  <input name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="table-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="cta-btn primary">Add Student</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isCreateClassOpen ? (
        <div className="modal-overlay" onClick={() => setIsCreateClassOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create Class</h3>
              <button className="modal-close" onClick={() => setIsCreateClassOpen(false)}>Close</button>
            </div>
            {classError ? <div className="form-error">{classError}</div> : null}
            <form className="form" onSubmit={handleCreateClass}>
              <div className="form-row">
                <label>Class Name</label>
                <input value={newClassName} onChange={(e) => setNewClassName(e.target.value)} placeholder="e.g., Grade 7" />
              </div>
              <div className="modal-actions">
                <button type="button" className="table-btn" onClick={() => setIsCreateClassOpen(false)}>Cancel</button>
                <button type="submit" className="cta-btn primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </SidebarLayout>
  );
}

function TeacherAnnouncements() {
  const links = [
    { to: '/teacher/dashboard', label: 'Dashboard' },
    { to: '/teacher/dashboard/students', label: 'Students' },
    { to: '/teacher/dashboard/classes', label: 'Classes' },
    { to: '/teacher/dashboard/announcements', label: 'Announcements' },
    { to: '/teacher/dashboard/messages', label: 'Messages' },
    { to: '/teacher/dashboard/report', label: 'Report' }
  ];

  const [classes] = useState(() => loadFromStorage('classes', []));
  const [selectedClass, setSelectedClass] = useState(classes[0]?.name || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', extra: '' });

  function createAnnouncement(e) {
    e.preventDefault();
    setError('');
    if (!selectedClass) {
      setError('Please select a class.');
      return;
    }
    if (!form.title || !form.description) {
      setError('Please provide a title and description.');
      return;
    }
    const announcement = {
      id: 'a-' + Date.now(),
      className: selectedClass,
      title: form.title,
      description: form.description,
      extra: form.extra,
      createdAt: Date.now()
    };
    const existing = loadFromStorage('announcements', []);
    const updated = [announcement, ...existing];
    saveToStorage('announcements', updated);
    setForm({ title: '', description: '', extra: '' });
    setIsModalOpen(false);
  }

  return (
    <SidebarLayout title="Teacher Dashboard" links={links}>
      <h1>Announcements</h1>
      <p>Create announcements for a specific class. These will appear on the Dashboard.</p>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ color: '#cbd5e1' }}>Class</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          style={{ background: '#0b0d12', color: '#e5e7eb', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 10px' }}
        >
          {classes.length === 0 ? <option value="">No classes available</option> : null}
          {classes.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
        <button className="cta-btn primary" onClick={() => setIsModalOpen(true)} disabled={!selectedClass}>Add Announcement</button>
      </div>

      {isModalOpen ? (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">New Announcement</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
            {error ? <div className="form-error">{error}</div> : null}
            <form className="form" onSubmit={createAnnouncement}>
              <div className="form-row">
                <label>Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Field Trip Reminder" />
              </div>
              <div className="form-row">
                <label>Description</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Key details for the class" />
              </div>
              <div className="form-row">
                <label>Extra Info (optional)</label>
                <input value={form.extra} onChange={(e) => setForm({ ...form, extra: e.target.value })} placeholder="Links, attachments, etc." />
              </div>
              <div className="modal-actions">
                <button type="button" className="table-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="cta-btn primary">Post</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </SidebarLayout>
  );
}

function TeacherMessages() {
  const links = [
    { to: '/teacher/dashboard', label: 'Dashboard' },
    { to: '/teacher/dashboard/students', label: 'Students' },
    { to: '/teacher/dashboard/classes', label: 'Classes' },
    { to: '/teacher/dashboard/announcements', label: 'Announcements' },
    { to: '/teacher/dashboard/messages', label: 'Messages' },
    { to: '/teacher/dashboard/report', label: 'Report' }
  ];

  const classes = loadFromStorage('classes', []);
  const [selectedClass, setSelectedClass] = useState(classes[0]?.name || '');

  // In a real app, students would be global or fetched by class
  const [students] = useState([
    { id: '1', name: 'Ava Johnson', className: 'Grade 4' },
    { id: '2', name: 'Leo Patel', className: 'Grade 4' },
    { id: '3', name: 'Mia Chen', className: 'Grade 5' }
  ]);

  const [chatWith, setChatWith] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');

  const filtered = students.filter((s) => s.className === selectedClass);

  function sendMessage(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    const msg = { 
      id: Date.now(), 
      from: 'me', 
      text: draft.trim(), 
      at: Date.now(), 
      toStudentId: chatWith?.id,
      fromStudent: chatWith?.name,
      createdAt: Date.now()
    };
    const updatedMessages = [...messages, msg];
    setMessages(updatedMessages);
    saveToStorage('messages', updatedMessages);
    setDraft('');
    // Simulate reply
    setTimeout(() => {
      const reply = { 
        id: Date.now() + 1, 
        from: 'them', 
        text: 'Thanks for the update!', 
        at: Date.now(), 
        toStudentId: chatWith?.id,
        fromStudent: chatWith?.name,
        createdAt: Date.now()
      };
      const finalMessages = [...updatedMessages, reply];
      setMessages(finalMessages);
      saveToStorage('messages', finalMessages);
    }, 800);
  }

  const thread = chatWith ? messages.filter((m) => m.toStudentId === chatWith.id) : [];

  return (
    <SidebarLayout title="Teacher Dashboard" links={links}>
      <h1>Messages</h1>
      <p>Select a class, then message a student from that class.</p>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ color: '#cbd5e1' }}>Class</label>
        <select
          value={selectedClass}
          onChange={(e) => { setSelectedClass(e.target.value); setChatWith(null); }}
          style={{ background: '#0b0d12', color: '#e5e7eb', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 10px' }}
        >
          {classes.length === 0 ? <option value="">No classes available</option> : null}
          {classes.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="table-wrap" style={{ marginTop: 16 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>
                  <button className="table-btn" onClick={() => setChatWith(s)}>Chat</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={2} style={{ textAlign: 'center', color: '#94a3b8' }}>No students for this class.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {chatWith ? (
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-title">Chat with {chatWith.name}</div>
            <button className="chat-close" onClick={() => setChatWith(null)}>Close</button>
          </div>
          <div className="chat-body">
            {thread.map((m) => (
              <div key={m.id} className={`chat-msg ${m.from === 'me' ? 'me' : 'them'}`}>{m.text}</div>
            ))}
            {thread.length === 0 ? <div className="announcement-empty">No messages yet. Say hello!</div> : null}
          </div>
          <form className="chat-input" onSubmit={sendMessage}>
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message..." />
            <button className="cta-btn primary" type="submit">Send</button>
          </form>
        </div>
      ) : null}
    </SidebarLayout>
  );
}

function TeacherReport() {
  const links = [
    { to: '/teacher/dashboard', label: 'Dashboard' },
    { to: '/teacher/dashboard/students', label: 'Students' },
    { to: '/teacher/dashboard/classes', label: 'Classes' },
    { to: '/teacher/dashboard/announcements', label: 'Announcements' },
    { to: '/teacher/dashboard/messages', label: 'Messages' },
    { to: '/teacher/dashboard/report', label: 'Report' }
  ];

  const [students] = useState([
    { id: '1', name: 'Ava Johnson', rollNumber: 'PT-001', email: 'ava.johnson@example.com', className: 'Grade 4', details: { attendancePercent: '92', examMarks: 'Math:95, Eng:88', assignmentsSubmitted: '8' } },
    { id: '2', name: 'Leo Patel', rollNumber: 'PT-002', email: 'leo.patel@example.com', className: 'Grade 4', details: { attendancePercent: '88', examMarks: 'Math:82, Eng:90', assignmentsSubmitted: '7' } },
    { id: '3', name: 'Mia Chen', rollNumber: 'PT-003', email: 'mia.chen@example.com', className: 'Grade 5', details: { attendancePercent: '95', examMarks: 'Math:98, Eng:92', assignmentsSubmitted: '9' } }
  ]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [generatedReport, setGeneratedReport] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  function generateReport(student) {
    setIsGenerating(true);
    setSelectedStudent(student);
    
    // Simulate AI report generation
    setTimeout(() => {
      const report = `**Academic Report for ${student.name}**

**Student Information:**
- Name: ${student.name}
- Roll Number: ${student.rollNumber}
- Class: ${student.className}
- Email: ${student.email}

**Academic Performance:**
- Attendance: ${student.details.attendancePercent}%
- Exam Marks: ${student.details.examMarks}
- Assignments Submitted: ${student.details.assignmentsSubmitted}

**Analysis:**
${student.details.attendancePercent >= 90 ? 'Excellent attendance record. Student shows strong commitment to learning.' : student.details.attendancePercent >= 80 ? 'Good attendance with room for improvement.' : 'Attendance needs attention. Please encourage regular attendance.'}

${parseInt(student.details.assignmentsSubmitted) >= 8 ? 'Outstanding assignment completion rate. Student demonstrates consistent effort.' : parseInt(student.details.assignmentsSubmitted) >= 6 ? 'Good assignment completion. Continue the good work.' : 'Assignment completion needs improvement. Please provide additional support.'}

**Recommendations:**
- Continue current study habits
- Focus on areas with lower performance
- Maintain regular communication with parents
- Consider additional support if needed

**Overall Grade: ${student.details.attendancePercent >= 90 && parseInt(student.details.assignmentsSubmitted) >= 8 ? 'A' : student.details.attendancePercent >= 80 && parseInt(student.details.assignmentsSubmitted) >= 6 ? 'B' : 'C'}**

Generated on: ${new Date().toLocaleDateString()}`;
      
      setGeneratedReport(report);
      setIsGenerating(false);
    }, 2000);
  }

  return (
    <SidebarLayout title="Teacher Dashboard" links={links}>
      <h1>Student Reports</h1>
      <p>Select a student to generate an AI-powered academic report based on their performance data.</p>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll No</th>
              <th>Class</th>
              <th>Attendance</th>
              <th>Assignments</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.rollNumber}</td>
                <td>{s.className}</td>
                <td>{s.details.attendancePercent}%</td>
                <td>{s.details.assignmentsSubmitted}</td>
                <td>
                  <button 
                    className="table-btn" 
                    onClick={() => generateReport(s)}
                    disabled={isGenerating}
                  >
                    {isGenerating && selectedStudent?.id === s.id ? 'Generating...' : 'Generate Report'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {generatedReport && (
        <div className="report-section" style={{ marginTop: '24px' }}>
          <h2>Generated Report for {selectedStudent?.name}</h2>
          <div className="report-content" style={{ 
            background: '#1a1a1a', 
            padding: '20px', 
            borderRadius: '8px', 
            border: '1px solid #333',
            whiteSpace: 'pre-line',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            {generatedReport}
          </div>
          <div style={{ marginTop: '16px' }}>
            <button className="cta-btn primary" onClick={() => {
              navigator.clipboard.writeText(generatedReport);
              alert('Report copied to clipboard!');
            }}>
              Copy Report
            </button>
            <button className="cta-btn" onClick={() => {
              setGeneratedReport('');
              setSelectedStudent(null);
            }} style={{ marginLeft: '8px' }}>
              Clear
            </button>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}

function ParentMessages() {
  const links = [
    { to: '/parent/dashboard', label: 'Dashboard' },
    { to: '/parent/dashboard/messages', label: 'Messages' },
    { to: '/parent/dashboard/assignments', label: 'Assignments' },
    { to: '/parent/dashboard/profile', label: 'Profile' },
    { to: '/parent/dashboard/report', label: 'Report' }
  ];

  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const storedMessages = loadFromStorage('messages', []);
    // Filter messages that are from teachers (not from parents)
    const teacherMessages = storedMessages.filter(m => m.from === 'me' || m.from === 'teacher');
    setMessages(teacherMessages);
  }, []);

  function viewMessage(message) {
    setSelectedMessage(message);
  }

  return (
    <SidebarLayout title="Parent Dashboard" links={links}>
      <h1>Messages from Teachers</h1>
      <p>View messages and updates from your child's teachers.</p>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>From</th>
              <th>Student</th>
              <th>Message</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8' }}>
                  No messages from teachers yet.
                </td>
              </tr>
            ) : messages.map((m) => (
              <tr key={m.id}>
                <td>Teacher</td>
                <td>{m.fromStudent || 'N/A'}</td>
                <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {m.text}
                </td>
                <td>{new Date(m.createdAt || m.at).toLocaleDateString()}</td>
                <td>
                  <button className="table-btn" onClick={() => viewMessage(m)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedMessage && (
        <div className="modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Message from Teacher</h3>
              <button className="modal-close" onClick={() => setSelectedMessage(null)}>Close</button>
            </div>
            <div className="form" style={{ padding: '20px' }}>
              <div className="form-row">
                <label>Student:</label>
                <div style={{ color: '#e5e7eb', marginTop: '4px' }}>
                  {selectedMessage.fromStudent || 'N/A'}
                </div>
              </div>
              <div className="form-row">
                <label>Date:</label>
                <div style={{ color: '#e5e7eb', marginTop: '4px' }}>
                  {new Date(selectedMessage.createdAt || selectedMessage.at).toLocaleString()}
                </div>
              </div>
              <div className="form-row">
                <label>Message:</label>
                <div style={{ 
                  color: '#e5e7eb', 
                  marginTop: '4px', 
                  padding: '12px', 
                  background: '#1a1a1a', 
                  borderRadius: '6px',
                  border: '1px solid #333',
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedMessage.text}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}

function ParentAssignments() {
  const links = [
    { to: '/parent/dashboard', label: 'Dashboard' },
    { to: '/parent/dashboard/messages', label: 'Messages' },
    { to: '/parent/dashboard/assignments', label: 'Assignments' },
    { to: '/parent/dashboard/profile', label: 'Profile' },
    { to: '/parent/dashboard/report', label: 'Report' }
  ];

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    const storedAssignments = loadFromStorage('assignments', []);
    setAssignments(storedAssignments);
  }, []);

  function viewAssignment(assignment) {
    setSelectedAssignment(assignment);
  }

  return (
    <SidebarLayout title="Parent Dashboard" links={links}>
      <h1>Assignments from Teachers</h1>
      <p>View assignments posted by your child's teachers.</p>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Subject</th>
              <th>Class</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8' }}>
                  No assignments posted yet.
                </td>
              </tr>
            ) : assignments.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.subject || 'N/A'}</td>
                <td>{a.className}</td>
                <td>{a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    background: a.status === 'completed' ? '#10b981' : a.status === 'submitted' ? '#3b82f6' : '#f59e0b',
                    color: 'white'
                  }}>
                    {a.status || 'pending'}
                  </span>
                </td>
                <td>
                  <button className="table-btn" onClick={() => viewAssignment(a)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedAssignment && (
        <div className="modal-overlay" onClick={() => setSelectedAssignment(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Assignment Details</h3>
              <button className="modal-close" onClick={() => setSelectedAssignment(null)}>Close</button>
            </div>
            <div className="form" style={{ padding: '20px' }}>
              <div className="form-row">
                <label>Title:</label>
                <div style={{ color: '#e5e7eb', marginTop: '4px' }}>
                  {selectedAssignment.title}
                </div>
              </div>
              <div className="form-row">
                <label>Subject:</label>
                <div style={{ color: '#e5e7eb', marginTop: '4px' }}>
                  {selectedAssignment.subject || 'N/A'}
                </div>
              </div>
              <div className="form-row">
                <label>Class:</label>
                <div style={{ color: '#e5e7eb', marginTop: '4px' }}>
                  {selectedAssignment.className}
                </div>
              </div>
              <div className="form-row">
                <label>Due Date:</label>
                <div style={{ color: '#e5e7eb', marginTop: '4px' }}>
                  {selectedAssignment.dueDate ? new Date(selectedAssignment.dueDate).toLocaleDateString() : 'N/A'}
                </div>
              </div>
              <div className="form-row">
                <label>Status:</label>
                <div style={{ color: '#e5e7eb', marginTop: '4px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    background: selectedAssignment.status === 'completed' ? '#10b981' : selectedAssignment.status === 'submitted' ? '#3b82f6' : '#f59e0b',
                    color: 'white'
                  }}>
                    {selectedAssignment.status || 'pending'}
                  </span>
                </div>
              </div>
              <div className="form-row">
                <label>Description:</label>
                <div style={{ 
                  color: '#e5e7eb', 
                  marginTop: '4px', 
                  padding: '12px', 
                  background: '#1a1a1a', 
                  borderRadius: '6px',
                  border: '1px solid #333',
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedAssignment.description || 'No description provided.'}
                </div>
              </div>
              {selectedAssignment.instructions && (
                <div className="form-row">
                  <label>Instructions:</label>
                  <div style={{ 
                    color: '#e5e7eb', 
                    marginTop: '4px', 
                    padding: '12px', 
                    background: '#1a1a1a', 
                    borderRadius: '6px',
                    border: '1px solid #333',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {selectedAssignment.instructions}
                  </div>
                </div>
              )}
              {selectedAssignment.attachments && selectedAssignment.attachments.length > 0 && (
                <div className="form-row">
                  <label>Attachments:</label>
                  <div style={{ color: '#e5e7eb', marginTop: '4px' }}>
                    {selectedAssignment.attachments.map((attachment, index) => (
                      <div key={index} style={{ marginBottom: '4px' }}>
                        <a href={attachment.url} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
                          {attachment.name}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}

function ParentProfile() {
  const links = [
    { to: '/parent/dashboard', label: 'Dashboard' },
    { to: '/parent/dashboard/messages', label: 'Messages' },
    { to: '/parent/dashboard/assignments', label: 'Assignments' },
    { to: '/parent/dashboard/profile', label: 'Profile' },
    { to: '/parent/dashboard/report', label: 'Report' }
  ];

  const [child, setChild] = useState(null);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    // Simulate getting the parent's child (in real app, this would be based on parent authentication)
    const storedStudents = loadFromStorage('students', [
      { id: '1', name: 'Ava Johnson', rollNumber: 'PT-001', email: 'ava.johnson@example.com', className: 'Grade 4', details: { attendancePercent: '92', examMarks: 'Math:95, Eng:88', assignmentsSubmitted: '8' } },
      { id: '2', name: 'Leo Patel', rollNumber: 'PT-002', email: 'leo.patel@example.com', className: 'Grade 4', details: { attendancePercent: '88', examMarks: 'Math:82, Eng:90', assignmentsSubmitted: '7' } },
      { id: '3', name: 'Mia Chen', rollNumber: 'PT-003', email: 'mia.chen@example.com', className: 'Grade 5', details: { attendancePercent: '95', examMarks: 'Math:98, Eng:92', assignmentsSubmitted: '9' } }
    ]);
    
    // Load assignments data
    const storedAssignments = loadFromStorage('assignments', [
      { id: 'a1', title: 'Math Homework Chapter 5', subject: 'Mathematics', className: 'Grade 4', dueDate: '2024-01-15', status: 'completed', description: 'Complete exercises 1-20', instructions: 'Show all work clearly' },
      { id: 'a2', title: 'English Essay', subject: 'English', className: 'Grade 4', dueDate: '2024-01-20', status: 'submitted', description: 'Write a 500-word essay on your favorite book', instructions: 'Use proper grammar and structure' },
      { id: 'a3', title: 'Science Project', subject: 'Science', className: 'Grade 5', dueDate: '2024-01-25', status: 'pending', description: 'Create a model of the solar system', instructions: 'Include all planets and label them' }
    ]);
    
    // For demo purposes, show the first student as the parent's child
    // In a real app, this would be determined by parent-child relationship in database
    setChild(storedStudents[0]);
    setAssignments(storedAssignments);
  }, []);

  // Get assignments for child's class
  const childAssignments = child ? 
    assignments.filter(a => a.className === child.className) : [];

  return (
    <SidebarLayout title="Parent Dashboard" links={links}>
      <h1>Your Child's Profile</h1>
      <p>View your child's attendance, marks, and assignment submissions.</p>

      {!child ? (
        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
          No child information available yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
          {/* Child Information */}
          <div>
            <h2 style={{ color: '#e5e7eb', marginBottom: '16px' }}>Student Information</h2>
            <div style={{ 
              background: '#1a1a1a', 
              padding: '20px', 
              borderRadius: '8px', 
              border: '1px solid #333'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ color: '#cbd5e1', fontSize: '14px' }}>Name:</label>
                  <div style={{ color: '#e5e7eb', marginTop: '4px', fontWeight: 'bold' }}>
                    {child.name}
                  </div>
                </div>
                <div>
                  <label style={{ color: '#cbd5e1', fontSize: '14px' }}>Roll Number:</label>
                  <div style={{ color: '#e5e7eb', marginTop: '4px' }}>
                    {child.rollNumber}
                  </div>
                </div>
                <div>
                  <label style={{ color: '#cbd5e1', fontSize: '14px' }}>Class:</label>
                  <div style={{ color: '#e5e7eb', marginTop: '4px' }}>
                    {child.className}
                  </div>
                </div>
                <div>
                  <label style={{ color: '#cbd5e1', fontSize: '14px' }}>Email:</label>
                  <div style={{ color: '#e5e7eb', marginTop: '4px' }}>
                    {child.email}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ color: '#cbd5e1', fontSize: '14px' }}>Attendance:</label>
                  <div style={{ marginTop: '4px' }}>
                    <span style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      background: child.details.attendancePercent >= 90 ? '#10b981' : child.details.attendancePercent >= 80 ? '#3b82f6' : '#f59e0b',
                      color: 'white'
                    }}>
                      {child.details.attendancePercent}%
                    </span>
                  </div>
                </div>
                <div>
                  <label style={{ color: '#cbd5e1', fontSize: '14px' }}>Assignments Submitted:</label>
                  <div style={{ marginTop: '4px' }}>
                    <span style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      background: parseInt(child.details.assignmentsSubmitted) >= 8 ? '#10b981' : parseInt(child.details.assignmentsSubmitted) >= 6 ? '#3b82f6' : '#f59e0b',
                      color: 'white'
                    }}>
                      {child.details.assignmentsSubmitted}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ color: '#cbd5e1', fontSize: '14px' }}>Exam Marks:</label>
                <div style={{ 
                  color: '#e5e7eb', 
                  marginTop: '4px', 
                  padding: '12px', 
                  background: '#0b0d12', 
                  borderRadius: '6px',
                  border: '1px solid #333',
                  whiteSpace: 'pre-wrap'
                }}>
                  {child.details.examMarks || 'No exam marks recorded yet.'}
                </div>
              </div>
            </div>
          </div>

          {/* Class Assignments */}
          <div>
            <h2 style={{ color: '#e5e7eb', marginBottom: '16px' }}>Class Assignments</h2>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {childAssignments.length === 0 ? (
                <div style={{ 
                  color: '#94a3b8', 
                  padding: '20px', 
                  background: '#1a1a1a', 
                  borderRadius: '8px', 
                  border: '1px solid #333',
                  textAlign: 'center'
                }}>
                  No assignments posted for this class yet.
                </div>
              ) : (
                childAssignments.map((assignment) => (
                  <div key={assignment.id} style={{ 
                    padding: '16px', 
                    background: '#1a1a1a', 
                    borderRadius: '8px', 
                    border: '1px solid #333',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ color: '#e5e7eb', fontWeight: 'bold', fontSize: '16px' }}>
                        {assignment.title}
                      </div>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background: assignment.status === 'completed' ? '#10b981' : assignment.status === 'submitted' ? '#3b82f6' : '#f59e0b',
                        color: 'white'
                      }}>
                        {assignment.status}
                      </span>
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>
                      {assignment.subject} • Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'N/A'}
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                      {assignment.description}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}

function ParentReport() {
  const links = [
    { to: '/parent/dashboard', label: 'Dashboard' },
    { to: '/parent/dashboard/messages', label: 'Messages' },
    { to: '/parent/dashboard/assignments', label: 'Assignments' },
    { to: '/parent/dashboard/profile', label: 'Profile' },
    { to: '/parent/dashboard/report', label: 'Report' }
  ];

  const [child, setChild] = useState(null);
  const [generatedReport, setGeneratedReport] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Simulate getting the parent's child (in real app, this would be based on parent authentication)
    const storedStudents = loadFromStorage('students', [
      { id: '1', name: 'Ava Johnson', rollNumber: 'PT-001', email: 'ava.johnson@example.com', className: 'Grade 4', details: { attendancePercent: '92', examMarks: 'Math:95, Eng:88', assignmentsSubmitted: '8' } },
      { id: '2', name: 'Leo Patel', rollNumber: 'PT-002', email: 'leo.patel@example.com', className: 'Grade 4', details: { attendancePercent: '88', examMarks: 'Math:82, Eng:90', assignmentsSubmitted: '7' } },
      { id: '3', name: 'Mia Chen', rollNumber: 'PT-003', email: 'mia.chen@example.com', className: 'Grade 5', details: { attendancePercent: '95', examMarks: 'Math:98, Eng:92', assignmentsSubmitted: '9' } }
    ]);
    
    // For demo purposes, show the first student as the parent's child
    setChild(storedStudents[0]);
  }, []);

  function generateReport() {
    if (!child) return;
    
    setIsGenerating(true);
    
    // Simulate AI report generation
    setTimeout(() => {
      const report = `**Academic Report for ${child.name}**

**Student Information:**
- Name: ${child.name}
- Roll Number: ${child.rollNumber}
- Class: ${child.className}
- Email: ${child.email}

**Academic Performance:**
- Attendance: ${child.details.attendancePercent}%
- Exam Marks: ${child.details.examMarks}
- Assignments Submitted: ${child.details.assignmentsSubmitted}

**Analysis:**
${child.details.attendancePercent >= 90 ? 'Excellent attendance record. Student shows strong commitment to learning.' : child.details.attendancePercent >= 80 ? 'Good attendance with room for improvement.' : 'Attendance needs attention. Please encourage regular attendance.'}

${parseInt(child.details.assignmentsSubmitted) >= 8 ? 'Outstanding assignment completion rate. Student demonstrates consistent effort.' : parseInt(child.details.assignmentsSubmitted) >= 6 ? 'Good assignment completion. Continue the good work.' : 'Assignment completion needs improvement. Please provide additional support.'}

**Recommendations for Parents:**
- Continue supporting current study habits
- Monitor areas with lower performance
- Maintain regular communication with teachers
- Encourage consistent attendance
- Provide additional support if needed

**Overall Grade: ${child.details.attendancePercent >= 90 && parseInt(child.details.assignmentsSubmitted) >= 8 ? 'A' : child.details.attendancePercent >= 80 && parseInt(child.details.assignmentsSubmitted) >= 6 ? 'B' : 'C'}**

**Parent-Teacher Communication:**
Regular communication between parents and teachers is essential for student success. Please feel free to reach out to teachers for any concerns or questions about your child's progress.

Generated on: ${new Date().toLocaleDateString()}`;
      
      setGeneratedReport(report);
      setIsGenerating(false);
    }, 2000);
  }

  return (
    <SidebarLayout title="Parent Dashboard" links={links}>
      <h1>Your Child's Academic Report</h1>
      <p>Generate a comprehensive academic report for your child based on their performance data.</p>

      {!child ? (
        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
          No child information available yet.
        </div>
      ) : (
        <div>
          <div style={{ 
            background: '#1a1a1a', 
            padding: '20px', 
            borderRadius: '8px', 
            border: '1px solid #333',
            marginBottom: '24px'
          }}>
            <h2 style={{ color: '#e5e7eb', marginBottom: '16px' }}>Student Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ color: '#cbd5e1', fontSize: '14px' }}>Name:</label>
                <div style={{ color: '#e5e7eb', marginTop: '4px', fontWeight: 'bold' }}>
                  {child.name}
                </div>
              </div>
              <div>
                <label style={{ color: '#cbd5e1', fontSize: '14px' }}>Class:</label>
                <div style={{ color: '#e5e7eb', marginTop: '4px' }}>
                  {child.className}
                </div>
              </div>
              <div>
                <label style={{ color: '#cbd5e1', fontSize: '14px' }}>Attendance:</label>
                <div style={{ marginTop: '4px' }}>
                  <span style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    background: child.details.attendancePercent >= 90 ? '#10b981' : child.details.attendancePercent >= 80 ? '#3b82f6' : '#f59e0b',
                    color: 'white'
                  }}>
                    {child.details.attendancePercent}%
                  </span>
                </div>
              </div>
              <div>
                <label style={{ color: '#cbd5e1', fontSize: '14px' }}>Assignments:</label>
                <div style={{ marginTop: '4px' }}>
                  <span style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    background: parseInt(child.details.assignmentsSubmitted) >= 8 ? '#10b981' : parseInt(child.details.assignmentsSubmitted) >= 6 ? '#3b82f6' : '#f59e0b',
                    color: 'white'
                  }}>
                    {child.details.assignmentsSubmitted}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <button 
              className="cta-btn primary" 
              onClick={generateReport}
              disabled={isGenerating}
              style={{ fontSize: '16px', padding: '12px 24px' }}
            >
              {isGenerating ? 'Generating Report...' : 'Generate Academic Report'}
            </button>
          </div>

          {generatedReport && (
            <div className="report-section">
              <h2 style={{ color: '#e5e7eb', marginBottom: '16px' }}>Generated Report for {child.name}</h2>
              <div className="report-content" style={{ 
                background: '#1a1a1a', 
                padding: '20px', 
                borderRadius: '8px', 
                border: '1px solid #333',
                whiteSpace: 'pre-line',
                fontFamily: 'monospace',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                {generatedReport}
              </div>
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <button className="cta-btn primary" onClick={() => {
                  navigator.clipboard.writeText(generatedReport);
                  alert('Report copied to clipboard!');
                }}>
                  Copy Report
                </button>
                <button className="cta-btn" onClick={() => {
                  setGeneratedReport('');
                }} style={{ marginLeft: '8px' }}>
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </SidebarLayout>
  );
}
