// Sidebar configuration for the hospital management system
export const sidebarMenu = [
  {
    title: "Dashboard",
    icon: "fa fa-tachometer-alt",
    dynamicDashboard: true,
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "HR",
      "DOCTOR",
      "RECEPTIONIST",
      "ACCOUNTANT",
      "HEADNURSE",
      "INSURANCE",
      "LABORATORIST",
      "PHARMACIST",
    ],
    permissions: ["DASHBOARD_ACCESS"],
  },

  // Department Management Menu

  {
    title: "Departments",
    icon: "fa fa-building",
    collapseId: "department-menu",
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "HR",
      "DOCTOR",
      "RECEPTIONIST",
      "ACCOUNTANT",
      "HEADNURSE",
      "INSURANCE",
      "LABORATORIST",
      "PHARMACIST",
    ],
    children: [
      {
        title: "Add Department",
        path: "/dashboard/add-new-department",
        permissions: ["DEPARTMENT_ADD"],
      },
      {
        title: "Manage Departments",
        path: "/dashboard/manage-departments",
        permissions: [
          "DEPARTMENT_VIEW",
          "DEPARTMENT_UPDATE",
          "DEPARTMENT_DELETE",
        ],
      },
    ],
  },

  // Doctor Management Menu
  {
    title: "Doctor",
    icon: "fa fa-user-md",
    collapseId: "doctor-menu",
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "DOCTOR",
      "RECEPTIONIST",
      "HR",
      "ACCOUNTANT",
      "HEADNURSE",
      "INSURANCE",
      "LABORATORIST",
      "PHARMACIST",
    ],
    children: [
      {
        title: "View Doctors",
        path: "/dashboard/view-doctors",
        permissions: [
          "DOCTOR_LIST",
          "DOCTOR_LIST_PROFILE_VIEW",
          "DOCTOR_LIST_UPDATE",
        ],
      },
      {
        title: "Add Schedule",
        path: "/dashboard/add-schedule",
        permissions: ["SCHEDULE_ADD"],
      },
      {
        title: "View Schedule",
        path: "/dashboard/view-schedule",
        permissions: ["SCHEDULE_LIST", "SCHEDULE_UPDATE", "SCHEDULE_DELETE"],
      },
    ],
  },

  // Appointment Management Menu
  {
    title: "Appointments",
    icon: "fa fa-calendar-check",
    collapseId: "appointment-menu",
    roles: ["SUPER_ADMIN", "ADMIN", "RECEPTIONIST", "DOCTOR", "HEADNURSE"],
    children: [
      {
        title: "Add Appointment",
        path: "/dashboard/add-appointment",
        permissions: ["APPOINTMENT_ADD"],
      },

      {
        title: "Manage Appointments",
        path: "/dashboard/manage-appointments",
        permissions: [
          "APPOINTMENT_LIST",
          "APPOINTMENT_DELETE",
          "APPOINTMENT_UPDATE",
        ],
      },
    ],
  },

  // Patient Management Menu

  {
    title: "Patient Management",
    icon: "fa fa-procedures",
    collapseId: "patient-management",
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "DOCTOR",
      "RECEPTIONIST",
      "HR",
      "ACCOUNTANT",
      "HEADNURSE",
      "INSURANCE",
      "LABORATORIST",
      "PHARMACIST",
    ],
    children: [
      {
        title: "OPD",
        collapseId: "opd-section",
        children: [
          {
            title: "Add Patient",
            path: "/dashboard/opd/add-patient",
            permissions: ["PATIENT_ADD"],
          },
          {
            title: "View Patients",
            path: "/dashboard/opd/view-patients",
            permissions: ["PATIENT_LIST", "PATIENT_UPDATE", "PATIENT_DELETE"],
          },
        ],
      },
      {
        title: "IPD",
        collapseId: "ipd-section",
        children: [
          {
            title: "Add Patient",
            path: "/dashboard/ipd/add-patient",
            permissions: ["PATIENT_ADD"],
          },
          {
            title: "View Patients",
            path: "/dashboard/ipd/view-patients",
            permissions: ["PATIENT_LIST", "PATIENT_UPDATE", "PATIENT_DELETE"],
          },
        ],
      },
      {
        title: "Emergency",
        collapseId: "emergency-section",
        children: [
          {
            title: "Add Patient",
            path: "/dashboard/emergency/add-patient",
            permissions: ["PATIENT_ADD"],
          },
          {
            title: "View Patients",
            path: "/dashboard/emergency/view-patients",
            permissions: ["PATIENT_LIST", "PATIENT_UPDATE", "PATIENT_DELETE"],
          },
        ],
      },
    ],
  },

  // ADT Management Menu
  {
    title: "ADT Manager",
    icon: "fa fa-procedures",
    collapseId: "adt-menu",
    roles: ["SUPER_ADMIN", "ADMIN", "DOCTOR", "RECEPTIONIST", "HEADNURSE"],
    children: [
      {
        title: "Add ADT Record",
        path: "/dashboard/add-adt-record",
        permissions: ["ADT_ADD"],
      },
      {
        title: "Manage ADT Records",
        path: "/dashboard/view-adt-records",
        permissions: ["ADT_LIST", "ADT_UPDATE"],
      },
    ],
  },

  //case Manager Menu

  {
    title: "Case Manager",
    icon: "fa fa-briefcase-medical",
    collapseId: "case-menu",
    roles: ["SUPER_ADMIN", "ADMIN", "DOCTOR", "RECEPTIONIST", "HEADNURSE"],
    children: [
      {
        title: "Add Case Study",
        path: "/dashboard/add-case-study",
        permissions: ["CASE_STUDY_ADD"],
      },
      {
        title: "View Case Studies",
        path: "/dashboard/view-case-studies",
        permissions: ["CASE_STUDY_LIST"],
      },
    ],
  },

  // Bed Manager Menu
  {
    title: "Bed Manager",
    icon: "fa fa-bed",
    collapseId: "bed-menu",
    roles: ["SUPER_ADMIN", "ADMIN", "DOCTOR", "RECEPTIONIST", "HEADNURSE"],
    children: [
      {
        title: "Add New Bed",
        path: "/dashboard/add-new-bed",
        permissions: ["BED_ADD"],
      },
      {
        title: "Add new Room",
        path: "/dashboard/add-new-room",
        permissions: ["ROOM_ADD"],
      },
      {
        title: "Manage Beds",
        path: "/dashboard/view-beds",
        permissions: ["BED_LIST", "BED_VACANT", "BED_ASSIGN", "BED_RELEASE"],
      },
    ],
  },

  // Invoice and Finance Management Menu
  {
    title: "Finance",
    icon: "fa fa-wallet",
    collapseId: "finance-menu",
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "HR",
      "ACCOUNTANT",
      "RECEPTIONIST",
      "INSURANCE",
    ],
    children: [
      {
        title: "Invoice",
        collapseId: "invoice-section",
        children: [
          {
            title: "Add Invoice",
            path: "/dashboard/add-invoice",
            permissions: ["INVOICE_ADD"],
          },
          {
            title: "Manage Invoices",
            path: "/dashboard/manage-invoices",
            permissions: ["INVOICE_LIST", "INVOICE_UPDATE"],
          },
        ],
      },

      {
        title: "Finance Reports",
        collapseId: "finance-reports-section",
        children: [
          {
            title: "Add Report",
            path: "/dashboard/add-finance-report",
            permissions: ["FINANCE_ADD_INVOICE"],
          },
          {
            title: "Manage Reports",
            path: "/dashboard/manage-finance-reports",
            permissions: ["FINANCIAL_REPORTS", "FINANCE_UPDATE_INVOICE"],
          },
        ],
      },
    ],
  },

  // Human Resources Menu
  {
    title: "Human Resources",
    icon: "fa fa-users",
    collapseId: "hr-menu",
    roles: ["SUPER_ADMIN", "ADMIN", "HR"],
    children: [
      {
        title: "Add Employee",
        path: "/dashboard/add-new-employee",
        permissions: ["EMPLOYEE_ADD"],
      },
      {
        title: "Manage Employees",
        path: "/dashboard/manage-employees",
        permissions: ["EMPLOYEE_LIST"],
      },
    ],
  },

  // Reports Menu
  {
    title: "Reports",
    icon: "fa fa-tasks",
    collapseId: "reports-menu",
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "DOCTOR",
      "RECEPTIONIST",
      "HEADNURSE",
      "LABORATORIST",
    ],
    children: [
      {
        title: "Add Birth Report",
        path: "/dashboard/add-birth-report",
        permissions: ["BIRTH_REPORT_ADD"],
      },
      {
        title: "Manage Birth Reports",
        path: "/dashboard/manage-birth-reports",
        permissions: ["REPORT_LIST"],
      },
      {
        title: "Add Death Report",
        path: "/dashboard/add-death-report",
        permissions: ["DEATH_REPORT_ADD"],
      },
      {
        title: "Manage Death Reports",
        path: "/dashboard/manage-death-reports",
        permissions: ["REPORT_LIST"],
      },

      {
        title: "Add Lab Report",
        path: "/dashboard/add-lab-report",
        permissions: ["PATHLAB_REPORT_ADD", "RADIOLOGY_REPORT_ADD"],
      },
      {
        title: "Manage Lab Reports",
        path: "/dashboard/manage-lab-reports",
        permissions: [
          "LAB_REPORT_LIST",
          "PATHLAB_REPORT_MANAGE",
          "RADIOLOGY_REPORT_MANAGE",
        ],
      },
    ],
  },

  // Prescriptions Menu
  {
    title: "Prescriptions",
    icon: "fa fa-prescription-bottle-alt",
    collapseId: "prescriptions-menu",
    roles: ["SUPER_ADMIN", "ADMIN", "DOCTOR", "RECEPTIONIST", "HEADNURSE"],
    children: [
      {
        title: "Add Prescription",
        path: "/dashboard/add-prescription",
        permissions: ["PRESCRIPTION_ADD"],
      },
      {
        title: "Manage Prescriptions",
        path: "/dashboard/manage-prescriptions",
        permissions: ["PRESCRIPTION_LIST", "PRESCRIPTION_UPDATE"],
      },
    ],
  },

  // Insurance Management Menu
  {
    title: "Insurance",
    icon: "fa fa-shield-alt",
    collapseId: "insurance-menu",
    roles: ["SUPER_ADMIN", "ADMIN", "RECEPTIONIST", "INSURANCE"],
    children: [
      {
        title: "Add Claim",
        path: "/dashboard/add-insurance-claim",
        permissions: ["CLAIM_SUBMIT"],
      },
      {
        title: "Manage Claims",
        path: "/dashboard/manage-insurance-claims",
        permissions: ["CLAIM_STATUS_TRACK", "INSURANCE_REPORTS"],
      },
    ],
  },

  // Ambulance Management Menu

  {
    title: "Ambulance Manager",
    icon: "fa fa-ambulance",
    collapseId: "ambulance-menu",
    roles: ["SUPER_ADMIN", "ADMIN", "RECEPTIONIST"],
    children: [
      {
        title: "Add Ambulance",
        path: "/dashboard/add-ambulance",
        permissions: ["AMBULANCE_ADD"],
      },
      {
        title: "Ambulances Dashboard",
        path: "/dashboard/ambulance-dashboard",
        permissions: ["AMBULANCE_AVAILABILITY", "AMBULANCE_VIEW"],
      },
      {
        title: "Ambulance Assignment",
        path: "/dashboard/ambulance-assignment",
        permissions: ["AMBULANCE_ASSIGNMENT"],
      },
      {
        title: "Add Driver",
        path: "/dashboard/add-driver",
        permissions: ["DRIVER_ADD"],
      },
    ],
  },
  // Blood Bank Management Menu

  {
    title: "Blood Bank",
    icon: "fa fa-tint",
    collapseId: "blood-bank-menu",
    roles: ["SUPER_ADMIN", "ADMIN", "RECEPTIONIST", "HEADNURSE"],
    children: [
      {
        title: "Add Donor",
        path: "/dashboard/add-blood-donor",
        permissions: ["DONOR_ADD"],
      },
      {
        title: "Manage Donors",
        path: "/dashboard/manage-blood-donors",
        permissions: ["DONOR_LIST"],
      },
      {
        title: "Add Blood Stock",
        path: "/dashboard/add-blood-stock",
        permissions: ["BLOOD_STOCK_ADD"],
      },
      {
        title: "Manage Blood Stock",
        path: "/dashboard/manage-blood-stock",
        permissions: ["BLOOD_STOCK_VIEW", "BLOOD_STOCK_UPDATE"],
      },
    ],
  },

  // Asset Management Menu
  {
    title: "Asset management",
    icon: "fa fa-desktop",
    collapseId: "asset-menu",
    roles: ["SUPER_ADMIN", "ADMIN", "HR"],
    children: [
      {
        title: "Add Asset",
        path: "/dashboard/add-asset",
        permissions: ["ASSET_ADD"],
      },
      {
        title: "Manage Assets",
        path: "/dashboard/manage-assets",
        permissions: ["ASSET_VIEW", "ASSET_UPDATE"],
      },
    ],
  },
  //Health Package Management Menu
  {
    title: "Health Packages",
    icon: "fa fa-briefcase",
    collapseId: "health-packages-menu",
    roles: ["SUPER_ADMIN", "ADMIN", "HR", "DOCTOR", "RECEPTIONIST"],
    children: [
      {
        title: "Add Health Package",
        path: "/dashboard/add-health-package",
        permissions: ["HEALTH_PACKAGE_ADD"],
      },
      {
        title: "Manage Health Packages",
        path: "/dashboard/manage-health-packages",
        permissions: ["HEALTH_PACKAGE_LIST", "HEALTH_PACKAGE_MANAGE"],
      },
    ],
  },

  //Pharmacy Management Menu
  {
    title: "Pharmacy",
    icon: "fa fa-pills",
    path: "/dashboard/pharmacy-management",
    roles: ["SUPER_ADMIN", "ADMIN", "PHARMACIST"],
    permissions: [
      "MEDICINE_ADD",
      "MEDICINE_UPDATE",
      "MEDICINE_STOCK_VIEW",
      "PRESCRIPTION_DISPENSE",
      "PHARMACY_BILL_GENERATE",
    ],
  },

  // Settings Menu
  {
    title: "Settings",
    icon: "fa fa-cog",
    collapseId: "settings-menu",
    roles: ["SUPER_ADMIN", "ADMIN", "HR"],
    children: [
      {
        title: "System Settings",
        path: "/dashboard/system-settings",
        permissions: ["SYSTEM_SETTINGS_MANAGE"],
      },
    ],
  },
];

export default sidebarMenu;
