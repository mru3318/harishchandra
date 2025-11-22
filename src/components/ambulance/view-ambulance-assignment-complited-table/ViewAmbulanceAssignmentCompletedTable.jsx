import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAssignmentHistory,
  selectAssignmentHistory,
  selectAssignmentHistoryStatus,
} from "../../../features/ambulanceSlice";

const ViewAmbulanceAssignmentCompletedTable = () => {
  const dispatch = useDispatch();
  const history = useSelector(selectAssignmentHistory) || [];
  const historyStatus = useSelector(selectAssignmentHistoryStatus);

  useEffect(() => {
    if (historyStatus === "idle") dispatch(fetchAssignmentHistory());
  }, [dispatch, historyStatus]);

  return (
    <div
      className="tab-pane fade show active"
      id="assignmentHistoryData"
      role="tabpanel"
    >
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Sr.No</th>
            <th>Ambulance</th>
            <th>Driver</th>

            <th>From</th>
            <th>To</th>
            <th>Status</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>

        <tbody>
          {history.length > 0 ? (
            history.map((assign, index) => (
              <tr key={assign.id}>
                <td>{index + 1}</td>
                <td>
                  {assign.ambulance?.vehicleNumber ||
                    assign.ambulanceVehicleNumber ||
                    "-"}
                </td>
                <td>{assign.driver?.driverName || assign.driverName || "-"}</td>

                <td>{assign.fromLocation}</td>
                <td>{assign.toLocation}</td>
                <td>
                  <span className="badge bg-success">{assign.status}</span>
                </td>
                <td>{assign.startTime}</td>
                <td>{assign.endTime}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                No completed assignment records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAmbulanceAssignmentCompletedTable;
