import axios from "axios";

export const fetchColumns = () => axios.get("/columns");
export const fetchColumnsByProject = (id:string) => axios.get(`/columns/project/${id}`)
export const createColumn = (data: { title: string }) =>
  axios.post("/columns", data);
export const updateColumn = (id: string, data: { title?: string }) =>
  axios.patch(`/columns/${id}`, data);
export const deleteColumn = (id: string) =>
  axios.delete(`/columns/${id}`);
