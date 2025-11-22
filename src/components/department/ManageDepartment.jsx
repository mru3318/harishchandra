import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteDepartment,
  fetchAllDepartments,
} from "../../features/departmentSlice";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";

const ManageDepartment = () => {
  const dispatch = useDispatch();

  // Get departments from Redux store
  const {
    allDepartments: departments,
    allDepartmentsStatus: status,
    allDepartmentsError: error,
  } = useSelector((state) => state.departments);

  // Fetch departments on component mount
  useEffect(() => {
    dispatch(fetchAllDepartments());
  }, [dispatch]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="card shadow">
        <div
          className="card-header text-white text-center"
          style={{ backgroundColor: "#01C0C8" }}
        >
          <h4 className="mb-0">
            <i className="fas fa-building me-2"></i> Department List
          </h4>
        </div>
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading departments...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (status === "failed") {
    return (
      <div className="card shadow">
        <div
          className="card-header text-white text-center"
          style={{ backgroundColor: "#01C0C8" }}
        >
          <h4 className="mb-0">
            <i className="fas fa-building me-2"></i> Department List
          </h4>
        </div>
        <div className="card-body">
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Error loading departments: {error || "Something went wrong"}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => dispatch(fetchAllDepartments())}
          >
            <i className="fas fa-redo me-1"></i> Retry
          </button>
        </div>
      </div>
    );
  }

  // Delete handler
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This department will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteDepartment(id))
          .unwrap()
          .then(() => {
            Swal.fire("Deleted!", "Department has been deleted.", "success");
          })
          .catch((error) => {
            Swal.fire("Error!", error, "error");
          });
      }
    });
  };

  return (
    <div className="card full-width-card shadow">
      {/* Header */}
      <div
        className="card-header text-white text-center"
        style={{ backgroundColor: "#01C0C8" }}
      >
        <h4 className="mb-0">
          <i className="fas fa-building me-2"></i> Department List
        </h4>
      </div>

      {/* Body */}
      <div className="card-body">
        {departments.length === 0 ? (
          <div className="text-center py-4">
            <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
            <h5>No Departments Found</h5>
            <p className="text-muted">
              No departments are available at the moment.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Head</th>
                  <th scope="col">Description</th>
                  <th scope="col" className="text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.id}>
                    <td>{dept.id}</td>
                    <td>{dept.department_name}</td>
                    <td>{dept.department_head}</td>
                    <td>{dept.description}</td>
                    <td className="text-center">
                      <NavLink
                        to={`/dashboard/update-department/${dept.id}`}
                        className="btn btn-sm text-white"
                        style={{ backgroundColor: "#01C0C8" }}
                      >
                        <i className="fas fa-pen-to-square me-1"></i>
                      </NavLink>
                      <NavLink
                        onClick={() => handleDelete(dept.id)}
                        className="btn btn-sm btn-danger ms-2"
                      >
                        <i className="fas fa-trash me-1"></i>
                      </NavLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDepartment;
