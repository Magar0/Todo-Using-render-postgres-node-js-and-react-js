import TodoCard from "../components/TodoCard";
import { createTask, getAllTasks } from "../api";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Modal from "../components/ui/Modal";
import toast from "react-hot-toast";

export interface Todo {
  id: string;
  title: string;
  description: string;
  userId: string;
  done: string;
  createdAt: string;
  updatedAt: string;
}

const Home = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
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

  const handleSave = async ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    try {
      await createTask({ title, description });
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

  return (
    <section className="container mx-auto px-5 py-3">
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
      <div className="flex items-center justify-between">
        <h3 className="mb-5 text-xl">All todos</h3>
        <button
          className="btn flex bg-green-300 text-white"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus /> Add
        </button>
      </div>
      <div className="flex flex-col gap-5">
        {todos.map((todo, ind) => (
          <TodoCard todo={todo} key={ind} refetch={fetchTasks} />
        ))}
      </div>
    </section>
  );
};

export default Home;
