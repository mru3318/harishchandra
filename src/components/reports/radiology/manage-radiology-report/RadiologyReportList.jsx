import React, { useState, useEffect, useRef, useCallback } from "react";

const LS_KEY = "hms_radiology_reports";

const RadiologyReportList = () => {
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [editReportData, setEditReportData] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const viewModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  // Load data from localStorage
  const loadData = () => JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  const saveData = (list) => localStorage.setItem(LS_KEY, JSON.stringify(list));

  const uid = () => "id_" + Math.random().toString(36).slice(2, 9);

  // Seed initial data if empty
  const seedIfEmpty = useCallback(() => {
    const data = loadData();
    if (data.length) return;
    const initialData = [
      {
        id: uid(),
        patient: "Amit Verma",
        age: 42,
        phone: "9876543210",
        doctor: "Dr. Mehta",
        date: "2025-02-15",
        time: "10:30 AM",
        status: "Pending",
        test: "Chest X-Ray",
        report: "Mild bilateral infiltration",
      },
      {
        id: uid(),
        patient: "Priya Singh",
        age: 29,
        phone: "9123456780",
        doctor: "Dr. Kothari",
        date: "2025-02-10",
        time: "02:20 PM",
        status: "Completed",
        test: "MRI Brain",
        report: "No abnormal enhancement",
      },
    ];
    saveData(initialData);
    setReports(initialData);
  }, []);

  // Seed data on first mount. seedIfEmpty is stable in this module.
  useEffect(() => {
    seedIfEmpty();
    setReports(loadData());
  }, [seedIfEmpty]);

  const statusBadge = (status) => {
    if (status === "Completed")
      return <span className="badge text-bg-success">Completed</span>;
    if (status === "Delivered")
      return <span className="badge text-bg-secondary">Delivered</span>;
    return <span className="badge text-bg-warning">Pending</span>;
  };

  const filteredReports = reports
    .filter((r) => (statusFilter ? r.status === statusFilter : true))
    .filter((r) =>
      searchQuery
        ? r.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.phone.includes(searchQuery) ||
          r.test.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  const openEditModal = (report) => {
    setEditReportData({ ...report, status: report?.status || "Pending" });
    setShowEdit(true);
  };

  const openViewModal = (report) => {
    setSelectedReport(report);
    new window.bootstrap.Modal(viewModalRef.current).show();
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    new window.bootstrap.Modal(deleteModalRef.current).show();
  };

  const handleDelete = () => {
    const updated = reports.filter((r) => r.id !== deleteId);
    saveData(updated);
    setReports(updated);
    window.bootstrap.Modal.getInstance(deleteModalRef.current).hide();
  };

  const saveReport = (e) => {
    e.preventDefault();

    if (!editReportData.patient || !editReportData.patient.trim()) {
      alert("Enter patient name");
      return;
    }

    if (editReportData.age && Number(editReportData.age) < 0) {
      alert("Age must be 0 or more");
      return;
    }

    const updated = loadData();
    const obj = { ...editReportData, id: editReportData.id || uid() };

    const idx = updated.findIndex((x) => x.id === obj.id);
    if (idx >= 0) updated[idx] = obj;
    else updated.push(obj);

    saveData(updated);
    setReports(updated);
    setShowEdit(false);
  };

  const printReport = () => {
    if (!selectedReport) return;
    const node = document.getElementById("printableArea");
    if (!node) return;

    // Collect styles from current document head so printed window looks same
    const headHtml = Array.from(
      document.querySelectorAll('head link[rel="stylesheet"], head style')
    )
      .map((n) => n.outerHTML)
      .join("\n");

    const printHtml = `
      <html>
        <head>
          <meta charset="utf-8" />
          ${headHtml}
          <style>
            /* Ensure body background is white for print */
            body { background: #fff; color: #000; }
          </style>
        </head>
        <body>
          ${node.outerHTML}
        </body>
      </html>`;

    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) {
      // fallback to original behaviour if popup blocked
      window.print();
      return;
    }

    w.document.open();
    w.document.write(printHtml);
    w.document.close();
    // wait for resources to load then print
    w.focus();
    setTimeout(() => {
      try {
        w.print();
        w.close();
      } catch {
        // ignore
      }
    }, 300);
  };

  return (
    <>
      <div className="full-width-card card shadow-sm">
        <div
          className="card-header text-white fw-semibold fs-5 text-center"
          style={{ background: "#01C0C8" }}
        >
          <i className="fa-solid fa-x-ray me-2"></i> Radiology Report List
        </div>

        <div className="card-body">
          <div className="row g-2 mb-3 align-items-center">
            <div className="col-md-4 col-sm-8">
              <input
                type="search"
                className="form-control form-control-sm"
                placeholder="Search patient, phone, scan type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="col-md-3 col-sm-4">
              <select
                className="form-select form-select-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            <div className="col-md-5 col-sm-12 text-end">
              <span
                className="fw-semibold"
                style={{ fontSize: "17px", color: "#01A3A4" }}
              >
                Total: {filteredReports.length}
              </span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-sm align-middle">
              <thead className="table-light">
                <tr className="text-center">
                  <th>Patient</th>
                  <th>Age</th>
                  <th>Phone</th>
                  <th>Ref. Doctor</th>
                  <th>Date</th>
                  <th>Scan Type</th>
                  <th>Status</th>
                  <th style={{ minWidth: 130 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center text-muted small">
                      No reports found
                    </td>
                  </tr>
                )}
                {filteredReports.map((r) => (
                  <tr key={r.id} className="small text-center">
                    <td>{r.patient}</td>
                    <td>{r.age}</td>
                    <td>{r.phone}</td>
                    <td>{r.doctor}</td>
                    <td>{r.date}</td>
                    <td>{r.test}</td>
                    <td>{statusBadge(r.status)}</td>
                    <td>
                      <div className="action-buttons d-inline-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => openViewModal(r)}
                        >
                          <i className="fa-regular fa-eye"></i>
                        </button>
                        <button
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => openEditModal(r)}
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => openDeleteModal(r.id)}
                        >
                          <i className="fa-solid fa-trash"></i>
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

      {/* View Modal */}
      <div className="modal fade" ref={viewModalRef} tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content" id="printableArea">
            <div className="modal-header" style={{ background: "#01C0C8" }}>
              <h5 className="modal-title">Radiology Report Details</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            {selectedReport && (
              <div className="modal-body small">
                <p>
                  <strong>Patient:</strong> {selectedReport.patient}
                </p>
                <p>
                  <strong>Age:</strong> {selectedReport.age}
                </p>
                <p>
                  <strong>Gender:</strong> {selectedReport.gender}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedReport.phone}
                </p>
                <p>
                  <strong>Ref. Doctor:</strong> {selectedReport.doctor}
                </p>
                <p>
                  <strong>Report Date:</strong> {selectedReport.date}
                </p>
                <p>
                  <strong>Scan Time:</strong> {selectedReport.time}
                </p>
                <p>
                  <strong>Scan Type:</strong> {selectedReport.test}
                </p>
                <p>
                  <strong>Status:</strong> {statusBadge(selectedReport.status)}
                </p>
                <hr />
                <strong>Findings:</strong>
                <pre style={{ whiteSpace: "pre-wrap" }}>
                  {selectedReport.report}
                </pre>
              </div>
            )}
            <div className="modal-footer">
              <button
                className="btn btn-secondary btn-sm"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                className="btn btn-sm text-white"
                style={{ background: "#01C0C8" }}
                onClick={printReport}
              >
                <i className="fa-solid fa-print me-1"></i> Print
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <div className="modal fade" ref={deleteModalRef} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Delete Report?</h5>
            </div>
            <div className="modal-body small">
              Are you sure you want to delete this radiology report?
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary btn-sm"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button className="btn btn-danger btn-sm" onClick={handleDelete}>
                Delete
              </button>
            </div>
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
                  {editReportData.id ? "Edit" : "Add"} Radiology Report
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
                      value={editReportData.patient || ""}
                      onChange={(e) =>
                        setEditReportData({
                          ...editReportData,
                          patient: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={editReportData.age || ""}
                      onChange={(e) =>
                        setEditReportData({
                          ...editReportData,
                          age: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-control form-control-sm"
                      value={editReportData.gender || ""}
                      onChange={(e) =>
                        setEditReportData({
                          ...editReportData,
                          gender: e.target.value,
                        })
                      }
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      className="form-control form-control-sm"
                      value={editReportData.phone || ""}
                      onChange={(e) =>
                        setEditReportData({
                          ...editReportData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Referred Doctor</label>
                    <input
                      className="form-control form-control-sm"
                      value={editReportData.doctor || ""}
                      onChange={(e) =>
                        setEditReportData({
                          ...editReportData,
                          doctor: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Report Date</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={editReportData.date || ""}
                      onChange={(e) =>
                        setEditReportData({
                          ...editReportData,
                          date: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Scan Time</label>
                    <input
                      className="form-control form-control-sm"
                      value={editReportData.time || ""}
                      onChange={(e) =>
                        setEditReportData({
                          ...editReportData,
                          time: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Scan Type</label>
                    <input
                      className="form-control form-control-sm"
                      value={editReportData.test || ""}
                      onChange={(e) =>
                        setEditReportData({
                          ...editReportData,
                          test: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select form-select-sm"
                      value={editReportData.status || ""}
                      onChange={(e) =>
                        setEditReportData({
                          ...editReportData,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Report Findings</label>
                    <textarea
                      rows={5}
                      className="form-control form-control-sm"
                      value={editReportData.report || ""}
                      onChange={(e) =>
                        setEditReportData({
                          ...editReportData,
                          report: e.target.value,
                        })
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
    </>
  );
};

export default RadiologyReportList;
