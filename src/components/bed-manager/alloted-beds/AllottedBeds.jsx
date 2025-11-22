import React from "react";
import { Link } from "react-router-dom";

const AllottedBeds = () => {
  return (
    <div className="container my-4 p-0 m-0">
      <div className="card-border" id="tableSection">
        {/* Header */}
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Allotted Beds</h5>

          <div className="d-flex gap-2">
            <Link
              to="/bed-list"
              className="btn btn-sm btn-success text-white text-decoration-none"
            >
              Vacant Beds
            </Link>
          </div>
        </div>

        {/* Messages */}
        <div
          id="errorMsg"
          style={{
            color: "red",
            fontWeight: "bold",
            marginBottom: "15px",
            display: "none",
          }}
        >
          <p>Error message here</p>
        </div>

        <div
          id="successMsg"
          style={{
            color: "green",
            fontWeight: "bold",
            marginBottom: "15px",
            display: "none",
          }}
        >
          <p>Success message here</p>
        </div>

        {/* Table */}
        <div class="container">
          <div className="card-body">
            <div className="table-responsive">
              <h4>Allotted Beds</h4>
              <table className="table table-sm table-striped table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>SL.NO</th>
                    <th>Bed No</th>
                    <th>Room Name</th>
                    <th>Room Type</th>
                    <th>Patient Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Example Rows */}
                  <tr>
                    <td>1</td>
                    <td>B-101</td>
                    <td>General Ward</td>
                    <td>Shared</td>
                    <td>John Doe</td>
                    <td>
                      <Link to="/release-bed" className="btn btn-sm btn-danger">
                        Release
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>B-102</td>
                    <td>Private Room</td>
                    <td>Single</td>
                    <td>Jane Smith</td>
                    <td>
                      <Link to="/release-bed" className="btn btn-sm btn-danger">
                        Release
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllottedBeds;
