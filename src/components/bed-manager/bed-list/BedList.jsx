import React, { useEffect, useState } from "react";
import "./BedList.css";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBedsList,
  selectBedsList,
  selectBedsListStatus,
  selectBedsListError,
} from "../../../features/bedManagerSlice";

const BedList = () => {
  const dispatch = useDispatch();
  const beds = useSelector(selectBedsList) || [];
  const bedsStatus = useSelector(selectBedsListStatus);
  const bedsError = useSelector(selectBedsListError);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (bedsStatus === "idle") dispatch(fetchBedsList());
  }, [dispatch, bedsStatus]);

  useEffect(() => {
    if (bedsError)
      setErrorMessage(bedsError.message || bedsError || "Failed to load beds");
  }, [bedsError]);

  const handleAssign = (roomNo) => {
    try {
      setSuccessMessage(`Bed assigned successfully for Room ${roomNo}!`);
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="container-fluid my-4 p-0 m-0">
      <div className="card-border border rounded shadow-sm">
        {/* Header */}
        <div className="card-header d-flex justify-content-between align-items-center bg-light">
          <h5 className="mb-0">Vacant Beds</h5>
          <NavLink
            to="/dashboard/allotted-beds"
            className="btn btn-sm btn-success"
          >
            Allotted Beds
          </NavLink>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div
            className="alert alert-success alert-dismissible fade show mt-3 mx-3"
            role="alert"
          >
            <i className="fa fa-check-circle me-2"></i>
            <span>{successMessage}</span>
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccessMessage("")}
              aria-label="Close"
            ></button>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div
            className="alert alert-danger alert-dismissible fade show mt-3 mx-3"
            role="alert"
          >
            <i className="fa fa-triangle-exclamation me-2"></i>
            <span>{errorMessage}</span>
            <button
              type="button"
              className="btn-close"
              onClick={() => setErrorMessage("")}
              aria-label="Close"
            ></button>
          </div>
        )}

        {/* Table */}
        <div className="container-fluid">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-sm table-striped table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>SL.NO</th>
                    <th>Room No</th>
                    <th>Room Name</th>
                    <th>Room Type</th>
                    <th>Vacant Beds</th>
                    <th>Total Beds</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bedsStatus === "loading" ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        Loading beds...
                      </td>
                    </tr>
                  ) : beds.length > 0 ? (
                    beds.map((bed, index) => (
                      <tr key={bed.id || bed.roomNumber || index}>
                        <td>{index + 1}</td>
                        <td>{bed.roomNumber ?? bed.roomNo ?? "-"}</td>
                        <td>
                          {bed.roomName ??
                            bed.roomName ??
                            bed.roomNumber ??
                            "-"}
                        </td>
                        <td>{bed.roomType ?? bed.type ?? "-"}</td>
                        <td>
                          {bed.vacantBeds ?? bed.vacant ?? bed.available ?? 0}
                        </td>
                        <td>
                          {bed.totalBeds ?? bed.total ?? bed.capacity ?? 0}
                        </td>
                        <td>
                          {(bed.vacantBeds ??
                            bed.vacant ??
                            bed.available ??
                            0) > 0 ? (
                            <NavLink
                              className="btn btn-sm btn-success"
                              to={`/dashboard/bed-assign/${
                                bed.roomNumber || bed.roomNo || bed.id
                              }`}
                              // onClick={() =>
                              //   handleAssign(
                              //     bed.roomNumber || bed.roomNo || bed.id
                              //   )
                              // }
                            >
                              Assign
                            </NavLink>
                          ) : (
                            <span className="btn btn-sm btn-secondary disabled">
                              No Beds
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No beds found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BedList;
