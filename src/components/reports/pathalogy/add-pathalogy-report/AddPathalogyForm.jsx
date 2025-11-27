import React, { useState, useEffect, useRef } from "react";

export default function AddPathalogyForm() {
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
    patientId: "",
    doctor: "",
    email: "",
    sampleType: "Blood",
    collectedOn: "",
    collectedTime: "",
    receivedBy: "",
  });

  const [valid, setValid] = useState({});
  const printRef = useRef();

  // ────────────────────────────────────────────────────────────────
  const totalTests = tests.length;
  const totalAmount = tests.reduce(
    (sum, t) => sum + (parseFloat(t.cost) || 0),
    0
  );

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleDoctorBlur = () => {
    let v = form.doctor.trim();
    v = v.replace(/^Dr\.?\s*/i, "").trim();
    if (v) setForm((prev) => ({ ...prev, doctor: "Dr. " + v }));
  };

  const handleAddTest = () => {
    setTests([
      ...tests,
      { name: "", result: "", units: "", range: "", cost: 0 },
    ]);
  };

  const handleClearTests = () => {
    setTests([{ name: "", result: "", units: "", range: "", cost: 0 }]);
  };

  const handleTestChange = (index, key, value) => {
    const newTests = [...tests];
    newTests[index][key] = value;

    if (key === "name") {
      const t = TEST_CATALOG[value.trim()];
      if (t) {
        newTests[index].units = t.units;
        newTests[index].range = t.range;
        newTests[index].cost = t.cost;
      } else {
        newTests[index].units = "";
        newTests[index].range = "";
        newTests[index].cost = 0;
      }
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
      patientId: /^[A-Za-z0-9-]{3,30}$/,
    };
    Object.entries(required).forEach(([k, regex]) => {
      if (!regex.test(form[k]?.trim() || "")) {
        newValid[k] = false;
        ok = false;
      } else {
        newValid[k] = true;
      }
    });
    setValid(newValid);
    return ok;
  };

  const handleSave = () => {
    if (validateAll()) alert("Form saved successfully!");
  };

  const handlePrint = () => {
    if (validateAll()) window.print();
  };

  // ────────────────────────────────────────────────────────────────
  return (
    <div className="container-xl" ref={printRef}>
      {/* Inline Styles */}
      <style>{`
        :root {
          --accent: #01C0C8;
          --accent-2: #029ea6;
          --bg: linear-gradient(180deg,#f7fcfc 0%, #eef7f8 100%);
          --card:#ffffff;
          --radius:14px;
        }
        body { background:var(--bg); font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial; }
        .header-bar { background:linear-gradient(90deg, var(--accent), var(--accent-2)); color:#fff; padding:20px 32px; border-radius:var(--radius); margin-bottom:24px; box-shadow:0 8px 24px rgba(1,192,200,0.2);}
        .card-panel { background:var(--card); border-radius:var(--radius); box-shadow:0 12px 30px rgba(2,10,12,0.06); border:1px solid rgba(1,192,200,0.06); padding:22px; margin-bottom:22px;}
        .section-title { font-weight:700; color:var(--accent); margin-bottom:14px; font-size:20px;}
        .btn-accent { background:var(--accent); border-color:var(--accent); color:#fff; }
        .btn-outline-accent { color:var(--accent); border-color:var(--accent);}
        .is-invalid { border-color:#dc3545 !important; }
        .is-valid { border-color:#198754 !important; }
        @media print {.no-print{display:none!important;}.card-panel{box-shadow:none;border-radius:0;}}
      `}</style>

      {/* Header */}
      <div className="header-bar">
        <h1> Pathology & Diagnostics</h1>
      </div>

      {/* Patient Info */}
      <div className="card-panel">
        <div className="section-title">Patient Information</div>
        <form id="mainForm" noValidate>
          <div className="row g-3">
            <div className="col-md-4">
              <label>Patient Name</label>
              <input
                id="patientName"
                type="text"
                className={`form-control ${
                  valid.patientName === false ? "is-invalid" : ""
                }`}
                value={form.patientName}
                onChange={(e) => {
                  // Regex: allow only letters and spaces
                  const regex = /^[A-Za-z\s]*$/;
                  if (regex.test(e.target.value)) {
                    handleFormChange(e); // Update form state only if valid
                  }
                }}
                placeholder="e.g. Rahul Sharma"
                required
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
                min="0"
                max="120"
                placeholder="34"
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
                maxLength="10"
                placeholder="10-digit number"
              />
            </div>
            <div className="col-md-3">
              <label>Patient ID (MRN)</label>
              <input
                id="patientId"
                type="text"
                className={`form-control ${
                  valid.patientId === false ? "is-invalid" : ""
                }`}
                value={form.patientId}
                onChange={handleFormChange}
                placeholder="MRN-2025-0042"
              />
            </div>
            <div className="col-md-5">
              <label>Referring Doctor</label>
              <input
                id="patientName"
                type="text"
                className={`form-control ${
                  valid.patientName === false ? "is-invalid" : ""
                }`}
                value={form.patientName}
                onChange={(e) => {
                  // Regex: allow only letters and spaces
                  const regex = /^[A-Za-z\s]*$/;
                  if (regex.test(e.target.value)) {
                    handleFormChange(e); // Update form state only if valid
                  }
                }}
                placeholder="e.g. S Mehata"
                required
              />
            </div>
            <div className="col-md-4">
              <label>Email (optional)</label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={form.email}
                onChange={handleFormChange}
                placeholder="patient@example.com"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Sample & Billing */}
      <div className="row align-items-stretch section-gap">
        <div className="col-md-6 d-flex">
          <div className="card-panel flex-fill">
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
                  type="text"
                  className="form-control"
                  value={form.receivedBy}
                  onChange={handleFormChange}
                  placeholder="Technician name"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Billing */}
        <div className="col-md-6 d-flex">
          <div className="card-panel flex-fill">
            <div className="section-title">Billing Summary</div>
            <div className="row g-3 align-items-center h-100">
              <div className="col-md-12">
                <label>Total Summary</label>
                <div
                  className="d-flex justify-content-between align-items-center p-3 border rounded"
                  style={{ fontSize: "18px" }}
                >
                  <div>
                    <div>Tests Count</div>
                    <div style={{ fontWeight: 700, fontSize: 20 }}>
                      {totalTests}
                    </div>
                  </div>
                  <div>
                    <div>Total (₹)</div>
                    <div style={{ fontWeight: 700, fontSize: 20 }}>
                      {totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="card-panel">
        <div className="section-title">Test Results</div>
        <div className="table-responsive">
          <table className="tests-table table">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Result</th>
                <th>Units</th>
                <th>Reference Range</th>
                <th className="no-print">Cost (₹)</th>
                <th className="no-print">Action</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t, i) => (
                <tr key={i}>
                  <td>
                    <input
                      list="testList"
                      className="form-control"
                      value={t.name}
                      onChange={(e) =>
                        handleTestChange(i, "name", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="form-control"
                      value={t.result}
                      onChange={(e) =>
                        handleTestChange(i, "result", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input className="form-control" value={t.units} readOnly />
                  </td>
                  <td>
                    <input className="form-control" value={t.range} readOnly />
                  </td>
                  <td className="no-print">
                    <input
                      className="form-control"
                      type="number"
                      value={t.cost}
                      onChange={(e) =>
                        handleTestChange(i, "cost", e.target.value)
                      }
                    />
                  </td>
                  <td className="no-print">
                    <button
                      className="btn btn-sm btn-outline-danger"
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
        <div className="mt-3 d-flex gap-2 no-print">
          <button
            onClick={handleAddTest}
            className="btn btn-outline-accent btn-sm"
          >
            + Add Test
          </button>
          <button
            onClick={handleClearTests}
            className="btn btn-outline-secondary btn-sm"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Remarks */}
      <div className="card-panel text-center">
        <div className="section-title">Remarks / Interpretation</div>
        <textarea
          rows="4"
          className="form-control mb-4"
          placeholder="Lab comments or interpretation"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </div>

      {/* Bottom Buttons */}
      <div className="bottom-controls no-print">
        <button className="btn btn-accent me-2" onClick={handleSave}>
          💾 Save
        </button>
        <button id="printBtn" className="btn" onClick={handlePrint}>
          🖨 Print
        </button>
      </div>

      <div className="text-center text-muted mt-3 small">
        Generated by HMS — Pathology Module
      </div>

      <datalist id="testList">
        {Object.keys(TEST_CATALOG).map((key) => (
          <option key={key} value={key} />
        ))}
      </datalist>
    </div>
  );
}
