import "./AdminDashboard.css";
// import dash1 from "../../assets/images/dashboard/dash1.png";

const AdminDashboard = () => {
  return (
    <>
      <div className="header-toolbar d-flex justify-content-between align-items-center mt-4">
        <div className="d-flex align-items-center">
          
          <span className="text-dark font-weight-bold mx-2"> Welcome Admin </span>
        </div>
        <div className="d-flex align-items-center">
          <button className="btn make-appoint rounded-pill me-2">
            <i className="fas fa-plus me-1" /> Make Appointment
          </button>
        </div>
      </div>
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <div className="jumbotron-hero">
              <div>
                <h5 className="fw-normal">Good Morning.</h5>
                <h2 className="fw-bold">Admin</h2>
                <p className="mb-0">Overview of the system.</p>
              </div>
              <div className="card-container">
                <div className="card-hero">
                  <div className="icon-box new-patient">
                    <i className="fas fa-procedures" />
                  </div>
                  <div>
                    <p className="mb-0 fs-4 fw-bold">8</p>
                    <span className="small">Surgeries Today</span>
                  </div>
                </div>
                <div className="card-hero">
                  <div className="icon-box surgeries">
                    <i className="fas fa-walking" />
                  </div>
                  <div>
                    <p className="mb-0 fs-4 fw-bold">21</p>
                    <span className="small">Discharges</span>
                  </div>
                </div>
                <div className="card-hero">
                  <div className="icon-box discharge">
                    <i className="fas fa-pills" />
                  </div>
                  <div>
                    <p className="mb-0 fs-5 fw-bold">Pharmacy</p>
                    <span className="small">Stock Alert</span>
                  </div>
                </div>
              </div>
              <img
                src="../../assets/images/dashboard/dash1.png"
                className="illustration"
                alt="Medical team illustration"
              />
            </div>
          </div>
        </div>
        <div className="row g-3 mt-0">
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div
              className="analytics-card"
              style={{
                background: "linear-gradient(135deg, #00897b, #4db6ac)",
                color: "white",
                borderRadius: 12,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
              }}
            >
              <div className="d-flex align-items-center">
                <div className="icon-box me-3">
                  <i className="fas fa-bed" />
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">56</h4>
                  <p className="mb-0">IPD Patients</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div
              className="analytics-card"
              style={{
                background: "linear-gradient(135deg, #1976d2, #64b5f6)",
                color: "white",
                borderRadius: 12,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
              }}
            >
              <div className="d-flex align-items-center">
                <div className="icon-box me-3">
                  <i className="fas fa-heartbeat" />
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">210</h4>
                  <p className="mb-0">OPD Patients</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div
              className="analytics-card"
              style={{
                background: "linear-gradient(135deg, #c62828, #ef5350)",
                color: "white",
                borderRadius: 12,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
              }}
            >
              <div className="d-flex align-items-center">
                <div className="icon-box me-3">
                  <i className="fas fa-procedures" />
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">36</h4>
                  <p className="mb-0">ER Patients</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div
              className="analytics-card"
              style={{
                background: "linear-gradient(135deg, #ef6c00, #ffb74d)",
                color: "white",
                borderRadius: 12,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
              }}
            >
              <div className="d-flex align-items-center">
                <div className="icon-box me-3">
                  <i className="fas fa-user-md" />
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">52</h4>
                  <p className="mb-0">Total Doctors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row g-3 mt-0">
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div
              className="analytics-card"
              style={{
                background: "linear-gradient(135deg, #2e7d32, #81c784)",
                color: "white",
                borderRadius: 12,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
              }}
            >
              <div className="d-flex align-items-center">
                <div className="icon-box me-3">
                  <i className="fas fa-users" />
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">120</h4>
                  <p className="mb-0">Total Staff</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div
              className="analytics-card"
              style={{
                background: "linear-gradient(135deg, #6a1b9a, #ba68c8)",
                color: "white",
                borderRadius: 12,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
              }}
            >
              <div className="d-flex align-items-center">
                <div className="icon-box me-3">
                  <i className="fas fa-calendar-check" />
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">43</h4>
                  <p className="mb-0">Appointments</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div
              className="analytics-card"
              style={{
                background: "linear-gradient(135deg, #4527a0, #9575cd)",
                color: "white",
                borderRadius: 12,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
              }}
            >
              <div className="d-flex align-items-center">
                <div className="icon-box me-3">
                  <i className="fas fa-file-invoice" />
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">38</h4>
                  <p className="mb-0">Pending Bills</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div
              className="analytics-card"
              style={{
                background: "linear-gradient(135deg, #0277bd, #4fc3f7)",
                color: "white",
                borderRadius: 12,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
              }}
            >
              <div className="d-flex align-items-center">
                <div className="icon-box me-3">
                  <i className="fas fa-bed" />
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">82</h4>
                  <p className="mb-0" style={{ whiteSpace: "nowrap" }}>
                    Available Beds
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row g-3 mt-0">
          {/* Latest Notices */}
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="analytics-card">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0 fw-bold">LATEST NOTICES</h6>
                <div className="notice-header-tools">
                  <span className="badge bg-danger">3 UNREAD</span>
                  <a href="#" className="text-decoration-none">
                    View All »
                  </a>
                </div>
              </div>
              <hr />
              {/* Notice Item */}
              <div className="notice-item d-flex justify-content-between align-items-center py-2 border-bottom">
                <div className="d-flex align-items-center">
                  <span className="text-primary me-2">
                    <i className="fas fa-file-alt" />
                  </span>
                  <span className="fw-semibold">HR</span>
                </div>
                <small className="text-muted">1h ago</small>
              </div>
              <div className="notice-item d-flex justify-content-between align-items-center py-2 border-bottom">
                <div className="d-flex align-items-center">
                  <span className="text-warning me-2">
                    <i className="fas fa-cog" />
                  </span>
                  <span className="fw-semibold">Shift Change Notification</span>
                </div>
                <small className="text-muted">2h ago</small>
              </div>
              <div className="notice-item d-flex justify-content-between align-items-center py-2 border-bottom">
                <div className="d-flex align-items-center">
                  <span className="text-primary me-2">
                    <i className="fas fa-network-wired" />
                  </span>
                  <span className="fw-semibold">Announcement</span>
                </div>
                <small className="text-muted">1h ago</small>
              </div>
              <div className="notice-item d-flex justify-content-between align-items-center py-2 border-bottom">
                <div className="d-flex align-items-center">
                  <span className="text-primary me-2">
                    <i className="fas fa-file" />
                  </span>
                  <span className="fw-semibold">General</span>
                </div>
                <small className="text-muted">Yesterday</small>
              </div>
              <div className="notice-item d-flex justify-content-between align-items-center py-2 border-bottom">
                <div className="d-flex align-items-center">
                  <span className="text-primary me-2">
                    <i className="fas fa-file" />
                  </span>
                  <span className="fw-semibold">General</span>
                </div>
                <small className="text-muted">Read</small>
              </div>
              <div className="notice-item d-flex justify-content-between align-items-center py-2">
                <div className="d-flex align-items-center">
                  <span className="text-warning me-2">
                    <i className="fas fa-tools" />
                  </span>
                  <span className="fw-semibold">Maintenance</span>
                </div>
                <small className="text-muted">2 days ago</small>
              </div>
            </div>
          </div>
          {/* Hospital Earnings */}
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="analytics-card hospital-earnings">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0 fw-bold">Hospital Earnings</h6>
                <div>
                  <a href="#" className="ms-2 text-decoration-none">
                    View Report »
                  </a>
                </div>
              </div>
              <hr />
              {/* Content */}
              <div className="row g-3">
                {/* Online Consultation */}
                <div className="col-sm-6 col-12">
                  <div className="p-3 border h-100" style={{ borderRadius: 1 }}>
                    <h5>
                      ₹4900 <small className="text-success">20% ↑</small>
                    </h5>
                    <p className="mb-0">Online Consultation</p>
                  </div>
                </div>
                {/* Overall Purchases */}
                <div className="col-sm-6 col-12">
                  <div className="p-3 border h-100" style={{ borderRadius: 1 }}>
                    <h5>
                      ₹750 <small className="text-danger">26% ↓</small>
                    </h5>
                    <p className="mb-0">Overall Purchases</p>
                  </div>
                </div>
                {/* Pending Invoices */}
                <div className="col-sm-6 col-12">
                  <div className="p-3 border h-100" style={{ borderRadius: 1 }}>
                    <h5>
                      ₹560 <small className="text-success">28% ↑</small>
                    </h5>
                    <p className="mb-0">Pending Invoices</p>
                  </div>
                </div>
                {/* Monthly Billing */}
                <div className="col-sm-6 col-12">
                  <div className="p-3 border h-100" style={{ borderRadius: 1 }}>
                    <h5>
                      ₹390 <small className="text-success">30% ↑</small>
                    </h5>
                    <p className="mb-0">Monthly Billing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ####################################################################### */}
      </div>
    </>
  );
};

export default AdminDashboard;
