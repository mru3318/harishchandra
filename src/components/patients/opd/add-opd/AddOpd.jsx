import React, { useState } from "react";
import "./AddOpd.css";

const AddOpd = () => {
  const [showRefDept, setShowRefDept] = useState(false);
  const [showRefDoc, setShowRefDoc] = useState(false);

  const handleStatusChange = (e) => {
    const value = e.target.value;
    if (value === "Reference") {
      setShowRefDept(true);
      setShowRefDoc(true);
    } else {
      setShowRefDept(false);
      setShowRefDoc(false);
    }
  };

  return (
    <div className="border-card">
      <div className="card-header d-flex align-items-center">
        <i className="fa-solid fa-procedures me-2"></i>
        <h3 className="m-0">Patient OPD</h3>
      </div>

      <div className="container-fluid my-4">
        <form id="erPatientForm">
          {/* Search Bar */}
          <div className="row">
            <div className="col-12 d-flex justify-content-center">
              <input
                type="text"
                id="searchInput"
                className="form-control w-25"
                placeholder="Search Patient..."
              />
              <ul
                id="searchHistoryList"
                className="list-group position-absolute w-25"
                style={{ display: "none", zIndex: 999 }}
              ></ul>
            </div>
          </div>

          {/* First + Last Name */}
          <div className="row mt-3">
            <div className="col-md-6">
              <label>First Name *</label>
              <input type="text" className="form-control" />
            </div>
            <div className="col-md-6">
              <label>Last Name *</label>
              <input type="text" className="form-control" />
            </div>
          </div>

          {/* Gender + Email */}
          <div className="row">
            <div className="col-md-6">
              <label>Gender *</label>
              <select className="form-control">
                <option>-- Select Gender --</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="col-md-6">
              <label>Email</label>
              <input type="email" className="form-control" />
            </div>
          </div>

          {/* Occupation + Blood Group */}
          <div className="row">
            <div className="col-md-6">
              <label>Occupation</label>
              <input type="text" className="form-control" />
            </div>
            <div className="col-md-6">
              <label>Blood Group *</label>
              <select className="form-control">
                <option>-- Select Blood Group --</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (bg) => (
                    <option key={bg}>{bg}</option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* DOB + Age */}
          <div className="row">
            <div className="col-md-6">
              <label>DOB *</label>
              <input type="date" className="form-control" />
            </div>
            <div className="col-md-6">
              <label>Age</label>
              <input type="text" className="form-control" readOnly />
            </div>
          </div>

          {/* Contact + Emergency Contact */}
          <div className="row">
            <div className="col-md-6">
              <label>Contact Number *</label>
              <input type="tel" className="form-control" />
            </div>
            <div className="col-md-6">
              <label>Emergency Contact *</label>
              <input type="tel" className="form-control" />
            </div>
          </div>

          {/* Address Section */}
          <div className="border rounded p-3 my-3">
            <h5 className="fw-bold mb-3">Address Details</h5>

            <div className="row mb-3">
              <div className="col-md-6">
                <label>Address Line 1 *</label>
                <input type="text" className="form-control" />
              </div>

              <div className="col-md-6">
                <label>Address Line 2</label>
                <input type="text" className="form-control" />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label>State *</label>
                <select className="form-select">
                  <option>Select State</option>
                </select>
              </div>
              <div className="col-md-4">
                <label>District</label>
                <select className="form-select" disabled>
                  <option>Select District</option>
                </select>
              </div>
              <div className="col-md-4">
                <label>City *</label>
                <input type="text" className="form-control" />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label>Country</label>
                <select className="form-select" disabled>
                  <option>India</option>
                </select>
              </div>
              <div className="col-md-6">
                <label>Pincode</label>
                <input type="text" className="form-control" />
              </div>
            </div>
          </div>

          {/* ID + Marital Status */}
          <div className="row">
            <div className="col-md-6">
              <label>ID Proof Type *</label>
              <select className="form-control">
                <option>-- Select ID Proof --</option>
                <option>Aadhar</option>
                <option>PAN</option>
                <option>Driving License</option>
                <option>Passport</option>
              </select>
            </div>
            <div className="col-md-6">
              <label>Upload ID Proof</label>
              <input
                type="file"
                className="form-control"
                accept=".jpg,.jpeg,.png,.pdf"
              />
            </div>
          </div>

          {/* Marital + Visit Date */}
          <div className="row">
            <div className="col-md-6">
              <label>Marital Status</label>
              <select className="form-control">
                <option>Select Status</option>
                <option>Single</option>
                <option>Married</option>
                <option>Divorced</option>
                <option>Widowed</option>
              </select>
            </div>
            <div className="col-md-6">
              <label>Visit Date *</label>
              <input type="date" className="form-control" />
            </div>
          </div>

          {/* Visit Type + Status */}
          <div className="row">
            <div className="col-md-6">
              <label>Visit Type</label>
              <select className="form-control">
                <option>Select Visit Type</option>
                <option>First Visit</option>
                <option>Follow-up</option>
                <option>Emergency</option>
              </select>
            </div>

            <div className="col-md-6">
              <label>Status *</label>
              <select className="form-control" onChange={handleStatusChange}>
                <option value="">-- Select Status --</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Reference">Reference</option>
              </select>
            </div>

            {showRefDept && (
              <div className="col-md-6">
                <label>Reference Department *</label>
                <select className="form-control">
                  <option>Select Reference Department</option>
                </select>
              </div>
            )}

            {showRefDoc && (
              <div className="col-md-6">
                <label>Reference Doctor *</label>
                <select className="form-control">
                  <option>Select Reference Doctor</option>
                </select>
              </div>
            )}
          </div>

          {/* Reason + Note */}
          <div className="row">
            <div className="col-md-6">
              <label>Reason</label>
              <input type="text" className="form-control" />
            </div>

            <div className="col-md-6">
              <label>Note</label>
              <textarea className="form-control"></textarea>
            </div>
          </div>

          {/* Footer */}
          <div className="d-flex justify-content-center mt-4">
            <button type="reset" className="btn btn-secondary me-2">
              Reset
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOpd;
