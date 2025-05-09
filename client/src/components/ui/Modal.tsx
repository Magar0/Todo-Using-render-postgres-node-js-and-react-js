import React, { FormEvent, useEffect, useReducer, useState } from "react";
import { getAllUsers } from "../../api";
import toast from "react-hot-toast";
import { Priority, Status } from "../../pages/Home";

export type TaskFormState = {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  assignedToId?: string;
};
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: any) => void;
  isCreator?: boolean;
  initialData?: Partial<TaskFormState>;
};

const initialState: TaskFormState = {
  title: "",
  description: "",
  dueDate: "",
  priority: "low",
  status: "todo",
  assignedToId: "",
};

type Action =
  | { type: "SET_TITLE"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_DUE_DATE"; payload: string }
  | { type: "SET_PRIORITY"; payload: Priority }
  | { type: "SET_STATUS"; payload: Status }
  | { type: "SET_ASSIGNEE"; payload: string }
  | { type: "RESET" };

function reducer(state: TaskFormState, action: Action): TaskFormState {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.payload };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "SET_DUE_DATE":
      return { ...state, dueDate: action.payload };
    case "SET_PRIORITY":
      return { ...state, priority: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "SET_ASSIGNEE":
      return { ...state, assignedToId: action.payload };
    case "RESET":
      return { ...initialState };
    default:
      return state;
  }
}

const Modal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isCreator,
}: ModalProps) => {
  const [users, setUsers] = useState<{ id: string; username: string }[]>([]);
  const [state, dispatch] = useReducer(reducer, initialState, () => ({
    ...initialState,
    ...(initialData || {}),
  }));

  console.log({ state });

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      console.log(response);

      const userData = response.data.map((item, ind) => ({
        id: item.id,
        username: item.username,
      }));
      setUsers(userData);
    } catch (err) {
      toast.error("Error while fetching users");
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(state);
    // Reset the form state after saving
    dispatch({ type: "RESET" });
    onClose();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (!isOpen) return null;
  console.log({ test: state.dueDate.slice(0, 10) });
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        // onClick={onClose}
      ></div>

      {/* Modal container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="inline-block w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-5 shadow-xl transition-all">
          <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <div className="col-span-2">
              <label htmlFor="title">Title*</label>
              <input
                className="w-full"
                type="text"
                id="title"
                name="title"
                disabled={!isCreator}
                required
                value={state.title}
                onChange={(e) =>
                  dispatch({ type: "SET_TITLE", payload: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="description">Description*</label>
              <textarea
                rows={5}
                className="w-full"
                id="description"
                name="description"
                disabled={!isCreator}
                required
                value={state.description}
                onChange={(e) =>
                  dispatch({ type: "SET_DESCRIPTION", payload: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="due-date">Due Date</label>
              <input
                className="w-full"
                type="date"
                id="due-date"
                name="dueDate"
                value={state.dueDate.slice(0, 10)}
                disabled={!isCreator}
                onChange={(e) =>
                  dispatch({ type: "SET_DUE_DATE", payload: e.target.value })
                }
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="priority">Priority</label>
              <select
                name="priority"
                className="cursor-pointer rounded-md border border-gray-300 px-3 py-2"
                id="priority"
                value={state.priority}
                disabled={!isCreator}
                onChange={(e) =>
                  dispatch({
                    type: "SET_PRIORITY",
                    payload: e.target.value as Priority,
                  })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="col-span-1">
              <label htmlFor="priority">Status</label>
              <select
                name="status"
                id="status"
                className="cursor-pointer rounded-md border border-gray-300 px-3 py-2"
                value={state.status}
                onChange={(e) =>
                  dispatch({
                    type: "SET_STATUS",
                    payload: e.target.value as Status,
                  })
                }
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label htmlFor="asignTo">Assign To</label>
              <select
                className="cursor-pointer rounded-md border border-gray-300 px-3 py-2"
                name="assignedToId"
                id="assignTo"
                value={state.assignedToId}
                onChange={(e) =>
                  dispatch({
                    type: "SET_ASSIGNEE",
                    payload: e.target.value,
                  })
                }
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 flex justify-end gap-3 border-t bg-gray-50 px-4 sm:px-6">
              <button
                className="btn custom-btn"
                type="button"
                onClick={onClose}
              >
                Close
              </button>
              <button className="btn custom-btn" type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
