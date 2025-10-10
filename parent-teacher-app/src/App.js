import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, Link, useNavigate, NavLink, useLocation } from 'react-router-dom';

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
  return (
    <AuthLayout title="Parent Sign Up" subtitle="Create your parent account to get started.">
      <form className="form" onSubmit={(e) => { e.preventDefault(); window.location.href = '/parent/dashboard'; }}>
        <div className="form-row">
          <label>Full Name</label>
          <input type="text" placeholder="Jane Doe" />
        </div>
        <div className="form-row">
          <label>Email</label>
          <input type="email" placeholder="jane@example.com" />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input type="password" placeholder="••••••••" />
        </div>
        <button type="submit" className="cta-btn primary" style={{ width: '100%' }}>Create Account</button>
        <p className="form-hint">Already have an account? <Link to="/parent/signin">Sign in</Link></p>
      </form>
    </AuthLayout>
  );
}

function ParentSignIn() {
  return (
    <AuthLayout title="Parent Sign In" subtitle="Welcome back! Sign in to continue.">
      <form className="form" onSubmit={(e) => { e.preventDefault(); window.location.href = '/parent/dashboard'; }}>
        <div className="form-row">
          <label>Email</label>
          <input type="email" placeholder="jane@example.com" />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input type="password" placeholder="••••••••" />
        </div>
        <button type="submit" className="cta-btn primary" style={{ width: '100%' }}>Sign In</button>
        <p className="form-hint">New here? <Link to="/parent/signup">Create an account</Link></p>
      </form>
    </AuthLayout>
  );
}

function TeacherSignUp() {
  return (
    <AuthLayout title="Teacher Sign Up" subtitle="Join to connect with parents and manage your class.">
      <form className="form" onSubmit={(e) => { e.preventDefault(); window.location.href = '/teacher/dashboard'; }}>
        <div className="form-row">
          <label>Full Name</label>
          <input type="text" placeholder="Mr. John Smith" />
        </div>
        <div className="form-row">
          <label>Email</label>
          <input type="email" placeholder="john@example.com" />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input type="password" placeholder="••••••••" />
        </div>
        <button type="submit" className="cta-btn primary" style={{ width: '100%' }}>Create Account</button>
        <p className="form-hint">Already have an account? <Link to="/teacher/signin">Sign in</Link></p>
      </form>
    </AuthLayout>
  );
}

function TeacherSignIn() {
  return (
    <AuthLayout title="Teacher Sign In" subtitle="Welcome back! Sign in to continue.">
      <form className="form" onSubmit={(e) => { e.preventDefault(); window.location.href = '/teacher/dashboard'; }}>
        <div className="form-row">
          <label>Email</label>
          <input type="email" placeholder="john@example.com" />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input type="password" placeholder="••••••••" />
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
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/dashboard/students" element={<TeacherStudents />} />
        <Route path="/teacher/dashboard/classes" element={<TeacherClasses />} />
        <Route path="/teacher/dashboard/announcements" element={<TeacherAnnouncements />} />
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
    { to: '/parent/dashboard/settings', label: 'Settings' }
  ];
  return (
    <SidebarLayout title="Parent Dashboard" links={links}>
      <h1>Dashboard</h1>
      <p>Welcome! Here you’ll see announcements, upcoming events, and your child’s progress.</p>
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
    { to: '/teacher/dashboard/settings', label: 'Settings' }
  ];
  const [announcements, setAnnouncements] = useState([]);
  useEffect(() => {
    const stored = loadFromStorage('announcements', []);
    setAnnouncements(stored);
  }, []);

  return (
    <SidebarLayout title="Teacher Dashboard" links={links}>
      <h1>Dashboard</h1>
      <p>Welcome! Manage your students, classes, share announcements, and coordinate with parents.</p>

      <div className="announcements-list">
        {announcements.length === 0 ? (
          <div className="announcement-empty">No announcements yet. Create one from the Announcements tab.</div>
        ) : announcements.map((a) => (
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
    { to: '/teacher/dashboard/settings', label: 'Settings' }
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
    { to: '/teacher/dashboard/settings', label: 'Settings' }
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
    { to: '/teacher/dashboard/settings', label: 'Settings' }
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
