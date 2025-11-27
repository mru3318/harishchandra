import { useState } from "react";

export default function AddPathalogyForm() {
  const [tests, setTests] = useState([
    { name: "", result: "", units: "", range: "", cost: 0 },
  ]);

  const TEST_CATALOG = {
    Hemoglobin: { units: "g/dL", range: "13-17", cost: 120 },
    WBC: { units: "x10^9/L", range: "4-11", cost: 100 },
    Platelets: { units: "x10^9/L", range: "150-400", cost: 150 },
  };

  function validAge(e) {
    if (e.target.value < 1) e.target.value = "";
  }

  const addRow = () => {
    setTests([
      ...tests,
      { name: "", result: "", units: "", range: "", cost: 0 },
    ]);
  };

  const clearRows = () => {
    setTests([{ name: "", result: "", units: "", range: "", cost: 0 }]);
  };

  const updateRow = (index, field, value) => {
    const newRows = [...tests];
    newRows[index][field] = value;

    if (field === "name") {
      const item = TEST_CATALOG[value];
      if (item) {
        newRows[index].units = item.units;
        newRows[index].range = item.range;
        newRows[index].cost = item.cost;
      } else {
        newRows[index].units = "";
        newRows[index].range = "";
        if (!newRows[index].cost) newRows[index].cost = 0;
      }
    }

    setTests(newRows);
  };

  const removeRow = (index) => {
    const newRows = tests.filter((_, i) => i !== index);
    setTests(newRows);
  };

  const total = tests.reduce((sum, t) => sum + (parseFloat(t.cost) || 0), 0);

  const handleSave = () => {
    const requiredFields = [
      { id: "patientName", label: "Patient Name" },
      { id: "age", label: "Age" },
      { id: "gender", label: "Gender" },
      { id: "contact", label: "Contact" },
      { id: "sampleType", label: "Sample Type" },
      { id: "collectedOn", label: "Collected On" },
      { id: "collectedTime", label: "Collection Time" },
      { id: "receivedBy", label: "Received By" },
    ];

    for (let f of requiredFields) {
      const input = document.getElementById(f.id);
      if (!input.value || input.value.trim() === "") {
        alert("Please fill: " + f.label);
        input.focus();
        return;
      }
    }

    alert("Saved Successfully!");
  };

  return (
    <div className="container-fluid">
      <div
        className="p-3 mb-3 text-white"
        style={{ background: "#01C0C8", margin: "-32px" }}
      >
        <h3 className="mb-0 text-center">HMS Pathology & Diagnostics</h3>
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
              <input
                type="text"
                id="patientName"
                className="form-control"
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Age *</label>
              <input
                type="number"
                id="age"
                className="form-control"
                min="1"
                onInput={validAge}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Gender *</label>
              <select id="gender" className="form-select" required>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Contact *</label>
              <input
                type="text"
                id="contact"
                className="form-control"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sample + Billing Row */}
      <div className="row">
        {/* Sample Details */}
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="p-2 text-white" style={{ background: "#01C0C8" }}>
              <h5 className="mb-0">Sample Details</h5>
            </div>

            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Sample Type *</label>
                  <select id="sampleType" className="form-select" required>
                    <option value="">Select</option>
                    <option>Blood</option>
                    <option>Urine</option>
                    <option>Stool</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Collected On *</label>
                  <input
                    type="date"
                    id="collectedOn"
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Collection Time *</label>
                  <input
                    type="time"
                    id="collectedTime"
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Received By *</label>
                  <input
                    type="text"
                    id="receivedBy"
                    className="form-control"
                    required
                  />
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

            <div className="card-body" style={{ minHeight: "209px" }}>
              <div className="border rounded p-3 d-flex justify-content-between">
                <div>
                  <div>Tests Count</div>
                  <h4>{tests.length}</h4>
                </div>
                <div>
                  <div>Total (₹)</div>
                  <h4>{total.toFixed(2)}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Table */}
      <div className="full-width-card card mb-3">
        <div className="p-2 text-white" style={{ background: "#01C0C8" }}>
          <h5 className="mb-0">Test Results</h5>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" id="testsTable">
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Result</th>
                  <th>Units</th>
                  <th>Range</th>
                  <th>Cost</th>
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
                        onChange={(e) => updateRow(i, "name", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        value={row.result}
                        onChange={(e) => updateRow(i, "result", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        readOnly
                        value={row.units}
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        readOnly
                        value={row.range}
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        value={row.cost}
                        onChange={(e) => updateRow(i, "cost", e.target.value)}
                      />
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        type="button"
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

          <button className="btn btn-outline-primary btn-sm" onClick={addRow}>
            + Add Test
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
          <h5 className="mb-0">Remarks</h5>
        </div>

        <div className="card-body">
          <textarea id="remarks" rows="3" className="form-control"></textarea>
        </div>
      </div>

      {/* Buttons */}
      <div className="text-center mb-3">
        <button
          className="btn text-white"
          style={{ background: "#01C0C8" }}
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="btn text-white ms-2"
          style={{ background: "#01C0C8" }}
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>

      {/* Test List Datalist */}
      <datalist id="testList">
        <option value="Hemoglobin" />
        <option value="WBC" />
        <option value="Platelets" />
      </datalist>
    </div>
  );
}
