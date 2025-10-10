import React, { useState } from 'react';
import './App.css';
import { Routes, Route, Link, useNavigate, NavLink, useLocation } from 'react-router-dom';

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
    { to: '/parent/dashboard', label: 'Overview' },
    { to: '/parent/dashboard/messages', label: 'Messages' },
    { to: '/parent/dashboard/assignments', label: 'Assignments' },
    { to: '/parent/dashboard/settings', label: 'Settings' }
  ];
  return (
    <SidebarLayout title="Parent Dashboard" links={links}>
      <h1>Overview</h1>
      <p>Welcome! Here you’ll see announcements, upcoming events, and your child’s progress.</p>
    </SidebarLayout>
  );
}

function TeacherDashboard() {
  const links = [
    { to: '/teacher/dashboard', label: 'Overview' },
    { to: '/teacher/dashboard/students', label: 'Students' },
    { to: '/teacher/dashboard/messages', label: 'Messages' },
    { to: '/teacher/dashboard/settings', label: 'Settings' }
  ];
  return (
    <SidebarLayout title="Teacher Dashboard" links={links}>
      <h1>Overview</h1>
      <p>Welcome! Manage your students, share announcements, and coordinate with parents.</p>
    </SidebarLayout>
  );
}

function TeacherStudents() {
  const links = [
    { to: '/teacher/dashboard', label: 'Overview' },
    { to: '/teacher/dashboard/students', label: 'Students' },
    { to: '/teacher/dashboard/messages', label: 'Messages' },
    { to: '/teacher/dashboard/settings', label: 'Settings' }
  ];
  const [students, setStudents] = useState([
    { id: '1', name: 'Ava Johnson', rollNumber: 'PT-001', email: 'ava.johnson@example.com', className: 'Grade 4' },
    { id: '2', name: 'Leo Patel', rollNumber: 'PT-002', email: 'leo.patel@example.com', className: 'Grade 4' },
    { id: '3', name: 'Mia Chen', rollNumber: 'PT-003', email: 'mia.chen@example.com', className: 'Grade 5' }
  ]);
  const [form, setForm] = useState({ name: '', rollNumber: '', email: '', className: '' });
  const [error, setError] = useState('');

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
      { id, name: form.name, rollNumber: form.rollNumber, email: form.email, className: form.className || '—' }
    ]);
    setForm({ name: '', rollNumber: '', email: '', className: '' });
  }

  function handleDelete(id) {
    setStudents((list) => list.filter((s) => s.id !== id));
  }

  return (
    <SidebarLayout title="Teacher Dashboard" links={links}>
      <h1>Students</h1>
      <p>Manage your roster. Add students and view key details.</p>

      <form className="form add-student" onSubmit={handleAdd} style={{ maxWidth: '720px' }}>
        {error ? <div className="form-error">{error}</div> : null}
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
        <div>
          <button type="submit" className="cta-btn primary">Add Student</button>
        </div>
      </form>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll No</th>
              <th>Email</th>
              <th>Class</th>
              <th style={{ width: '100px' }}>Actions</th>
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
    </SidebarLayout>
  );
}
