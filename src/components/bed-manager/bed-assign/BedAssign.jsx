import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssignData } from "../../../features/bedManagerSlice";

const BedAssign = () => {
  const { id: routeRoomId } = useParams();

  const [formData, setFormData] = useState({
    roomId: routeRoomId || "",
    bedNo: "",
    roomName: "",
    patientId: "",
    roomType: "Shared",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // `bedOptions` will be populated from `assignData.bedNumbers` for the selected room

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const dispatch = useDispatch();
  const assignData = useSelector(
    (s) =>
      s.bedManager?.assignData || { bedNumbers: {}, patientIds: {}, room: null }
  );
  const patientsList = Object.entries(assignData?.patientIds || {}).map(
    ([internalId, obj]) => ({
      internalId,
      code: obj?.hospitalId || "",
      name: obj?.name || "",
    })
  );
  const bedOptions = Object.entries(assignData?.bedNumbers || {}).map(
    ([key, val]) => ({ id: key, label: String(val) })
  );
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const location = useLocation();
  const editPrefill = React.useMemo(
    () => location.state || {},
    [location.state]
  );

  useEffect(() => {
    // Load assign metadata when the selected room changes
    if (formData.roomId) dispatch(fetchAssignData(formData.roomId));
  }, [dispatch, formData.roomId]);

  // When assign metadata arrives (room info, bed numbers), prefill roomName, roomType and bedNo if in edit mode or only one bed available
  useEffect(() => {
    if (assignData?.room) {
      setFormData((prev) => ({
        ...prev,
        roomName: assignData.room.roomName || prev.roomName,
        roomType: assignData.room.roomType || prev.roomType,
      }));
    }
    // If coming from an edit button with bedNo provided in navigation state
    if (editPrefill?.bedNo) {
      setFormData((prev) => ({ ...prev, bedNo: String(editPrefill.bedNo) }));
    } else if (!formData.bedNo && bedOptions.length === 1) {
      // Auto-select the single available bed number
      setFormData((prev) => ({ ...prev, bedNo: bedOptions[0].label }));
    }
  }, [assignData, bedOptions, editPrefill, formData.bedNo]);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const q = query.trim().toLowerCase();
    const matches = (patientsList || [])
      .filter((p) => {
        const code = p.code.toLowerCase();
        const name = p.name.toLowerCase();
        return code.includes(q) || name.includes(q);
      })
      .slice(0, 10)
      .map((p) => ({ id: p.code, name: p.name || p.code }));
    setSuggestions(matches);
  }, [query, patientsList]);

  const handleSelectSuggestion = (s) => {
    setFormData({ ...formData, patientId: s.id }); // hospitalId code
    setQuery(`${s.id} - ${s.name}`);
    setShowSuggestions(false);
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
    // clear selected patientId if user edits
    setFormData({ ...formData, patientId: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.bedNo || !formData.patientId) {
      setErrorMsg("Please fill all required fields.");
      setSuccessMsg("");
      return;
    }

    // Example: API call simulation
    console.log("Bed Assigned:", formData);

    setSuccessMsg("Bed assigned successfully!");
    setErrorMsg("");
    setFormData({
      ...formData,
      bedNo: "",
      patientId: "",
    });
  };

  return (
    <div className="container my-4 p-0 m-0">
      <div className="card-border border rounded shadow-sm">
        {/* Header */}
        <div className="card-header d-flex justify-content-center align-items-center bg-light">
          <i className="fa fa-bed fs-3 me-2"></i>
          <h3 className="mb-0">Assign Beds</h3>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="text-danger fw-bold mb-3 text-center mt-3">
            <p>{errorMsg}</p>
          </div>
        )}
        {successMsg && (
          <div className="text-success fw-bold mb-3 text-center mt-3">
            <p>{successMsg}</p>
          </div>
        )}

        {/* Form */}
        <div className="container-fluid my-3">
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="roomId" value={formData.roomId} />

            <div className="row g-3">
              {/* Bed No */}
              <div className="col-md-6">
                <label htmlFor="bedNo" className="form-label fw-semibold">
                  Bed No <span className="text-danger">*</span>
                </label>
                <select
                  id="bedNo"
                  name="bedNo"
                  className="form-select"
                  value={formData.bedNo}
                  onChange={handleChange}
                  required
                  disabled={!bedOptions.length}
                >
                  <option value="">-- Select Bed No --</option>
                  {bedOptions.map((bed) => (
                    <option key={bed.id} value={bed.label}>
                      {bed.label}
                    </option>
                  ))}
                </select>
                {!bedOptions.length && (
                  <small className="text-muted">Loading bed numbers...</small>
                )}
              </div>

              {/* Room Name */}
              <div className="col-md-6">
                <label htmlFor="roomName" className="form-label fw-semibold">
                  Room Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="roomName"
                  name="roomName"
                  className="form-control"
                  value={assignData?.room?.roomName || formData.roomName}
                  readOnly
                  required
                />
              </div>

              {/* Patient ID (searchable) */}
              <div className="col-md-6 position-relative">
                <label
                  htmlFor="patientSearch"
                  className="form-label fw-semibold"
                >
                  Patient ID <span className="text-danger">*</span>
                </label>
                <input
                  id="patientSearch"
                  name="patientSearch"
                  ref={inputRef}
                  className="form-control"
                  placeholder="Search patient by code (e.g., HM6) or name"
                  value={query}
                  onChange={handleQueryChange}
                  onFocus={() => setShowSuggestions(true)}
                  autoComplete="off"
                  required
                />
                <input
                  type="hidden"
                  name="patientId"
                  value={formData.patientId}
                />
                {showSuggestions && suggestions && suggestions.length > 0 && (
                  <ul
                    className="list-group position-absolute w-100 zindex-tooltip"
                    style={{ maxHeight: 220, overflowY: "auto" }}
                  >
                    {suggestions.map((s) => (
                      <li
                        key={s.id}
                        className="list-group-item list-group-item-action"
                        onMouseDown={() => handleSelectSuggestion(s)}
                      >
                        <strong>{s.id}</strong> - <span>{s.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Room Type (read-only from assignData) */}
              <div className="col-md-6">
                <label htmlFor="roomType" className="form-label fw-semibold">
                  Room Type
                </label>
                <input
                  id="roomType"
                  name="roomType"
                  className="form-control"
                  value={assignData?.room?.roomType || formData.roomType || ""}
                  readOnly
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center my-3">
              <button type="submit" className="btn button px-4">
                Assign Bed
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BedAssign;
