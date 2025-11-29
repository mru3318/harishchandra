import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  createPathology,
  resetCreateState,
  selectCreatePathologyStatus,
  selectCreatePathologyError,
} from "../../../../features/pathologySlice";
import {
  fetchPatients,
  selectPatients,
  selectPatientsStatus,
} from "../../../../features/commanSlice";

export default function AddPathalogyForm() {
  const THEME = "#01C0C8";

  const TEST_CATALOG = {
    Hemoglobin: {
      units: "g/dL",
      range: "M:13.5-17.5 / F:12.0-15.5",
      cost: 120,
    },
    "Blood Sugar (Fasting)": { units: "mg/dL", range: "70-100", cost: 80 },
    "Blood Sugar (PP)": { units: "mg/dL", range: "<140", cost: 90 },
    "Total WBC": { units: "x10^9/L", range: "4.0-11.0", cost: 100 },
    "Platelet Count": { units: "x10^9/L", range: "150-400", cost: 150 },
    TSH: { units: "µIU/mL", range: "0.4-4.0", cost: 200 },
    HBA1C: { units: "%", range: "4.0-5.6", cost: 220 },
  };

  const [tests, setTests] = useState([
    { name: "", result: "", units: "", range: "", cost: 0 },
  ]);
  const [remarks, setRemarks] = useState("");
  const [form, setForm] = useState({
    patientName: "",
    age: "",
    gender: "",
    contact: "",
    patientHospitalId: "",
    doctor: "",
    doctorId: "",
    labTechnicianId: "",
    email: "",
    sampleType: "Blood",
    collectedOn: "",
    collectedTime: "",
    receivedBy: "",
  });
  const dispatch = useDispatch();
  const patients = useSelector(selectPatients) || [];
  const patientsStatus = useSelector(selectPatientsStatus);

  const [patientQuery, setPatientQuery] = useState("");
  const [patientSuggestions, setPatientSuggestions] = useState([]);
  const [showPatientSuggestions, setShowPatientSuggestions] = useState(false);
  const [valid, setValid] = useState({});
  const [isVisible, setIsVisible] = useState(true);
  const printRef = useRef();

  const totalTests = tests.length;
  const totalAmount = tests.reduce(
    (sum, t) => sum + (parseFloat(t.cost) || 0),
    0
  );

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    if (id === "patientName" && /[^a-zA-Z\s.]/.test(value)) return;
    if (id === "age" && /[^0-9]/.test(value)) return;
    if (id === "contact" && (/[^0-9]/.test(value) || value.length > 10)) return;
    if (id === "patientHospitalId" && /[^a-zA-Z0-9-]/.test(value)) return;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (id === "patientName" || id === "patientHospitalId") {
      const q = value.trim().toLowerCase();
      setPatientQuery(q);
      setShowPatientSuggestions(!!q);
    }
  };

  // Load patients for suggestions
  React.useEffect(() => {
    if (patientsStatus === "idle") dispatch(fetchPatients());
  }, [dispatch, patientsStatus]);

  // Update suggestions when patientQuery or patients change
  React.useEffect(() => {
    if (!patientQuery) return setPatientSuggestions([]);
    const q = patientQuery.toLowerCase();
    const matches = (patients || [])
      .map((p) => ({
        raw: p,
        id:
          p.patient_hospital_id || p.hospitalId || p.hospitalID || p.code || "",
        name: p.name || `${p.firstName || ""} ${p.lastName || ""}`.trim(),
      }))
      .filter(
        (p) =>
          (p.id || "").toLowerCase().includes(q) ||
          (p.name || "").toLowerCase().includes(q)
      )
      .slice(0, 10);
    setPatientSuggestions(matches);
  }, [patientQuery, patients]);

  const handleSelectPatient = (p) => {
    const raw = p.raw || p;
    const hospId =
      raw.patient_hospital_id ||
      raw.hospitalId ||
      raw.hospitalID ||
      raw.code ||
      "";
    const name =
      raw.name || `${raw.firstName || ""} ${raw.lastName || ""}`.trim();
    // determine age: prefer explicit age, fallback to ageYears, then derive from dob if present
    let ageVal = raw.age || raw.ageYears;
    if (!ageVal && raw.dob) {
      const bd = new Date(raw.dob);
      if (!isNaN(bd.getTime())) {
        const diff = Date.now() - bd.getTime();
        ageVal = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
      }
    }

    // normalize gender to match select options (Male/Female/Other)
    let genderVal = (raw.gender && String(raw.gender)) || "";
    if (genderVal) {
      const g = genderVal.toLowerCase();
      if (g.startsWith("m")) genderVal = "Male";
      else if (g.startsWith("f")) genderVal = "Female";
      else genderVal = "Other";
    }

    // contact may be present in different fields (contactInfo, contactNumber, mobile, phone)
    const contactVal =
      raw.contactInfo ||
      raw.contactNumber ||
      raw.mobile ||
      raw.phone ||
      raw.contact ||
      "";

    setForm((prev) => ({
      ...prev,
      patientHospitalId: hospId || String(raw.id || ""),
      patientName: name,
      age: ageVal || prev.age,
      gender: genderVal || prev.gender,
      contact: contactVal || prev.contact,
      email: raw.email || prev.email,
    }));
    setShowPatientSuggestions(false);
    setPatientSuggestions([]);
    setPatientQuery("");
  };

  const handleAddTest = () =>
    setTests([
      ...tests,
      { name: "", result: "", units: "", range: "", cost: 0 },
    ]);
  const handleClearTests = () =>
    setTests([{ name: "", result: "", units: "", range: "", cost: 0 }]);

  const handleTestChange = (index, key, value) => {
    const newTests = [...tests];
    if (key === "cost" && /[^0-9.]/.test(value)) return;
    newTests[index][key] = value;
    if (key === "name") {
      const t = TEST_CATALOG[value.trim()];
      newTests[index].units = t ? t.units : "";
      newTests[index].range = t ? t.range : "";
      newTests[index].cost = t ? t.cost : 0;
    }
    setTests(newTests);
  };

  const removeTestRow = (index) => {
    const newTests = tests.filter((_, i) => i !== index);
    setTests(
      newTests.length
        ? newTests
        : [{ name: "", result: "", units: "", range: "", cost: 0 }]
    );
  };

  const validateAll = () => {
    const newValid = {};
    let ok = true;
    const required = {
      patientName: /^[A-Za-z\s.]{3,60}$/,
      age: /^[0-9]{1,3}$/,
      gender: /.+/,
      contact: /^[0-9]{10}$/,
      patientHospitalId: /^[A-Za-z0-9-]{3,30}$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    };
    Object.entries(required).forEach(([k, regex]) => {
      if (!regex.test(form[k]?.trim() || "")) {
        newValid[k] = false;
        ok = false;
      } else newValid[k] = true;
    });
    setValid(newValid);
    return ok;
  };

  const handleSave = () => {
    if (!validateAll()) return;

    const payload = {
      patientId: isNaN(Number(form.patientHospitalId))
        ? form.patientHospitalId
        : Number(form.patientHospitalId),
      doctorId:
        form.doctorId && !isNaN(Number(form.doctorId))
          ? Number(form.doctorId)
          : form.doctorId || null,
      labTechnicianId:
        form.labTechnicianId && !isNaN(Number(form.labTechnicianId))
          ? Number(form.labTechnicianId)
          : form.labTechnicianId || null,
      sampleType: form.sampleType,
      collectedOn: form.collectedOn,
      collectionTime: (() => {
        // convert `HH:MM` to `hh:mm AM/PM` if needed
        const t = form.collectedTime || "";
        if (!t) return "";
        const [hh, mm] = t.split(":");
        let hour = Number(hh);
        const suffix = hour >= 12 ? "PM" : "AM";
        if (hour === 0) hour = 12;
        if (hour > 12) hour = hour - 12;
        return `${String(hour).padStart(2, "0")}:${mm} ${suffix}`;
      })(),
      remarks: remarks || "",
      totalCost: Number(totalAmount) || 0,
      testResults: tests.map((t) => ({
        testName: t.name || "",
        resultValue: t.result || "",
        units: t.units || "",
        referenceRange: t.range || "",
        cost: Number(t.cost) || 0,
      })),
    };

    dispatch(createPathology(payload))
      .unwrap()
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Saved",
          text: "Pathology created successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        // reset form
        setForm({
          patientName: "",
          age: "",
          gender: "",
          contact: "",
          patientHospitalId: "",
          doctor: "",
          doctorId: "",
          labTechnicianId: "",
          email: "",
          sampleType: "Blood",
          collectedOn: "",
          collectedTime: "",
          receivedBy: "",
        });
        setTests([{ name: "", result: "", units: "", range: "", cost: 0 }]);
        setRemarks("");
        dispatch(resetCreateState());
      })
      .catch((err) => {
        const text =
          (err && (err.message || JSON.stringify(err))) ||
          "Failed to create pathology";
        Swal.fire({ icon: "error", title: "Error", text });
      });
  };
  const handlePrint = () => {
    if (validateAll()) window.print();
  };

  return (
    isVisible && (
      <div className="container p-0 m-0" ref={printRef}>
        <style>{`
        body { font-family: Inter, sans-serif; background:#f2fbfc; }
        .card-main { background:white; border-radius:12px 12px 0 0; margin:0 auto; padding:0; box-shadow:0 4px 12px rgba(0,0,0,0.05); overflow:hidden; }
        .card-header { background:${THEME}; color:white; text-align:center; padding:12px 0; font-size:22px; font-weight:600; border-radius:12px 12px 0 0; }
        .card-body { padding:20px; }
        .section-title { background:${THEME}; color:white; font-weight:600; margin-bottom:10px; font-size:18px; padding:6px 10px; border-radius:4px; }
        .btn-theme { background:${THEME}; color:white; border:none; }
        .btn-outline-theme { border:1px solid ${THEME}; color:${THEME}; background:white; }
        .table thead { background:#f6ffff; }
        .no-print { display:inline; }
        .table td, .table th { vertical-align: middle !important; }
        .form-control-sm { padding:3px 6px; font-size:0.875rem; }
        @media print { .no-print { display:none !important; } .card-main { box-shadow:none; border-radius:0; } }
      `}</style>

        <div className="card-main">
          <div className="card-header">
            <i className="fas fa-vials me-2"></i> Pathology & Diagnostics
          </div>

          <div className="card-body">
            {/* Patient Info */}
            <div className="mb-3">
              <div className="section-title">Patient Information</div>
              <div className="row g-3">
                <div className="col-md-4">
                  <label>Patient Name</label>
                  <input
                    id="patientName"
                    className={`form-control ${
                      valid.patientName === false ? "is-invalid" : ""
                    }`}
                    value={form.patientName}
                    onChange={handleFormChange}
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
                <div className="col-md-2">
                  <label>Age</label>
                  <input
                    id="age"
                    type="number"
                    className={`form-control ${
                      valid.age === false ? "is-invalid" : ""
                    }`}
                    value={form.age}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="col-md-2">
                  <label>Gender</label>
                  <select
                    id="gender"
                    className={`form-select ${
                      valid.gender === false ? "is-invalid" : ""
                    }`}
                    value={form.gender}
                    onChange={handleFormChange}
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label>Contact Number</label>
                  <input
                    id="contact"
                    type="number"
                    className={`form-control ${
                      valid.contact === false ? "is-invalid" : ""
                    }`}
                    value={form.contact}
                    onChange={handleFormChange}
                    placeholder="10-digit number"
                  />
                </div>
                <div className="col-md-3">
                  <label>Patient Hospital ID</label>
                  <input
                    id="patientHospitalId"
                    className={`form-control ${
                      valid.patientHospitalId === false ? "is-invalid" : ""
                    }`}
                    value={form.patientHospitalId}
                    onChange={handleFormChange}
                  />
                  {showPatientSuggestions && patientSuggestions.length > 0 && (
                    <div
                      className="list-group position-absolute"
                      style={{ zIndex: 999 }}
                    >
                      {patientSuggestions.map((ps, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="list-group-item list-group-item-action"
                          onClick={() => handleSelectPatient(ps)}
                        >
                          <strong>{ps.id}</strong> — {ps.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="col-md-4">
                  <label>Referring Doctor</label>
                  <input
                    id="doctor"
                    className="form-control"
                    value={form.doctor}
                    onChange={handleFormChange}
                    placeholder="Dr. Mehta"
                  />
                </div>

                <div className="col-md-3">
                  <label>Email</label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
            </div>

            {/* Sample & Billing */}
            <div className="mb-3 row">
              <div className="col-md-6">
                <div className="mb-3">
                  <div className="section-title">Sample Details</div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label>Sample Type</label>
                      <select
                        id="sampleType"
                        className="form-select"
                        value={form.sampleType}
                        onChange={handleFormChange}
                      >
                        <option>Blood</option>
                        <option>Urine</option>
                        <option>Stool</option>
                        <option>Swab</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label>Collected On</label>
                      <input
                        id="collectedOn"
                        type="date"
                        className="form-control"
                        value={form.collectedOn}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Collection Time</label>
                      <input
                        id="collectedTime"
                        type="time"
                        className="form-control"
                        value={form.collectedTime}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Received By</label>
                      <input
                        id="receivedBy"
                        className="form-control"
                        value={form.receivedBy}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Lab Technician ID</label>
                      <input
                        id="labTechnicianId"
                        className="form-control"
                        value={form.labTechnicianId || ""}
                        onChange={handleFormChange}
                        placeholder="Technician ID"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <div className="section-title">Billing Summary</div>
                  <div className="border p-3 rounded d-flex justify-content-between">
                    <div>
                      <strong>Tests Count:</strong> {totalTests}
                    </div>
                    <div>
                      <strong>Total (₹):</strong> {totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Results */}
            <div className="mb-3">
              <div className="section-title">Test Results</div>
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead>
                    <tr>
                      <th>Test Name</th>
                      <th>Result</th>
                      <th>Units</th>
                      <th>Range</th>
                      <th>Cost</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tests.map((t, i) => (
                      <tr key={i}>
                        <td>
                          <input
                            list="testList"
                            className="form-control form-control-sm"
                            value={t.name}
                            onChange={(e) =>
                              handleTestChange(i, "name", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="form-control form-control-sm"
                            value={t.result}
                            onChange={(e) =>
                              handleTestChange(i, "result", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="form-control form-control-sm"
                            value={t.units}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control form-control-sm"
                            value={t.range}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control form-control-sm"
                            type="number"
                            value={t.cost}
                            onChange={(e) =>
                              handleTestChange(i, "cost", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            style={{ padding: "0 6px" }}
                            onClick={() => removeTestRow(i)}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-start gap-2 no-print mt-3">
                <button
                  className="btn btn-outline-theme"
                  onClick={handleAddTest}
                >
                  + Add Test
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleClearTests}
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Remarks */}
            <div className="mb-3">
              <div className="section-title">Remarks</div>
              <textarea
                rows="4"
                className="form-control"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              ></textarea>
            </div>

            <div className="d-flex justify-content-center gap-2 mb-3 no-print">
              <button className="btn btn-theme" onClick={handleSave}>
                Save
              </button>
              <button
                className="btn btn-dark"
                onClick={() => setIsVisible(false)}
              >
                Close
              </button>
            </div>

            <datalist id="testList">
              {Object.keys(TEST_CATALOG).map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>
        </div>
      </div>
    )
  );
}
