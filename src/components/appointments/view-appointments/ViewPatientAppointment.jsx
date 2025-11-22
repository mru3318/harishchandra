import { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAppointments,
  selectAppointments,
  selectAppointmentsStatus,
  selectAppointmentsError,
} from "../../../features/appointmentSlice";
import { updateAppointmentStatus } from "../../../features/appointmentSlice";
import Swal from "sweetalert2";
import { NavLink } from "react-router-dom";

export default function ViewPatientAppointment() {
  const dispatch = useDispatch();
  const rawAppointments = useSelector(selectAppointments);
  const appointmentsStatus = useSelector(selectAppointmentsStatus);
  const appointmentsError = useSelector(selectAppointmentsError);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  // index not needed (view-only)
  const [modalData, setModalData] = useState({
    patient: "",
    age: "",
    phone: "",
    doctor: "",
    date: "",
    time: "",
    status: "SCHEDULED",
    id: null,
  });

  const modalRef = useRef(null);

  const openModal = () => {
    try {
      if (modalRef.current) {
        const m = new window.bootstrap.Modal(modalRef.current);
        m.show();
      }
    } catch {
      // ignore if bootstrap modal unavailable
    }
  };

  const formatError = (err) => {
    if (!err) return "Unknown error";
    try {
      return err?.response?.data?.message || err?.message || String(err);
    } catch {
      return String(err);
    }
  };

  // Fetch appointments on mount or when idle
  useEffect(() => {
    if (appointmentsStatus === "idle") {
      dispatch(fetchAppointments());
    }
  }, [appointmentsStatus, dispatch]);

  // Derive normalized display data from raw appointments
  const appointments = useMemo(
    () =>
      (rawAppointments || []).map((a) => {
        const patientName =
          a.patient?.name ||
          a.patientName ||
          (a.patient_first_name || a.patientLastName
            ? `${a.patient_first_name || ""} ${
                a.patient_last_name || ""
              }`.trim()
            : a.patient) ||
          "";
        const rawStatus = a.status || a.appointmentStatus || "SCHEDULED";
        const upperStatus = String(rawStatus).toUpperCase();
        const allowedStatuses = ["SCHEDULED", "COMPLETED", "CANCELLED"];
        const normalizedStatus = allowedStatuses.includes(upperStatus)
          ? upperStatus
          : "SCHEDULED";
        const idValue =
          a.id ||
          a.appointmentId ||
          a.appointment_id ||
          a.appointment?.id ||
          "";
        const patientHospitalIdValue =
          a.patientHospitalId ||
          a.patient_hospital_id ||
          a.patient?.patientHospitalId ||
          a.patient?.patient_hospital_id ||
          // fallbacks to older ID fields if hospital-specific ID absent
          a.patientId ||
          a.patient_id ||
          a.patient?.id ||
          a.patient?.patientId ||
          a.patient?.patient_id ||
          "";
        return {
          id: idValue,
          patientHospitalId: patientHospitalIdValue || "—",
          patient: patientName || "—",
          age: a.patient?.age || a.age || a.patientAge || "—",
          phone:
            a.patientContact ||
            a.patient?.patientContact ||
            a.patient?.contactInfo ||
            a.phone ||
            a.patientPhone ||
            "—",
          doctor:
            a.doctor?.name ||
            a.doctorName ||
            a.doctor?.fullName ||
            a.doctor ||
            "—",
          date: a.appointmentDate || a.date || "—",
          time: a.appointmentTime || a.time || "—",
          status: normalizedStatus,
        };
      }),
    [rawAppointments]
  );

  // VIEW ROW (read-only)
  const viewRow = (index) => {
    setModalData(appointments[index]);
    openModal();
  };

  // STATUS COLOR MAP
  const statusColor = (status) => {
    return (
      {
        SCHEDULED: "info",
        COMPLETED: "success",
        CANCELLED: "danger",
      }[status] || "secondary"
    );
  };

  // FILTER APPOINTMENTS
  const filteredAppointments = appointments.filter((a) => {
    const needle = String(search || "")
      .trim()
      .toLowerCase();
    const matchSearch =
      needle === "" ||
      a.patient.toLowerCase().includes(needle) ||
      String(a.patientHospitalId || "")
        .toLowerCase()
        .includes(needle) ||
      String(a.phone || "")
        .toLowerCase()
        .includes(needle) ||
      a.doctor.toLowerCase().includes(needle);

    const matchStatus =
      statusFilter === "" ||
      a.status.toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchStatus;
  });

  return (
    <>
      {/* Header */}
      <div className="full-width-card rounded card shadow border-0">
        <div
          className="text-center text-white fw-bold py-3 rounded-top"
          style={{ backgroundColor: "#01c0c8" }}
        >
          <i className="bi bi-card-list me-2"></i> Patient Appointment List
        </div>

        {/* Search and Filter */}
        <div className="row px-4 mt-4 mb-2">
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search patient, phone, doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-3 mb-2">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Filter by Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive px-4 pb-4">
          <table className="table table-bordered table-hover">
            <thead className="bg-info text-white">
              <tr>
                <th>Patient Hospital ID</th>
                <th>Patient</th>
                <th>Age</th>
                <th>Phone</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAppointments.map((a, index) => (
                <tr key={index}>
                  <td>{a.patientHospitalId}</td>
                  <td>{a.patient}</td>
                  <td>{a.age}</td>
                  <td>{a.phone}</td>
                  <td>{a.doctor}</td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td>
                    <span className={`badge bg-${statusColor(a.status)}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => viewRow(index)}
                      title="View details"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <NavLink
                      to={`/dashboard/edit-patient-appointment/${a.id}`}
                      state={{
                        fromList: true,
                        appointment:
                          rawAppointments.find(
                            (r) =>
                              (r.id ||
                                r.appointmentId ||
                                r.appointment_id ||
                                r.appointment?.id) == a.id
                          ) || a,
                      }}
                      className="btn btn-secondary btn-sm ms-2"
                      title="View full appointment page"
                    >
                      <i className="bi bi-box-arrow-up-right"></i>
                    </NavLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {appointmentsStatus === "loading" && (
            <div className="text-center py-2 small">
              Loading appointments...
            </div>
          )}
          {appointmentsStatus === "failed" && (
            <div className="text-center text-danger py-2 small">
              Failed to load appointments: {String(appointmentsError)}
            </div>
          )}
          {appointmentsStatus === "succeeded" &&
            filteredAppointments.length === 0 && (
              <div className="text-center py-2 small">
                No appointments match filters.
              </div>
            )}
        </div>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="viewEditModal"
        tabIndex="-1"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-info text-white">
              <h5 className="modal-title">Appointment Details</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              {/* Form Inputs */}
              <div className="row mb-2">
                <div className="col-6">
                  <label className="fw-bold">Patient:</label>
                  <input
                    className="form-control"
                    value={modalData.patient}
                    onChange={(e) =>
                      setModalData({ ...modalData, patient: e.target.value })
                    }
                  />
                </div>

                <div className="col-3">
                  <label className="fw-bold">Age:</label>
                  <input
                    className="form-control"
                    value={modalData.age}
                    onChange={(e) =>
                      setModalData({ ...modalData, age: e.target.value })
                    }
                  />
                </div>

                <div className="col-3">
                  <label className="fw-bold">Phone:</label>
                  <input
                    className="form-control"
                    value={modalData.phone}
                    onChange={(e) =>
                      setModalData({ ...modalData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-6">
                  <label className="fw-bold">Doctor:</label>
                  <input
                    className="form-control"
                    value={modalData.doctor}
                    onChange={(e) =>
                      setModalData({ ...modalData, doctor: e.target.value })
                    }
                  />
                </div>

                <div className="col-3">
                  <label className="fw-bold">Date:</label>
                  <input
                    className="form-control"
                    value={modalData.date}
                    onChange={(e) =>
                      setModalData({ ...modalData, date: e.target.value })
                    }
                  />
                </div>

                <div className="col-3">
                  <label className="fw-bold">Time:</label>
                  <input
                    className="form-control"
                    value={modalData.time}
                    onChange={(e) =>
                      setModalData({ ...modalData, time: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="mb-2">
                <label className="fw-bold">Status:</label>
                <select
                  className="form-select"
                  value={modalData.status}
                  disabled={updatingStatus}
                  onChange={async (e) => {
                    const newStatus = e.target.value;
                    const prevStatus = modalData.status;
                    setModalData({ ...modalData, status: newStatus });
                    if (!modalData.id) {
                      // no id to update; revert and warn
                      setModalData({ ...modalData, status: prevStatus });
                      window.alert(
                        "Appointment ID missing; cannot update status."
                      );
                      return;
                    }
                    try {
                      setUpdatingStatus(true);
                      const res = await dispatch(
                        updateAppointmentStatus({
                          id: modalData.id,
                          status: newStatus,
                        })
                      ).unwrap();

                      const backendMsg =
                        res?.message ||
                        (res?.data && res.data.message) ||
                        (newStatus === "COMPLETED"
                          ? "Appointment marked as Completed."
                          : "Status updated.");

                      Swal.fire({
                        title: backendMsg,
                        icon: "success",
                        timer: 1600,
                        showConfirmButton: false,
                      });
                      // Optionally refresh list to ensure consistency
                      // dispatch(fetchAppointments());
                    } catch (err) {
                      setModalData({ ...modalData, status: prevStatus });
                      Swal.fire({
                        title: "Update Failed",
                        text: formatError(err),
                        icon: "error",
                      });
                    } finally {
                      setUpdatingStatus(false);
                    }
                  }}
                >
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
