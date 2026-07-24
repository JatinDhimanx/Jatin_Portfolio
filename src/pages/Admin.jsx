import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import './Admin.css';

const defaultData = {
  hero: { tag: "Full Stack & C++ Developer", firstName: "JATIN", lastName: "DHIMAN" },
  about: { title: "CRAFTSMAN OF DIGITAL EXPERIENCES", description: "Passionate developer focused on building scalable web applications and high-performance algorithms." },
  services: [
    { title: "Web Development", description: "Building modern, responsive, and performance-focused web applications." },
    { title: "C++ & Algorithms", description: "Writing efficient, high-performance logic and data structures." }
  ],
  projects: [
    { name: "Portfolio Website", type: "Web App", url: "https://github.com/JatinDhimanx" }
  ],
  experience: [
    { year: "2024 - PRESENT", role: "Full Stack Developer", company: "Independent / Projects" }
  ],
  contact: { email: "forworkm9@gmail.com" }
};

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const [data, setData] = useState(defaultData);
  const [underConstruction, setUnderConstruction] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [credMessage, setCredMessage] = useState('');

  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email);
          await loadDataFromSupabase();
        }

        supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_OUT') {
            setIsAuthenticated(false);
            setUserEmail('');
          }
        });
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const loadDataFromSupabase = async () => {
    try {
      const { data: record } = await supabase
        .from('site_settings')
        .select('portfolio_data, under_construction')
        .single();

      if (record) {
        if (record.portfolio_data) setData(record.portfolio_data);
        setUnderConstruction(!!record.under_construction);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPass,
      });

      if (error) {
        setLoginError(error.message);
        return;
      }

      if (authData.session) {
        setIsAuthenticated(true);
        setUserEmail(authData.user.email);
        setLoginPass('');
        await loadDataFromSupabase();
      }
    } catch (err) {
      console.error(err);
      setLoginError('Error connecting to Supabase.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserEmail('');
  };

  const handleSaveData = async () => {
    setStatusMessage('SAVING...');
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ portfolio_data: data })
        .eq('id', 1);

      if (error) throw error;

      setStatusMessage('✓ SAVED SUCCESSFULLY');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setStatusMessage('✕ ERROR SAVING DATA');
    }
  };

  const handleToggleConstruction = async (e) => {
    const newValue = e.target.checked;
    setUnderConstruction(newValue);
    try {
      await supabase
        .from('site_settings')
        .update({ under_construction: newValue })
        .eq('id', 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setCredMessage('Password must be at least 6 characters!');
      setTimeout(() => setCredMessage(''), 3000);
      return;
    }

    setCredMessage('Updating...');
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setCredMessage('Password updated successfully!');
      setNewPassword('');
    } catch (err) {
      console.error(err);
      setCredMessage('Failed to update: ' + (err.message || 'Unknown error'));
    }
    setTimeout(() => setCredMessage(''), 5000);
  };

  if (loading) {
    return (
      <div className="admin-loadingContainer">
        <div className="admin-loaderText">JATIN</div>
        <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Authenticating...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-loginPage">
        <div className="admin-loginCard">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div className="admin-logoBox">JD</div>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.5rem', color: '#0a0a0a', letterSpacing: '0.05em', margin: '0.75rem 0 0' }}>
              ADMIN LOGIN
            </h1>
            <p style={{ color: '#666', fontSize: '0.85rem', letterSpacing: '0.05em', marginTop: '4px' }}>Sign in to manage portfolio content</p>
          </div>

          {loginError && (
            <div className="admin-errorAlert">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="admin-formGroup">
              <label className="admin-label">Email Address</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="admin-input"
              />
            </div>
            <div className="admin-formGroup">
              <label className="admin-label">Password</label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="••••••••"
                required
                className="admin-input"
              />
            </div>
            <button type="submit" className="admin-btnBlackFull">
              SIGN IN TO DASHBOARD
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboardContainer">
      {/* Black Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebarBrand">
          <div className="admin-logoBoxWhite">JD</div>
          <div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', color: '#f5f4f0', letterSpacing: '0.05em' }}>JATIN DHIMAN</div>
            <div style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin Control</div>
          </div>
        </div>

        <div className="admin-sidebarNav">
          {[
            { id: 'hero', label: 'HERO & BIO', icon: '01' },
            { id: 'about', label: 'ABOUT ME', icon: '02' },
            { id: 'services', label: 'SERVICES', icon: '03' },
            { id: 'projects', label: 'PROJECTS', icon: '04' },
            { id: 'experience', label: 'EXPERIENCE', icon: '05' },
            { id: 'settings', label: 'SETTINGS & SECURITY', icon: '06' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`admin-navItem ${activeTab === tab.id ? "admin-navItemActive" : ""}`}
            >
              <span style={{ fontSize: '0.75rem', fontFamily: 'Bebas Neue, sans-serif', color: activeTab === tab.id ? '#0a0a0a' : '#666', marginRight: '12px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="admin-sidebarFooter">
          <div style={{ color: '#888', fontSize: '0.75rem', marginBottom: '12px', wordBreak: 'break-all' }}>
            {userEmail}
          </div>
          <button onClick={handleLogout} className="admin-btnLogout">
            LOGOUT
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-mainContent">
        {/* Header Bar */}
        <header className="admin-header">
          <div>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888' }}>ADMIN PANEL</span>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '3.5rem', color: '#0a0a0a', letterSpacing: '0.02em', margin: 0, lineHeight: 0.9 }}>
              PORTFOLIO MANAGER
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="admin-statusBadge" style={{ backgroundColor: underConstruction ? '#0a0a0a' : '#f5f4f0', color: underConstruction ? '#f5f4f0' : '#0a0a0a', borderColor: '#0a0a0a' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: underConstruction ? '#ef4444' : '#22c55e',
                marginRight: '8px'
              }}></span>
              {underConstruction ? 'UNDER CONSTRUCTION' : 'LIVE ON WEB'}
            </span>

            <a href="/" target="_blank" rel="noreferrer" className="admin-btnOutline">
              VIEW SITE ↗
            </a>
          </div>
        </header>

        {/* Dynamic Section Content */}
        <div className="admin-contentBody">
          {activeTab === 'hero' && (
            <div className="admin-card">
              <h2 className="admin-cardTitle">HERO SECTION</h2>
              <div className="admin-formGroup">
                <label className="admin-label">Tagline (HTML Allowed)</label>
                <input
                  type="text"
                  value={data.hero?.tag || ''}
                  onChange={(e) => setData({ ...data, hero: { ...data.hero, tag: e.target.value } })}
                  className="admin-input"
                />
              </div>
              <div className="admin-grid-2">
                <div className="admin-formGroup">
                  <label className="admin-label">First Name</label>
                  <input
                    type="text"
                    value={data.hero?.firstName || ''}
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, firstName: e.target.value } })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-formGroup">
                  <label className="admin-label">Last Name</label>
                  <input
                    type="text"
                    value={data.hero?.lastName || ''}
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, lastName: e.target.value } })}
                    className="admin-input"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="admin-card">
              <h2 className="admin-cardTitle">ABOUT SECTION</h2>
              <div className="admin-formGroup">
                <label className="admin-label">Title (HTML Allowed)</label>
                <input
                  type="text"
                  value={data.about?.title || ''}
                  onChange={(e) => setData({ ...data, about: { ...data.about, title: e.target.value } })}
                  className="admin-input"
                />
              </div>
              <div className="admin-formGroup">
                <label className="admin-label">Description / Bio</label>
                <textarea
                  rows={4}
                  value={data.about?.description || ''}
                  onChange={(e) => setData({ ...data, about: { ...data.about, description: e.target.value } })}
                  className="admin-textarea"
                />
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="admin-card">
              <div className="admin-cardHeader">
                <h2 className="admin-cardTitle">SERVICES ({data.services?.length || 0})</h2>
                <button
                  onClick={() => setData({ ...data, services: [...(data.services || []), { title: '', description: '' }] })}
                  className="admin-btnBlackSmall"
                >
                  + ADD SERVICE
                </button>
              </div>
              {(data.services || []).map((service, index) => (
                <div key={index} className="admin-itemCard">
                  <button
                    onClick={() => {
                      const next = [...data.services];
                      next.splice(index, 1);
                      setData({ ...data, services: next });
                    }}
                    className="admin-btnDelete"
                  >
                    REMOVE
                  </button>
                  <div className="admin-formGroup">
                    <label className="admin-label">Service Title</label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => {
                        const next = [...data.services];
                        next[index].title = e.target.value;
                        setData({ ...data, services: next });
                      }}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-formGroup">
                    <label className="admin-label">Description</label>
                    <textarea
                      rows={2}
                      value={service.description}
                      onChange={(e) => {
                        const next = [...data.services];
                        next[index].description = e.target.value;
                        setData({ ...data, services: next });
                      }}
                      className="admin-textarea"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="admin-card">
              <div className="admin-cardHeader">
                <h2 className="admin-cardTitle">PROJECTS ({data.projects?.length || 0})</h2>
                <button
                  onClick={() => setData({ ...data, projects: [...(data.projects || []), { name: '', type: '', url: '' }] })}
                  className="admin-btnBlackSmall"
                >
                  + ADD PROJECT
                </button>
              </div>
              {(data.projects || []).map((project, index) => (
                <div key={index} className="admin-itemCard">
                  <button
                    onClick={() => {
                      const next = [...data.projects];
                      next.splice(index, 1);
                      setData({ ...data, projects: next });
                    }}
                    className="admin-btnDelete"
                  >
                    REMOVE
                  </button>
                  <div className="admin-grid-2">
                    <div className="admin-formGroup">
                      <label className="admin-label">Project Name</label>
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => {
                          const next = [...data.projects];
                          next[index].name = e.target.value;
                          setData({ ...data, projects: next });
                        }}
                        className="admin-input"
                      />
                    </div>
                    <div className="admin-formGroup">
                      <label className="admin-label">Project Type</label>
                      <input
                        type="text"
                        value={project.type}
                        onChange={(e) => {
                          const next = [...data.projects];
                          next[index].type = e.target.value;
                          setData({ ...data, projects: next });
                        }}
                        className="admin-input"
                      />
                    </div>
                  </div>
                  <div className="admin-formGroup">
                    <label className="admin-label">Project URL</label>
                    <input
                      type="text"
                      value={project.url}
                      onChange={(e) => {
                        const next = [...data.projects];
                        next[index].url = e.target.value;
                        setData({ ...data, projects: next });
                      }}
                      className="admin-input"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="admin-card">
              <div className="admin-cardHeader">
                <h2 className="admin-cardTitle">EXPERIENCE TIMELINE ({data.experience?.length || 0})</h2>
                <button
                  onClick={() => setData({ ...data, experience: [...(data.experience || []), { year: '', role: '', company: '' }] })}
                  className="admin-btnBlackSmall"
                >
                  + ADD EXPERIENCE
                </button>
              </div>
              {(data.experience || []).map((exp, index) => (
                <div key={index} className="admin-itemCard">
                  <button
                    onClick={() => {
                      const next = [...data.experience];
                      next.splice(index, 1);
                      setData({ ...data, experience: next });
                    }}
                    className="admin-btnDelete"
                  >
                    REMOVE
                  </button>
                  <div className="admin-grid-3">
                    <div className="admin-formGroup">
                      <label className="admin-label">Year / Period</label>
                      <input
                        type="text"
                        value={exp.year}
                        onChange={(e) => {
                          const next = [...data.experience];
                          next[index].year = e.target.value;
                          setData({ ...data, experience: next });
                        }}
                        className="admin-input"
                      />
                    </div>
                    <div className="admin-formGroup">
                      <label className="admin-label">Role</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => {
                          const next = [...data.experience];
                          next[index].role = e.target.value;
                          setData({ ...data, experience: next });
                        }}
                        className="admin-input"
                      />
                    </div>
                    <div className="admin-formGroup">
                      <label className="admin-label">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const next = [...data.experience];
                          next[index].company = e.target.value;
                          setData({ ...data, experience: next });
                        }}
                        className="admin-input"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="admin-card">
                <h2 className="admin-cardTitle">FOOTER CONTACT EMAIL</h2>
                <div className="admin-formGroup">
                  <label className="admin-label">Contact Email</label>
                  <input
                    type="email"
                    value={data.contact?.email || ''}
                    onChange={(e) => setData({ ...data, contact: { ...data.contact, email: e.target.value } })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-card" style={{ border: "1.5px solid #0a0a0a", backgroundColor: "#e8e7e2" }}>
                <h2 className="admin-cardTitle" style={{ color: '#0a0a0a' }}>MAINTENANCE OVERLAY MODE</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    id="underConstructionToggle"
                    checked={underConstruction}
                    onChange={handleToggleConstruction}
                    style={{ width: '22px', height: '22px', accentColor: '#0a0a0a', cursor: 'pointer' }}
                  />
                  <label htmlFor="underConstructionToggle" style={{ color: '#0a0a0a', fontWeight: 500, fontSize: '0.95rem', cursor: 'pointer' }}>
                    Enable "Under Construction" Overlay Mode for all visitors
                  </label>
                </div>
              </div>

              <div className="admin-card">
                <h2 className="admin-cardTitle">ACCOUNT SECURITY</h2>
                <div className="admin-formGroup">
                  <label className="admin-label">New Admin Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 chars)"
                    className="admin-input"
                  />
                </div>
                <button onClick={handleChangePassword} className="admin-btnBlackSmall">
                  UPDATE PASSWORD
                </button>
                {credMessage && <span style={{ color: '#0a0a0a', marginLeft: '16px', fontWeight: 600, fontSize: '0.85rem' }}>{credMessage}</span>}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Black Save Bar */}
        <div className="admin-saveBar">
          <span style={{ color: '#22c55e', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.05em' }}>{statusMessage}</span>
          <button onClick={handleSaveData} className="admin-btnSave">
            SAVE CHANGES
          </button>
        </div>
      </main>
    </div>
  );
}

// Editorial High-Contrast Black & White Styling Matching Main Portfolio Theme
