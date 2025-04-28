"use client";

import NavBar from "@/app/Components/NavBar/NavBar";
import { useState } from "react";
import { FiPlus, FiCalendar, FiAlignLeft, FiType,FiActivity } from "react-icons/fi";

function AddTaskPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");

  const handleAddTask = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem("userID"); 
      const response = await fetch("https://task-manager-pied-sigma-54.vercel.app/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          title, 
          description, 
          due_date: dueDate, 
          status,
          user_id: userId 
        }),
      });

      if (response.ok) {
        alert("Task added successfully");
        setTitle("");
        setDescription("");
        setDueDate("");
        setStatus("");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to add task");
      }
    } catch (error) {
      alert("An error occurred while adding the task");
      console.error("Error:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-md mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <FiPlus className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Add New Task</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
          <form onSubmit={handleAddTask} className="space-y-6">
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FiType className="mr-2" />
                Task Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
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
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
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
                value={status}
                onChange={(e) => setStatus(e.target.value)}
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
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddTaskPage;