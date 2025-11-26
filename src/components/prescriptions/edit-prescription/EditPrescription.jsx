import "./EditPrescription.css";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import {
  fetchAllPrescriptions,
  updatePrescription,
  selectPrescriptions,
} from "../../../features/priscriptionSlice";
import { fetchMedicines, selectMedicines } from "../../../features/commanSlice";

export default function EditPrescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const prescriptions = useSelector(selectPrescriptions) || [];
  const medicines = useSelector(selectMedicines) || {};

  const [departments, setDepartments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [doctors, setDoctors] = useState([]);

  const [patientQuery, setPatientQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");

  const [prescriptionDate, setPrescriptionDate] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [rows, setRows] = useState([
    { medicineId: "", medicineName: "", frequency: "", duration: "" },
  ]);
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const [medicineQuery, setMedicineQuery] = useState("");

  // Fetch all required data on mount
  useEffect(() => {
    let mounted = true;
    dispatch(fetchMedicines());
    dispatch(fetchAllPrescriptions());

    // Fetch departments
    const loadDepartments = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/doctor-schedule/departments`
        );
        const data = res.data?.data ?? res.data;
        if (mounted) setDepartments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load departments:", err);
      }
    };

    // Fetch patients
    const loadPatients = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/patients/names-and-ids`);
        const data = res.data?.data ?? res.data;
        if (mounted) setPatients(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load patients:", err);
      }
    };

    loadDepartments();
    loadPatients();
    return () => (mounted = false);
  }, [dispatch]);

  // Load prescription data when available
  useEffect(() => {
    if (id && prescriptions.length > 0 && patients.length > 0) {
      const prescription = prescriptions.find(
        (p) => p.id === Number(id) || p.prescriptionId === Number(id)
      );

      if (prescription) {
        setSelectedDept(String(prescription.departmentId || ""));
        setSelectedDoctorId(String(prescription.doctorId || ""));
        setSelectedPatientId(String(prescription.patientId || ""));
        setPatientQuery(prescription.patientName || "");

        // Find patient from patients array to get current age/gender
        const patient = patients.find(
          (p) => (p.patientId || p.id) === prescription.patientId
        );
        if (patient) {
          setPatientAge(String(patient.age || ""));
          setPatientGender(patient.gender || "");
        } else {
          // Fallback to prescription data if patient not found
          setPatientAge(String(prescription.patientAge || ""));
          setPatientGender(prescription.patientGender || "");
        }

        setPrescriptionDate(prescription.prescriptionDate || "");
        setSymptoms(prescription.symptoms || "");
        setDiagnosis(prescription.diagnosis || "");
        setAdditionalNotes(prescription.additionalNotes || "");

        // Load medicines
        if (prescription.medicines && prescription.medicines.length > 0) {
          const medicineRows = prescription.medicines.map((m) => ({
            medicineId: String(m.medicineId || ""),
            medicineName: m.medicineName || "",
            frequency: m.frequency || "",
            duration: m.duration || "",
          }));
          setRows(medicineRows);
        }
      }
    }
  }, [id, prescriptions, patients]);

  // Fetch doctors when department changes
  useEffect(() => {
    let mounted = true;
    if (selectedDept) {
      const loadDoctors = async () => {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/doctor-schedule/doctors/${selectedDept}`
          );
          const data = res.data?.data ?? res.data;
          if (mounted) setDoctors(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to load doctors:", err);
          if (mounted) setDoctors([]);
        }
      };
      loadDoctors();
    } else {
      setDoctors([]);
    }
    return () => (mounted = false);
  }, [selectedDept]);

  // Helper functions for autocomplete
  const getFilteredPatients = () => {
    if (!patientQuery) return [];
    const q = patientQuery.toLowerCase();
    return patients
      .filter((p) => {
        const fullName = `${p.firstName || ""} ${
          p.lastName || ""
        }`.toLowerCase();
        return (
          (p.firstName && p.firstName.toLowerCase().includes(q)) ||
          (p.lastName && p.lastName.toLowerCase().includes(q)) ||
          fullName.includes(q)
        );
      })
      .slice(0, 10);
  };

  const getFilteredMedicines = () => {
    if (!medicineQuery) return [];
    return Object.entries(medicines)
      .filter(([, name]) =>
        name.toLowerCase().includes(medicineQuery.toLowerCase())
      )
      .map(([id, name]) => ({ id, name }))
      .slice(0, 10);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const medicinesList = rows
      .filter((m) => m.medicineId && m.frequency && m.duration)
      .map((m) => ({
        medicineId: Number(m.medicineId),
        frequency: m.frequency,
        duration: m.duration,
      }));

    if (medicinesList.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please add at least one medicine with complete details.",
      });
      return;
    }

    const payload = {
      patientId: Number(selectedPatientId),
      doctorId: Number(selectedDoctorId),
      departmentId: Number(selectedDept),
      prescriptionDate,
      symptoms,
      diagnosis,
      medicines: medicinesList,
      additionalNotes,
    };

    try {
      await dispatch(
        updatePrescription({ id: Number(id), prescription: payload })
      ).unwrap();
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Prescription updated successfully",
        timer: 2000,
        showConfirmButton: false,
      });
      setTimeout(() => navigate("/dashboard/manage-prescription"), 2000);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update prescription",
      });
    }
  };

  const handleReset = () => {
    setSelectedDept("");
    setSelectedDoctorId("");
    setDoctors([]);
    setPatientQuery("");
    setSelectedPatientId("");
    setPatientAge("");
    setPatientGender("");
    setPrescriptionDate("");
    setSymptoms("");
    setDiagnosis("");
    setAdditionalNotes("");
    setRows([
      { medicineId: "", medicineName: "", frequency: "", duration: "" },
    ]);
    setActiveRowIndex(null);
    setMedicineQuery("");
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      { medicineId: "", medicineName: "", frequency: "", duration: "" },
    ]);
  };

  const handleRemoveRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  return (
    <div className="prescription-card full-width-card card shadow border-0 rounded-3">
      <div
        className=" text-white text-center py-3 rounded-top fw-semibold"
        style={{ backgroundColor: "#01C0C8" }}
      >
        <i className="bi bi-file-medical-fill me-2"></i>Update Patient
        Prescription
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <input
            type="hidden"
            name="patientId"
            value={selectedPatientId || ""}
          />

          {/* Department & Doctor */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Department <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                required
                name="departmentId"
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setSelectedDoctorId("");
                }}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option
                    key={dept.departmentId || dept.id}
                    value={dept.departmentId || dept.id}
                  >
                    {dept.departmentName || dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Doctor Name <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                required
                name="doctorId"
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                disabled={!selectedDept}
              >
                <option value="">Select Doctor</option>
                {doctors.map((doc) => (
                  <option
                    key={doc.userId || doc.id}
                    value={doc.userId || doc.id}
                  >
                    Dr. {doc.firstName} {doc.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Patient Info */}
          <div className="row mb-3">
            <div className="col-md-6 position-relative">
              <label className="form-label fw-semibold">
                Patient Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter patient name"
                value={patientQuery}
                onChange={(e) => {
                  setPatientQuery(e.target.value);
                  setSelectedPatientId("");
                }}
                required
                autoComplete="off"
              />
              {patientQuery && getFilteredPatients().length > 0 && (
                <ul
                  className="list-group position-absolute w-100"
                  style={{
                    zIndex: 1000,
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  {getFilteredPatients().map((p) => (
                    <li
                      key={p.patientId || p.id}
                      className="list-group-item list-group-item-action"
                      onMouseDown={() => {
                        setPatientQuery(`${p.firstName} ${p.lastName}`);
                        setSelectedPatientId(p.patientId || p.id);
                        setPatientAge(String(p.age || ""));
                        setPatientGender(p.gender || "");
                      }}
                      role="button"
                    >
                      {p.firstName} {p.lastName} - Age: {p.age}, {p.gender}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Age</label>
              <input
                name="age"
                type="number"
                className="form-control"
                placeholder="Enter age"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Gender</label>
              <select
                name="gender"
                className="form-select"
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value)}
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          {/* Date */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">
                Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                name="prescriptionDate"
                value={prescriptionDate}
                onChange={(e) => setPrescriptionDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Symptoms */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Symptoms <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control"
              name="symptoms"
              rows="2"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Diagnosis */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Diagnosis <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control"
              name="diagnosis"
              rows="2"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Prescription Medicine Rows */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Prescription Details <span className="text-danger">*</span>
            </label>

            <div className="table-responsive">
              <table className="table table-bordered text-center align-middle">
                <thead className="table-info">
                  <tr>
                    <th>Medicine Name</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td className="position-relative">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Medicine Name"
                          value={row.medicineName}
                          onChange={(e) => {
                            handleChange(index, "medicineName", e.target.value);
                            setMedicineQuery(e.target.value);
                            setActiveRowIndex(index);
                          }}
                          onFocus={() => {
                            setMedicineQuery(row.medicineName);
                            setActiveRowIndex(index);
                          }}
                          onBlur={() => {
                            setTimeout(() => {
                              setMedicineQuery("");
                              setActiveRowIndex(null);
                            }, 200);
                          }}
                        />
                        {activeRowIndex === index &&
                          medicineQuery &&
                          getFilteredMedicines().length > 0 && (
                            <ul
                              className="list-group position-absolute"
                              style={{
                                zIndex: 1000,
                                maxHeight: "200px",
                                overflowY: "auto",
                                width: "100%",
                              }}
                            >
                              {getFilteredMedicines().map((med) => (
                                <li
                                  key={med.id}
                                  className="list-group-item list-group-item-action"
                                  onMouseDown={() => {
                                    const updated = [...rows];
                                    updated[index].medicineId = med.id;
                                    updated[index].medicineName = med.name;
                                    setRows(updated);
                                    setMedicineQuery("");
                                    setActiveRowIndex(null);
                                  }}
                                  role="button"
                                >
                                  {med.name}
                                </li>
                              ))}
                            </ul>
                          )}
                      </td>

                      <td>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="2 times/day"
                          value={row.frequency}
                          onChange={(e) =>
                            handleChange(index, "frequency", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="5 days"
                          value={row.duration}
                          onChange={(e) =>
                            handleChange(index, "duration", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveRow(index)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-2">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleAddRow}
              >
                <i className="bi bi-plus me-1"></i> Add Medicine
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Additional Notes</label>
            <textarea
              className="form-control"
              name="additionalNotes"
              rows="2"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-center mt-4">
            <button
              type="submit"
              className="btn btn-primary"
              style={{ backgroundColor: "#01C0C8", color: "white" }}
            >
              <i className="bi bi-save me-1"></i> Save Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
