"use client";

import { useRouter } from "next/navigation";
import NavBar from "@/app/Components/NavBar/NavBar";
import { useEffect, useState } from "react";
import { FiCalendar, FiCheckCircle, FiClock, FiList } from "react-icons/fi";

function AllTasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [currentUserID, setCurrentUserID] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const userID = localStorage.getItem("userID");
      setCurrentUserID(userID ? parseInt(userID) : null);
      try {
        const response = await fetch("https://task-manager-pied-sigma-54.vercel.app/api/task", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Filter tasks to only show those belonging to the current user
          const userTasks = data.filter(task => task.user_id === parseInt(userID));
          setTasks(userTasks);
        } else {
          alert("Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        alert("An error occurred while fetching tasks");
      }
    };
    fetchTasks();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`https://task-manager-pied-sigma-54.vercel.app/api/task/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId));
        alert("Task deleted successfully");
      } else {
        alert("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("An error occurred while deleting the task");
    }
  };

  const handleEdit = (taskId) => {
    router.push(`/Pages/updateTask/${taskId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <FiList className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tasks found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {task.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">{task.description}</p>

                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <FiCalendar className="mr-2" />
                    <span>Due: {formatDate(task.due_date)}</span>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm">
                    <FiClock className="mr-2" />
                    <span>Created: {formatDate(task.created_at)}</span>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                  <button
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    onClick={() => handleEdit(task.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllTasksPage;