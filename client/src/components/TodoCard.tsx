import { FilePenLine, Trash2 } from "lucide-react";
import { Todo } from "../pages/Home";
import React, { use, useEffect, useState } from "react";
import Modal from "./ui/Modal";
import { TaskFormState } from "./ui/Modal";
import { deleteTask, updateTask } from "../api";
import toast from "react-hot-toast";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import axios from "axios";
import { cn } from "../lib/utils";

interface Props {
  todo: Todo;
  refetch: () => void;
}
const TodoCard = ({ todo, refetch }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [createdBy, setCreatedBy] = useState<string>();
  const [assignedTo, setAssignedTo] = useState<string>();
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const currentUser = useSelector((state: RootState) => state.users.user);
  const sidebar = useSelector((state: RootState) => state.sidebar);

  const handleDelete = async () => {
    try {
      await deleteTask(todo.id);
      refetch();
      toast.success("Task deleted");
    } catch (err: any) {
      const errorMessage = err?.response?.data.message;
      toast.error(errorMessage ? errorMessage : "Error deleting task");
      console.log(err);
    }
  };
  const handleSave = async ({
    title,
    description,
    dueDate,
    priority,
    status,
    assignedToId,
  }: {
    title: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
    assignedToId: string;
  }) => {
    try {
      await updateTask({
        title,
        description,
        taskId: todo.id,
        dueDate,
        priority,
        status,
        assignedToId,
      });
      refetch();
      setIsModalOpen(false);
      toast.success("Updated successfully");
    } catch (err: any) {
      const errorMessage = err?.response?.data.message;
      toast.error(errorMessage ? errorMessage : "Error updating task");
      console.log(err);
    }
  };

  useEffect(() => {
    const getUserById = (id: string) =>
      axios.get(`${process.env.REACT_APP_SERVER_URL}/api/users/${id}`);

    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        // set creator username
        if (todo.createdById && todo.createdById === currentUser?.userId) {
          setCreatedBy(currentUser?.username);
        }
        if (todo.createdById && todo.createdById !== currentUser?.userId) {
          const creator = await getUserById(todo.createdById);
          setCreatedBy(creator.data.username);
        }

        // set assigned user
        if (todo.assignedToId && todo.assignedToId === currentUser?.userId) {
          setAssignedTo(currentUser?.username);
        }
        if (todo.assignedToId && todo.assignedToId !== currentUser?.userId) {
          const assignee = await getUserById(todo.assignedToId);
          console.log({ assignee, id: todo.assignedToId });
          setAssignedTo(assignee.data.username);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [todo.createdById, todo.assignedToId, currentUser]);

  return (
    <>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          isCreator={todo.createdById === currentUser?.userId}
          initialData={todo}
        />
      )}
      <div
        className={cn("relative z-10 h-28 w-full rounded-md bg-blue-50 p-4", {
          "bg-yellow-200": todo.status === "in_progress",
          "bg-green-200": todo.status === "done",
          "-z-10": sidebar,
        })}
      >
        <div className="flex items-center justify-between">
          <h5 className="text-xl">{todo.title}</h5>
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-neutral-700">
              Priority :{" "}
              <span className="text-xs italic text-neutral-500">
                {todo.priority}
              </span>
            </div>
            <div className="text-sm font-medium text-neutral-700">
              Status :{" "}
              <span className="text-xs italic text-neutral-500">
                {todo.status}
              </span>
            </div>
            <FilePenLine
              className="cursor-pointer text-neutral-500"
              onClick={() => setIsModalOpen(true)}
            />
            <Trash2
              className="cursor-pointer text-red-400"
              onClick={handleDelete}
            />
          </div>
        </div>
        <p className="line-clamp-2 text-sm text-neutral-700">
          {todo.description}
        </p>
        <div className="absolute bottom-2 left-0 flex w-full items-center justify-between px-5 text-xs italic text-neutral-500">
          <div className="flex gap-3">
            <p>Created By: {createdBy}</p>
            <p>{assignedTo ? `Assigned to: ${assignedTo}` : ""}</p>
          </div>
          <p>Update at: {new Date(todo.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </>
  );
};

export default TodoCard;
