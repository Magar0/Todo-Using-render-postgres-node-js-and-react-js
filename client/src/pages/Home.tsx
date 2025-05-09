import TodoCard from "../components/TodoCard";
import { createTask, getAllTasks, getAssignedTasks } from "../api";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Modal from "../components/ui/Modal";
import toast from "react-hot-toast";
import { cn } from "../lib/utils";

export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "in_progress" | "done";

export interface Todo {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  createdById: string;
  assignedToId: string;
  done: string;
  createdAt: string;
  updatedAt: string;
}

const Home = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [assignedTodos, setAssignedTodos] = useState<Todo[]>([]);
  const [tab, setTab] = useState<"todos" | "assigned">("todos");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchTasks = async () => {
    try {
      const res = await getAllTasks();
      setTodos(res.data);
    } catch (err) {
      toast.error("Error loading data");
      console.log(err);
    }
  };

  const fetchAssignedTasks = async () => {
    try {
      const res = await getAssignedTasks();
      setAssignedTodos(res.data);
    } catch (err) {
      toast.error("Error loading data");
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
      await createTask({
        title,
        description,
        dueDate,
        priority,
        status,
        assignedToId,
      });
      await fetchTasks();
      setIsModalOpen(false);
      toast.success("added successfully");
    } catch (err: any) {
      const errorMessage = err?.response?.data.message;
      toast.error(errorMessage ? errorMessage : "Error creating task");
      console.log(err);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (tab === "assigned" && !assignedTodos.length) {
      fetchAssignedTasks();
    }
  }, [tab]);

  return (
    <section className="container mx-auto px-5 py-3">
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          isCreator
        />
      )}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <button
            className={cn(
              "mb-5 border-b-2 border-transparent p-2 text-xl transition-all",
              {
                "border-gray-300": tab === "todos",
              },
            )}
            onClick={() => setTab("todos")}
          >
            All todos
          </button>
          <button
            className={cn(
              "mb-5 border-b-2 border-transparent p-2 text-xl transition-all",
              {
                "border-gray-300": tab === "assigned",
              },
            )}
            onClick={() => setTab("assigned")}
          >
            Assigned Todos
          </button>
        </div>
        {tab !== "assigned" && (
          <button
            className="btn flex bg-green-400 text-white hover:bg-green-300"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus /> Add
          </button>
        )}
      </div>
      <div className="flex flex-col gap-5">
        {tab === "assigned"
          ? assignedTodos.length === 0
            ? "No assigned todos"
            : assignedTodos.map((todo, ind) => (
                <TodoCard todo={todo} key={ind} refetch={fetchAssignedTasks} />
              ))
          : todos.length === 0
            ? "No todos"
            : todos.map((todo, ind) => (
                <TodoCard todo={todo} key={ind} refetch={fetchTasks} />
              ))}
      </div>
    </section>
  );
};

export default Home;
