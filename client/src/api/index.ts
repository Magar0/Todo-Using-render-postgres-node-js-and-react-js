import axios from "axios";

const URL = process.env.REACT_APP_SERVER_URL;
const API = axios.create({ baseURL: URL });

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

export const findTask = (id: string) => API.get(`/api/task/${id}`);

export const deleteTask = (id: string) => API.delete(`/api/task/${id}`);
