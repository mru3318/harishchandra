import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPrescriptions,
  selectPrescriptions,
  selectFetchPrescriptionsStatus,
  selectFetchPrescriptionsError,
} from "../../../features/priscriptionSlice";

export default function ManagePrescription() {
  const dispatch = useDispatch();
  const prescriptions = useSelector(selectPrescriptions) || [];
  const fetchStatus = useSelector(selectFetchPrescriptionsStatus);
  const fetchError = useSelector(selectFetchPrescriptionsError);
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState("");

  const openViewModal = (id) => {
    const found = prescriptions.find((p) => p.id === id);
    setSelected(found);

    const modal = new window.bootstrap.Modal(
      document.getElementById("viewModal")
    );
    modal.show();
  };

  useEffect(() => {
    if (fetchStatus === "idle") dispatch(fetchAllPrescriptions());
  }, [dispatch, fetchStatus]);

  const filteredRows = prescriptions.filter((r) => {
    const patient = r.patientName || r.patient || r.patientFullName || "";
    const doctor = r.doctorName || r.doctor || r.doctorFullName || "";
    const searchMatch =
      patient.toLowerCase().includes(search.toLowerCase()) ||
      doctor.toLowerCase().includes(search.toLowerCase());

    return searchMatch;
  });

  return (
    <>
      <div className="full-width-card card shadow border-0 rounded-3">
        <div
          className=" text-white text-center py-3 rounded-top fw-semibold"
          style={{ backgroundColor: "#01C0C8" }}
        >
          <i className="bi bi-file-medical-fill me-2"></i>
          Patient Prescription List
        </div>

        <div className="card-body">
          {/* Search + Filter */}
          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Search</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search patient or doctor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            {fetchStatus === "loading" && (
              <div className="text-center my-3">Loading prescriptions...</div>
            )}
            {fetchStatus === "failed" && (
              <div className="text-center text-danger my-3">{fetchError}</div>
            )}
            <table className="table table-bordered align-middle text-center">
              <thead className="table-info">
                <tr>
                  <th>#</th>
                  <th>Patient Name</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, idx) => (
                  <tr key={row.id || row.prescriptionId || idx}>
                    <td>{idx + 1}</td>
                    <td>{row.patientName || row.patient}</td>
                    <td>{row.doctorName || row.doctor}</td>
                    <td>{row.departmentName || row.department}</td>
                    <td>{row.prescriptionDate || row.date}</td>

                    <td>
                      <button
                        onClick={() =>
                          openViewModal(row.id || row.prescriptionId)
                        }
                        className="btn btn-sm btn-info text-white me-1"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="btn btn-sm btn-warning text-white me-1">
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button className="btn btn-sm btn-danger">
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* VIEW MODAL */}
      <div className="modal fade" id="viewModal" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-info text-white">
              <h5 className="modal-title">
                <i className="bi bi-file-earmark-medical"></i> Prescription
              </h5>
              <button
                type="button"
                className="btn-close bg-white"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              {selected && (
                <div id="printArea" className="p-3">
                  <div className="text-center mb-4">
                    <h4 className="fw-bold text-primary">
                      HARISHCHANDRA MULTISPECIALIST HOSPITAL
                    </h4>
                    <p className="mb-0">Shivaji Nagar, Pune – 411005</p>
                    <p className="mb-0">Phone: +91 9876543210</p>
                    <hr />
                    <h5 className="fw-bold text-info">PRESCRIPTION</h5>
                  </div>

                  <p>
                    <strong>Patient Name:</strong> {selected.patientName}
                  </p>
                  <p>
                    <strong>Doctor:</strong> {selected.doctorName}
                  </p>
                  <p>
                    <strong>Department:</strong> {selected.departmentName}
                  </p>
                  <p>
                    <strong>Date:</strong> {selected.prescriptionDate}
                  </p>

                  <hr />

                  <p>
                    <strong>Diagnosis:</strong>
                  </p>
                  <p>{selected.diagnosis}</p>

                  <p className="mt-3">
                    <strong>Symptoms:</strong>
                  </p>
                  <p>{selected.symptoms}</p>

                  <hr />

                  <p>
                    <strong>Medicines:</strong>
                  </p>
                  <div style={{ marginLeft: "20px" }}>
                    {selected.medicines.map((m, i) => (
                      <p key={i} className="mb-1">
                        <strong>{i + 1})</strong> {m.medicineName} —{" "}
                        <em>{m.frequency}</em>, <em>{m.duration}</em>
                      </p>
                    ))}
                  </div>

                  <hr />

                  <p>
                    <strong>Additional Notes:</strong>
                  </p>
                  <p>{selected.additionalNotes}</p>

                  <br />
                  <br />

                  <div className="text-end mt-4">
                    <p className="fw-bold mb-0">{selected.doctorName}</p>
                    <small>Signature</small>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => window.print()}
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
