import React, { useEffect, useState } from "react";

const LS_KEY = "hms_path_reports";

function uid() {
  return "id_" + Math.random().toString(36).slice(2, 9);
}

export default function PathologyReportList() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [form, setForm] = useState({
    id: "",
    patient: "",
    age: "",
    phone: "",
    doctor: "",
    date: "",
    time: "",
    test: "",
    report: "",
    status: "Pending",
  });

  const [viewData, setViewData] = useState({});
  const [deleteId, setDeleteId] = useState(null);

  // Load from localStorage
  function loadData() {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  }

  // Save to localStorage
  function saveData(list) {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  }

  // Seed if empty
  useEffect(() => {
    const existing = loadData();
    if (existing.length === 0) {
      const sample = [
        {
          id: uid(),
          patient: "Rahul Kumar",
          age: 30,
          phone: "9876543210",
          doctor: "Dr. Mehta",
          date: "2025-02-15",
          time: "10:30 AM",
          status: "Pending",
          test: "Blood Count",
          report: "HB Normal\nWBC Normal",
        },
        {
          id: uid(),
          patient: "Sneha Sharma",
          age: 26,
          phone: "9123456780",
          doctor: "Dr. Kothari",
          date: "2025-02-10",
          time: "09:45 AM",
          status: "Completed",
          test: "LFT",
          report: "ALT Slight High",
        },
      ];
      saveData(sample);
      setData(sample);
    } else {
      setData(existing);
    }
  }, []);

  // Render/Filter Table Data
  const filtered = data
    .filter((r) => (filter ? r.status === filter : true))
    .filter((r) =>
      search
        ? r.patient.toLowerCase().includes(search.toLowerCase()) ||
          r.phone.includes(search) ||
          r.test.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const statusBadge = (s) => {
    if (s === "Completed")
      return <span className="badge text-bg-success">Completed</span>;
    if (s === "Delivered")
      return <span className="badge text-bg-secondary">Delivered</span>;
    return <span className="badge text-bg-warning">Pending</span>;
  };

  // Edit / Add Save
  const saveReport = (e) => {
    e.preventDefault();

    if (!form.patient.trim()) return alert("Enter patient name");
    if (form.age && Number(form.age) < 0) return alert("Age must be 0 or more");

    const updated = loadData();
    const obj = { ...form, id: form.id || uid() };

    const idx = updated.findIndex((x) => x.id === obj.id);
    if (idx >= 0) updated[idx] = obj;
    else updated.push(obj);

    saveData(updated);
    setData(updated);
    setShowEdit(false);
  };

  // Delete
  const confirmDelete = () => {
    const updated = loadData().filter((x) => x.id !== deleteId);
    saveData(updated);
    setData(updated);
    setShowDelete(false);
  };

  return (
    <>
      {/* Page Card */}
      <div className="full-width-card card shadow-sm">
        <div
          className="card-header text-white fw-semibold fs-5 text-center"
          style={{ background: "#01C0C8" }}
        >
          <i className="bi bi-hospital me-2"></i> Pathology Report List
        </div>

        <div className="card-body">
          {/* Search Row */}
          <div className="row g-2 mb-3 align-items-center">
            <div className="col-md-4 col-sm-8">
              <input
                type="search"
                className="form-control form-control-sm"
                placeholder="Search patient, phone, test..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-3 col-sm-4">
              <select
                className="form-select form-select-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">All status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div className="col-md-5 text-end">
              <span
                className="fw-semibold"
                style={{ fontSize: "17px", color: "#01A3A4" }}
              >
                Total: {filtered.length}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-bordered table-sm align-middle">
              <thead className="table-light text-center">
                <tr>
                  <th>Patient</th>
                  <th>Age</th>
                  <th>Phone</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Test</th>
                  <th>Status</th>
                  <th style={{ minWidth: 130 }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center text-muted small">
                      No reports found
                    </td>
                  </tr>
                )}

                {filtered.map((r) => (
                  <tr className="small text-center" key={r.id}>
                    <td>{r.patient}</td>
                    <td>{r.age}</td>
                    <td>{r.phone}</td>
                    <td>{r.doctor}</td>
                    <td>{r.date}</td>
                    <td>{r.test}</td>
                    <td>{statusBadge(r.status)}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-1">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            setViewData(r);
                            setShowView(true);
                          }}
                        >
                          <i className="bi bi-eye" />
                        </button>
                        <button
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => {
                            setForm(r);
                            setShowEdit(true);
                          }}
                        >
                          <i className="bi bi-pencil" />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => {
                            setDeleteId(r.id);
                            setShowDelete(true);
                          }}
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showEdit && (
        <div
          className="modal fade show d-block"
          style={{ background: "#00000070" }}
        >
          <div className="modal-dialog modal-lg">
            <form className="modal-content" onSubmit={saveReport}>
              <div
                className="modal-header text-white"
                style={{ background: "linear-gradient(90deg,#00b4b4,#018a8a)" }}
              >
                <h5 className="modal-title">
                  {form.id ? "Edit" : "Add"} Pathology Report
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEdit(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Patient Name</label>
                    <input
                      className="form-control form-control-sm"
                      value={form.patient}
                      onChange={(e) =>
                        setForm({ ...form, patient: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={form.age}
                      onChange={(e) =>
                        setForm({ ...form, age: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Phone</label>
                    <input
                      className="form-control form-control-sm"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Referred Doctor</label>
                    <input
                      className="form-control form-control-sm"
                      value={form.doctor}
                      onChange={(e) =>
                        setForm({ ...form, doctor: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Report Date</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Sample Time</label>
                    <input
                      className="form-control form-control-sm"
                      value={form.time}
                      onChange={(e) =>
                        setForm({ ...form, time: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Test / Investigation</label>
                    <input
                      className="form-control form-control-sm"
                      value={form.test}
                      onChange={(e) =>
                        setForm({ ...form, test: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <div className="d-flex gap-3">
                      {["Pending", "Completed", "Delivered"].map((s) => (
                        <label className="form-check" key={s}>
                          <input
                            type="radio"
                            className="form-check-input"
                            checked={form.status === s}
                            onChange={() => setForm({ ...form, status: s })}
                          />{" "}
                          {s}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Report Findings</label>
                    <textarea
                      rows={5}
                      className="form-control form-control-sm"
                      value={form.report}
                      onChange={(e) =>
                        setForm({ ...form, report: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setShowEdit(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-sm text-white"
                  style={{ background: "#01C0C8" }}
                  type="submit"
                >
                  <i className="bi bi-save me-1" /> Save Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showView && (
        <div
          className="modal fade show d-block"
          style={{ background: "#00000070" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content" id="printArea">
              <div className="modal-header">
                <h5 className="modal-title">Pathology Report Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowView(false)}
                ></button>
              </div>

              <div className="modal-body small">
                <p>
                  <strong>Patient:</strong> {viewData.patient}
                </p>
                <p>
                  <strong>Age:</strong> {viewData.age}
                </p>
                <p>
                  <strong>Phone:</strong> {viewData.phone}
                </p>
                <p>
                  <strong>Doctor:</strong> {viewData.doctor}
                </p>
                <p>
                  <strong>Report Date:</strong> {viewData.date}
                </p>
                <p>
                  <strong>Sample Time:</strong> {viewData.time}
                </p>
                <p>
                  <strong>Test:</strong> {viewData.test}
                </p>
                <p>
                  <strong>Status:</strong> {statusBadge(viewData.status)}
                </p>
                <hr />
                <strong>Findings:</strong>
                <pre className="mt-2" style={{ whiteSpace: "pre-wrap" }}>
                  {viewData.report}
                </pre>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowView(false)}
                >
                  Close
                </button>
                <button
                  className="btn btn-sm text-white"
                  style={{ background: "#01C0C8" }}
                  onClick={() => window.print()}
                >
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDelete && (
        <div
          className="modal fade show d-block"
          style={{ background: "#00000070" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Delete Report?</h5>
              </div>
              <div className="modal-body small">
                Are you sure you want to delete this report?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowDelete(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
