import api from './api';

// Auth APIs
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.get('/auth/logout');
export const getMe = () => api.get('/auth/me');
export const updateDetails = (data) => api.put('/auth/updatedetails', data);
export const updatePassword = (data) => api.put('/auth/updatepassword', data);

// Drive APIs
export const getDrives = (params) => api.get('/drives', { params });
export const getDrive = (id) => api.get(`/drives/${id}`);
export const getEligibleDrives = () => api.get('/drives/student/eligible');
export const createDrive = (data) => api.post('/drives', data);
export const updateDrive = (id, data) => api.put(`/drives/${id}`, data);
export const deleteDrive = (id) => api.delete(`/drives/${id}`);
export const togglePublish = (id) => api.patch(`/drives/${id}/publish`);
export const closeDrive = (id) => api.patch(`/drives/${id}/close`);
export const getMyDrives = () => api.get('/drives/me/my-drives');
export const getEligibleStudents = (id) => api.get(`/drives/${id}/eligible-students`);

// Application APIs
export const applyToDrive = (data) => api.post('/applications', data);
export const getMyApplications = () => api.get('/applications/my-applications');
export const getApplicationsForDrive = (driveId, params) => 
  api.get(`/applications/drive/${driveId}`, { params });
export const getApplication = (id) => api.get(`/applications/${id}`);
export const updateApplicationStatus = (id, data) => 
  api.put(`/applications/${id}/status`, data);
export const bulkUpdateStatus = (data) => api.post('/applications/bulk-update', data);
export const scheduleInterview = (id, data) => 
  api.post(`/applications/${id}/schedule-interview`, data);
export const addFeedback = (id, data) => api.post(`/applications/${id}/feedback`, data);
export const withdrawApplication = (id) => api.delete(`/applications/${id}`);
export const getApplicationStats = (driveId) => api.get(`/applications/stats/${driveId}`);

// Student APIs
export const getMyProfile = () => api.get('/students/profile');
export const updateProfile = (data) => api.put('/students/profile', data);
export const getStudents = (params) => api.get('/students', { params });
export const getStudentProfile = (id) => api.get(`/students/${id}`);
export const addSkills = (skills) => api.post('/students/profile/skills', { skills });
export const removeSkill = (skill) => api.delete(`/students/profile/skills/${skill}`);
