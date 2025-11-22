import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAmbulances,
  selectAmbulances,
  selectAmbulancesStatus,
  selectAmbulancesError,
} from "../../../features/ambulanceSlice";

const AmbulanceTable = () => {
  const dispatch = useDispatch();
  const ambulances = useSelector(selectAmbulances) || [];
  const status = useSelector(selectAmbulancesStatus);
  const error = useSelector(selectAmbulancesError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAmbulances());
    }
  }, [dispatch, status]);

  return (
    <table className="table table-bordered table-striped">
      <thead className="table-dark">
        <tr>
          <th>Sr.No</th>
          <th>Ambulance Number</th>
          <th>Type</th>
          <th>Status</th>
          <th>Last Maintenance Date</th>
        </tr>
      </thead>

      <tbody>
        {status === "loading" && (
          <tr>
            <td colSpan="5" className="text-center">
              Loading ambulances...
            </td>
          </tr>
        )}
        {status === "failed" && (
          <tr>
            <td colSpan="5" className="text-center text-danger">
              {typeof error === "string"
                ? error
                : error?.message || "Failed to load ambulances"}
            </td>
          </tr>
        )}
        {(status === "succeeded" || status === "idle") &&
          (ambulances && ambulances.length > 0 ? (
            ambulances.map((amb, index) => (
              <tr key={amb.id || amb.ambulanceId || index}>
                <td>{index + 1}</td>
                <td>{amb.vehicleNumber}</td>
                <td>{amb.ambulanceType}</td>
                <td>
                  <span
                    className={`badge ${
                      amb.ambulanceStatus === "AVAILABLE"
                        ? "bg-success"
                        : amb.ambulanceStatus === "ON_DUTY"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    }`}
                  >
                    {amb.ambulanceStatus}
                  </span>
                </td>
                <td>{amb.lastMaintenanceDate}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No ambulance records found.
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default AmbulanceTable;
