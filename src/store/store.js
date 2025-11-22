import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import forgotPasswordReducer from "../features/forgotPasswordSlice";
import statesReducer from "../features/statesSlice";
import employeeReducer from "../features/employeeSlice";
import departmentReducer from "../features/departmentSlice";
import assetsReducer from "../features/assetsSlice";
import healthPackageReducer from "../features/healthPackageSlice";
import birthAndDethReducer from "../features/birthAndDethSlice";
import doctorScheduleReducer from "../features/doctorScheduleSlice";
import bedReducer from "../features/bedSlice";
import ambulanceReducer from "../features/ambulanceSlice";
import bedManagerReducer from "../features/bedManagerSlice";
import priscriptionReducer from "../features/priscriptionSlice";
import noticeReducer from "../features/noticeSlice";
import commanReducer from "../features/commanSlice";
import appointmentReducer from "../features/appointmentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    forgotPassword: forgotPasswordReducer,
    states: statesReducer,
    employee: employeeReducer,
    departments: departmentReducer,
    assets: assetsReducer,
    healthPackages: healthPackageReducer,
    birthAndDeth: birthAndDethReducer,
    doctorSchedule: doctorScheduleReducer,
    beds: bedReducer,
    bedManager: bedManagerReducer,
    ambulance: ambulanceReducer,
    priscription: priscriptionReducer,
    notice: noticeReducer,
    comman: commanReducer,
    appointment: appointmentReducer,
  },
});

export default store;
