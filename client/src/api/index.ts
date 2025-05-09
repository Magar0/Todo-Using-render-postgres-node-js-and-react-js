import axios from "axios";

const URL = process.env.REACT_APP_SERVER_URL;
const API = axios.create({ baseURL: URL });

interface User {
  id: string;
  email: string;
  username: string;
}

API.interceptors.request.use((req) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }
  } catch (err) {
    console.log(err);
    //
  }
  return req;
});

// tasks
export const createTask = (data: any) => API.post("/api/task", data);

export const updateTask = (data: any) =>
  API.put(`/api/task/${data.taskId}`, data);

export const getAllTasks = () => API.get("/api/task");

export const getAssignedTasks = () => API.get("/api/task/assignedTask");

export const findTask = (id: string) => API.get(`/api/task/${id}`);

export const deleteTask = (id: string) => API.delete(`/api/task/${id}`);

export const getAllUsers = () => API.get<User[]>("/api/users");

export const updateNotification = (notificationId: string) =>
  API.put("/api/notification", { notificationId });

export const getNotifications = () => API.get("/api/notification");
