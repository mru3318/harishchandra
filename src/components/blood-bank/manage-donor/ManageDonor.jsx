import "./ManageDonor.css";

const ManageDonor = () => {
  return (
    <>
      {/* Header Bar */}
      <div className="header-bar form-header  d-flex align-items-center justify-content-center position-relative">
        <div className="d-flex align-items-center">
          <i className="fa-solid fa-droplet fa-lg text-white me-2"></i>
          <h4>Donor List</h4>
        </div>

        <button className="btn btn-success btn-sm position-absolute end-0 me-3">
          <i className="fas fa-plus me-1"></i> Add Donor
        </button>
      </div>

      {/* Table Container */}
      <div className="table-container p-2">
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th className="col-1">SLNO</th>
                <th className="col-1">Donor ID</th>
                <th>Name</th>
                <th className="col-1">Age</th>
                <th className="col-1">Gender</th>
                <th className="d-none d-md-table-cell">Contact Info</th>
                <th className="d-none d-md-table-cell">Email</th>
                <th className="col-1">Blood Group</th>
                <th className="d-none d-lg-table-cell">Address</th>
                <th className="d-none d-sm-table-cell">Last Donation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1 */}
              <tr>
                <td>1</td>
                <td>101</td>
                <td>Jane Doe</td>
                <td>29</td>
                <td>Female</td>
                <td className="d-none d-md-table-cell">+1234567890</td>
                <td className="d-none d-md-table-cell">jane@example.com</td>
                <td>O+</td>
                <td className="d-none d-lg-table-cell">123 Main St, City</td>
                <td className="d-none d-sm-table-cell">2025-09-20</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm action-btn me-2"
                    title="Edit"
                  >
                    <i className="fa-solid fa-pen-to-square me-1"></i>
                    {/* <span className="d-sm-inline ms-1">Edit</span> */}
                  </button>
                  <button
                    className="btn btn-danger btn-sm action-btn"
                    title="Edit"
                  >
                    <i className="fa-solid fa-trash me-1"></i>
                    {/* <span className="d-sm-inline ms-1">Delete</span> */}
                  </button>
                </td>
              </tr>

              {/* Row 2 */}
              <tr>
                <td>2</td>
                <td>102</td>
                <td>John Smith</td>
                <td>35</td>
                <td>Male</td>
                <td className="d-none d-md-table-cell">+1987654321</td>
                <td className="d-none d-md-table-cell">john@example.com</td>
                <td>A-</td>
                <td className="d-none d-lg-table-cell">456 Elm St, City</td>
                <td className="d-none d-sm-table-cell">2025-06-10</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm action-btn me-2"
                    title="Edit"
                  >
                    <i className="fa-solid fa-pen-to-square me-1"></i>
                    {/* <span className="d-sm-inline ms-1">Edit</span> */}
                  </button>
                  <button
                    className="btn btn-danger btn-sm action-btn"
                    title="Edit"
                  >
                    <i className="fa-solid fa-trash me-1"></i>
                    {/* <span className="d-sm-inline ms-1">Delete</span> */}
                  </button>
                </td>
              </tr>

              {/* Row 3 */}
              <tr>
                <td>3</td>
                <td>103</td>
                <td>Sam Lee</td>
                <td>42</td>
                <td>Male</td>
                <td className="d-none d-md-table-cell">+1122334455</td>
                <td className="d-none d-md-table-cell">sam@example.com</td>
                <td>B+</td>
                <td className="d-none d-lg-table-cell">789 Oak St, City</td>
                <td className="d-none d-sm-table-cell">2025-01-15</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm action-btn me-2"
                    title="Edit"
                  >
                    <i className="fa-solid fa-pen-to-square me-1"></i>
                    {/* <span className="d-sm-inline ms-1">Edit</span> */}
                  </button>
                  <button
                    className="btn btn-danger btn-sm action-btn"
                    title="Edit"
                  >
                    <i className="fa-solid fa-trash me-1"></i>
                    {/* <span className="d-sm-inline ms-1">Delete</span> */}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ManageDonor;
