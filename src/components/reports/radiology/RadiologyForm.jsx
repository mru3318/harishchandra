import React, { useState } from "react";

export default function RadiologyForm() {
  const [tests, setTests] = useState([{ name: "", findings: "", cost: 0 }]);

  const RADIOLOGY_CATALOG = {
    "X-Ray Chest": { cost: 500 },
    "Ultrasound Abdomen": { cost: 1200 },
    "MRI Brain": { cost: 5000 },
    "CT Scan Whole Abdomen": { cost: 6500 },
  };

  const addRow = () => {
    setTests([...tests, { name: "", findings: "", cost: 0 }]);
  };

  const clearRows = () => {
    setTests([{ name: "", findings: "", cost: 0 }]);
  };

  const handleTestChange = (index, field, value) => {
    const updated = [...tests];
    updated[index][field] = value;

    if (field === "name" && RADIOLOGY_CATALOG[value]) {
      updated[index].cost = RADIOLOGY_CATALOG[value].cost;
    }

    setTests(updated);
  };

  const removeRow = (index) => {
    const updated = tests.filter((_, i) => i !== index);
    setTests(updated.length ? updated : [{ name: "", findings: "", cost: 0 }]);
  };

  const totalAmount = tests.reduce(
    (sum, t) => sum + (parseFloat(t.cost) || 0),
    0
  );

  const validAge = (e) => {
    if (e.target.value < 1) e.target.value = "";
  };

  const saveData = () => alert("Radiology Report Saved Successfully!");
  const printPage = () => window.print();

  return (
    <>
      {" "}
      {/* Alignment & Table Fix CSS */}
      <style>{`
        #testsTable thead th {
          background: #01C0C8 !important;
          color: #ffffff !important;
          border-color: #01C0C8 !important;
          text-align: center;
        }
        #testsTable, #testsTable th, #testsTable td {
          border-color: #01C0C8 !important;
        }
        #testsTable td, #testsTable th {
          vertical-align: middle;
        }
        #testsTable td:nth-child(1) { width: 32%; }
        #testsTable td:nth-child(2) { width: 40%; }
        #testsTable td:nth-child(3) { width: 15%; }
        #testsTable td:nth-child(4) { width: 13%; text-align: center; }

        input.form-control, select.form-select, textarea.form-control {
          height: 38px !important;
          padding: 6px 10px !important;
        }
        textarea.form-control {
          height: auto !important;
        }
      `}</style>
      <div className="container-fluid">
        {/* Header */}
        <div
          className="p-3 mb-3 text-white text-center"
          style={{ background: "#01C0C8", margin: "-32px" }}
        >
          <h3 className="mb-0">HMS Radiology & Diagnostics</h3>
        </div>

        {/* Patient Information */}
        <div className="full-width-card card mb-3">
          <div className="p-2 text-white" style={{ background: "#01C0C8" }}>
            <h5 className="mb-0">Patient Information</h5>
          </div>

          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Patient Name *</label>
                <input className="form-control" required />
              </div>

              <div className="col-md-2">
                <label className="form-label">Age *</label>
                <input
                  type="number"
                  min="1"
                  onInput={validAge}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">Gender *</label>
                <select className="form-select" required>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Contact *</label>
                <input className="form-control" required />
              </div>
            </div>
          </div>
        </div>

        {/* Radiology + Billing */}
        <div className="row">
          {/* Radiology Details */}
          <div className="col-md-6">
            <div className="card mb-3">
              <div className="p-2 text-white" style={{ background: "#01C0C8" }}>
                <h5 className="mb-0">Radiology Details</h5>
              </div>

              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Scan Type *</label>
                    <select className="form-select" required>
                      <option value="">Select</option>
                      <option>X-Ray</option>
                      <option>Ultrasound</option>
                      <option>MRI</option>
                      <option>CT Scan</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Imaging Date *</label>
                    <input type="date" className="form-control" required />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Imaging Time *</label>
                    <input type="time" className="form-control" required />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Reported By *</label>
                    <input className="form-control" required />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Summary */}
          <div className="col-md-6">
            <div className="card mb-3">
              <div className="p-2 text-white" style={{ background: "#01C0C8" }}>
                <h5 className="mb-0">Billing Summary</h5>
              </div>
              <div className="card-body" style={{ minHeight: "206px" }}>
                <div className="border rounded p-3 d-flex justify-content-between">
                  <div>
                    <div>Scans Count</div>
                    <h4>{tests.length}</h4>
                  </div>
                  <div>
                    <div>Total (₹)</div>
                    <h4>{totalAmount.toFixed(2)}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Findings Table */}
        <div className="full-width-card card mb-3">
          <div className="p-2 text-white" style={{ background: "#01C0C8" }}>
            <h5 className="mb-0">Radiology Findings</h5>
          </div>

          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered" id="testsTable">
                <thead>
                  <tr>
                    <th>Scan / Procedure</th>
                    <th>Findings / Observation</th>
                    <th>Cost (₹)</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {tests.map((row, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          list="testList"
                          className="form-control"
                          value={row.name}
                          onChange={(e) =>
                            handleTestChange(i, "name", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          className="form-control"
                          value={row.findings}
                          onChange={(e) =>
                            handleTestChange(i, "findings", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          className="form-control"
                          min="0"
                          value={row.cost}
                          onChange={(e) =>
                            handleTestChange(i, "cost", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => removeRow(i)}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              className="btn btn-outline-primary btn-sm me-2"
              onClick={addRow}
            >
              + Add Scan
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={clearRows}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Remarks */}
        <div className="full-width-card card mb-3">
          <div className="p-2 text-white" style={{ background: "#01C0C8" }}>
            <h5 className="mb-0">Radiologist Remarks</h5>
          </div>
          <div className="card-body">
            <textarea rows="3" className="form-control"></textarea>
          </div>
        </div>

        {/* Save & Print */}
        <div className="text-center mb-3">
          <button
            className="btn text-white me-2"
            style={{ background: "#01C0C8" }}
            onClick={saveData}
          >
            Save
          </button>
          <button
            className="btn text-white"
            style={{ background: "#01C0C8" }}
            onClick={printPage}
          >
            Print
          </button>
        </div>
      </div>
      <datalist id="testList">
        <option value="X-Ray Chest" />
        <option value="Ultrasound Abdomen" />
        <option value="MRI Brain" />
        <option value="CT Scan Whole Abdomen" />
      </datalist>
    </>
  );
}
