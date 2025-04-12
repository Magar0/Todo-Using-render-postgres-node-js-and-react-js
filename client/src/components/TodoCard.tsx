import { FilePenLine, Trash2 } from "lucide-react";
import { Todo } from "../pages/Home";
import React, { useState } from "react";
import Modal from "./ui/Modal";
import { deleteTask, updateTask } from "../api";
import toast from "react-hot-toast";

interface Props {
  todo: Todo;
  refetch: () => void;
}
const TodoCard = ({ todo, refetch }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
  }: {
    title: string;
    description: string;
  }) => {
    try {
      await updateTask({
        title,
        description,
        taskId: todo.id,
        updatedAt: new Date().toLocaleDateString(),
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

  return (
    <>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          title={todo.title}
          description={todo.description}
        />
      )}
      <div className="relative h-28 w-full rounded-md bg-blue-50 p-4">
        <div className="flex items-center justify-between">
          <h5 className="text-xl">{todo.title}</h5>
          <div className="flex items-center gap-3">
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
        <p className="absolute bottom-2 right-5 text-xs italic text-neutral-500">
          Update at:{todo.updatedAt}
        </p>
      </div>
    </>
  );
};

export default TodoCard;
