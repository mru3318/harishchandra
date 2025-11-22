import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  fetchAssignments,
  selectAssignments,
  selectAssignmentsStatus,
  updateAssignment,
} from "../../../features/ambulanceSlice";

const AssignmentTable = () => {
  const dispatch = useDispatch();
  const assignments = useSelector(selectAssignments) || [];
  const assignmentsStatus = useSelector(selectAssignmentsStatus);

  useEffect(() => {
    if (assignmentsStatus === "idle") dispatch(fetchAssignments());
  }, [dispatch, assignmentsStatus]);

  const [updatingId, setUpdatingId] = useState(null);

  const statusOptions = ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

  return (
    <div
      className="tab-pane fade show active"
      id="assignmentData"
      role="tabpanel"
    >
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Sr.No</th>
            <th>Ambulance</th>
            <th>Driver</th>
            <th>Patient</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>

        <tbody>
          {assignments.length > 0 ? (
            assignments.map((assign, index) => (
              <tr key={assign.id}>
                <td>{index + 1}</td>
                <td>
                  {assign.ambulance?.vehicleNumber ||
                    assign.ambulanceVehicleNumber ||
                    assign.ambulance?.vehicle_number ||
                    "-"}
                </td>
                <td>
                  {assign.driver?.driverName ||
                    assign.driverName ||
                    assign.driver?.name ||
                    "-"}
                </td>
                <td>
                  {assign.patient?.firstName || assign.patientName || "-"}
                </td>
                <td>{assign.fromLocation}</td>
                <td>{assign.toLocation}</td>

                {/* Status dropdown (editable) */}
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={assign.status || ""}
                    disabled={updatingId === assign.id}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      setUpdatingId(assign.id);
                      try {
                        const resp = await dispatch(
                          updateAssignment({
                            id: assign.id,
                            updates: { status: newStatus },
                          })
                        ).unwrap();
                        const msg =
                          resp?.message ||
                          (resp?.data && resp.data.message) ||
                          "Status updated";
                        Swal.fire({
                          title: msg,
                          icon: "success",
                          timer: 1400,
                          showConfirmButton: false,
                        });
                        // refresh assignments list from server
                        await dispatch(fetchAssignments());
                      } catch (err) {
                        const backendMsg =
                          err?.message ||
                          err?.data?.message ||
                          JSON.stringify(err) ||
                          "Failed to update status";
                        Swal.fire({
                          title: "Failed",
                          text: backendMsg,
                          icon: "error",
                        });
                      } finally {
                        setUpdatingId(null);
                      }
                    }}
                  >
                    <option value="">-- Select --</option>
                    {statusOptions.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </td>

                <td>{assign.startTime}</td>
                <td>{assign.endTime}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                No assignment records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentTable;
