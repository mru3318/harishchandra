import React, { useState, useEffect } from "react";
import "./AmbulanceDashboard.css";
import AmbulanceTable from "../ambulance-table/AmbulanceTable";
import DriverTable from "../driver-table/DriverTable";
import AssignmentTable from "../assignment-table/AssignmentTable";
import ViewAmbulanceAssignmentCompletedTable from "../view-ambulance-assignment-complited-table/ViewAmbulanceAssignmentCompletedTable";

const AmbulanceDashboard = () => {
  const [activeTab, setActiveTab] = useState("ambulance");
  const [tabData, setTabData] = useState("Loading...");

  // Fetch content from backend when tab changes
  useEffect(() => {
    // For the ambulance, driver, assignment and assignmentHistory tabs we render React components directly
    if (
      activeTab === "ambulance" ||
      activeTab === "driver" ||
      activeTab === "assignment" ||
      activeTab === "assignmentHistory"
    ) {
      setTabData(null);
      return;
    }

    const fetchData = async () => {
      let url = "";
      switch (activeTab) {
        case "assignment":
          url = "/assignment/list";
          break;
        case "assignmentHistory":
          url = "/assignment/history";
          break;
        default:
          return;
      }

      try {
        setTabData("Loading...");
        const res = await fetch(url);
        const html = await res.text();
        setTabData(html);
      } catch (error) {
        console.error("Error fetching tab data:", error);
        setTabData("<p class='text-danger'>Failed to load data.</p>");
      }
    };

    fetchData();
  }, [activeTab]);

  return (
    <div className="  ambulance-dashboard">
      {/* ============================ */}
      {/* Title Bar Section */}
      {/* ============================ */}
      <div className="position-relative heading text-white p-3 rounded-top bg-custom">
        <div className="header d-flex justify-content-center align-items-center gap-2">
          <i className="fa-solid fa-truck-medical"></i>
          <h4 className="mb-0">Ambulance Management Dashboard</h4>
        </div>
      </div>

      {/* ============================ */}
      {/* Tabs Section */}
      {/* ============================ */}
      <div className="border border-info rounded-bottom p-3 bg-white">
        <ul className="nav nav-tabs" id="dashboardTabs" role="tablist">
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "ambulance" ? "active" : ""
              }`}
              onClick={() => setActiveTab("ambulance")}
            >
              View Ambulance
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "driver" ? "active" : ""}`}
              onClick={() => setActiveTab("driver")}
            >
              View Driver
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "assignment" ? "active" : ""
              }`}
              onClick={() => setActiveTab("assignment")}
            >
              View Ambulance Assignment
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "assignmentHistory" ? "active" : ""
              }`}
              onClick={() => setActiveTab("assignmentHistory")}
            >
              View Ambulance Assignment Completed
            </button>
          </li>
        </ul>

        {/* ============================ */}
        {/* Tab Content */}
        {/* ============================ */}
        <div className="tab-content mt-3">
          {activeTab === "ambulance" ? (
            <div className="tab-pane fade show active">
              <AmbulanceTable />
            </div>
          ) : activeTab === "driver" ? (
            <div className="tab-pane fade show active">
              <DriverTable />
            </div>
          ) : activeTab === "assignment" ? (
            <div className="tab-pane fade show active">
              <AssignmentTable />
            </div>
          ) : activeTab === "assignmentHistory" ? (
            <div className="tab-pane fade show active">
              <ViewAmbulanceAssignmentCompletedTable />
            </div>
          ) : (
            <div
              className="tab-pane fade show active"
              dangerouslySetInnerHTML={{ __html: tabData }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AmbulanceDashboard;
