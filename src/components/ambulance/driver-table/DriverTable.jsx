import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDrivers,
  selectDrivers,
  selectDriversStatus,
  selectDriversError,
} from "../../../features/ambulanceSlice";

const DriverTable = () => {
  const dispatch = useDispatch();
  const drivers = useSelector(selectDrivers) || [];
  const driversStatus = useSelector(selectDriversStatus);
  const driversError = useSelector(selectDriversError);

  useEffect(() => {
    if (driversStatus === "idle") dispatch(fetchDrivers());
  }, [dispatch, driversStatus]);

  return (
    <div className="tab-pane fade show active" id="driverData" role="tabpanel">
      {driversStatus === "loading" && (
        <div className="p-3 small text-muted">Loading drivers...</div>
      )}
      {driversStatus === "failed" && (
        <div className="p-3 text-danger small">
          Failed to load drivers:{" "}
          {String(driversError?.message || driversError)}
        </div>
      )}

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Sr.No</th>
            <th>Driver Name</th>
            <th>License Number</th>
            <th>Phone</th>
          </tr>
        </thead>

        <tbody>
          {drivers && drivers.length > 0 ? (
            drivers.map((drv, index) => (
              <tr key={drv.id || drv.driverId || index}>
                <td>{index + 1}</td>
                <td>{drv.driverName || drv.name}</td>
                <td>{drv.licenseNumber || drv.license}</td>
                <td>{drv.contactNumber || drv.phone}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No driver records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DriverTable;
