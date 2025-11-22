import "./AddDoctor.css";

const AddDoctor = () => {
  return (
    <>
      {/* ############################################################## */}
      <div className="form-card">
        <div className="form-header">
          <h3>Doctor – Add Doctor Form</h3>
        </div>
        <form id="doctorForm" noValidate>
          <div className="form-body">
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="firstName">
                  First Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="form-control"
                  placeholder="Enter First Name"
                />
                <div className="error-message" />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="lastName">
                  Last Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="form-control"
                  placeholder="Enter Last Name"
                />
                <div className="error-message" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="licenseId">
                  License ID <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="licenseId"
                  className="form-control"
                  placeholder="Enter License ID"
                />
                <div className="error-message" />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="gender">
                  Gender <span className="required">*</span>
                </label>
                <select id="gender" className="form-control">
                  <option value>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <div className="error-message" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="specialization">
                  Specialization <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="specialization"
                  className="form-control"
                  placeholder="Enter Specialization"
                />
                <div className="error-message" />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="qualification">
                  Qualification <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="qualification"
                  className="form-control"
                  placeholder="Enter Qualification"
                />
                <div className="error-message" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="department">
                  Department <span className="required">*</span>
                </label>
                <select id="department" className="form-control">
                  <option value>Select Department</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                </select>
                <div className="error-message" />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter Email"
                />
                <div className="error-message" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="contactNo">
                  Contact No. <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="contactNo"
                  className="form-control"
                  placeholder="Enter Contact Number"
                />
                <div className="error-message" />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="profilePic">Profile Picture</label>
                <input
                  type="file"
                  id="profilePic"
                  className="form-control"
                  accept="image/*"
                />
                <div className="error-message" />
              </div>
            </div>
          </div>
          <div className="form-footer">
            <button type="reset" className="btn btn-reset">
              Reset
            </button>
            <button type="submit" className="btn btn-save">
              Save
            </button>
          </div>
        </form>
      </div>
      {/* ####################################################################### */}
    </>
  );
};

export default AddDoctor;
