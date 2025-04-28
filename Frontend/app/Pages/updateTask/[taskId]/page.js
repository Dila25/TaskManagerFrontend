"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import NavBar from "@/app/Components/NavBar/NavBar";
import { FiPlus, FiCalendar, FiAlignLeft, FiType,FiActivity } from "react-icons/fi";
function UpdateTaskPage() {
  const { taskId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`https://task-manager-pied-sigma-54.vercel.app/api/task/${taskId}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            title: data.title,
            description: data.description,
            due_date: data.due_date,
            status: data.status,
          });
        } else {
          alert("Failed to fetch task details");
        }
      } catch (error) {
        console.error("Error fetching task:", error);
        alert("An error occurred while fetching task details");
      }
    };
    fetchTask();
  }, [taskId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://task-manager-pied-sigma-54.vercel.app/api/task/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Task updated successfully");
        router.push("/Pages/allTask");
      } else {
        alert("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("An error occurred while updating the task");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
    <NavBar />

    <div className="max-w-md mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <FiPlus className="h-8 w-8 text-indigo-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Update Task</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FiType className="mr-2" />
              Task Title
            </label>
            <input
            name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FiAlignLeft className="mr-2" />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              name="description"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter task description"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FiCalendar className="mr-2" />
              Due Date
            </label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FiActivity className="mr-2" />
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select status</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
}

export default UpdateTaskPage;
