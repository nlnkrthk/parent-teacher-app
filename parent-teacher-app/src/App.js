import './App.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

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
      <form className="form">
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
      <form className="form">
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
      <form className="form">
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
      <form className="form">
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
        <Route path="/parent/signup" element={<ParentSignUp />} />
        <Route path="/parent/signin" element={<ParentSignIn />} />
        <Route path="/teacher/signup" element={<TeacherSignUp />} />
        <Route path="/teacher/signin" element={<TeacherSignIn />} />
      </Routes>
    </PageLayout>
  );
}

export default App;
