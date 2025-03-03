import React, { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { TASK_STATUSES, PRIORITY_LEVELS } from "../config";

const CreateTaskModal = ({
  onClose,
  onSubmit,
  boardId,
  boardCreatedAt,
  task,
  isEditing = false,
}) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || TASK_STATUSES.PENDING);
  const [priority, setPriority] = useState(
    task?.priority || PRIORITY_LEVELS.MEDIUM,
  );
  const [deadline, setDeadline] = useState(task?.deadline || "");
  const [subtasks, setSubtasks] = useState(
    task?.subtasks
      ? task.subtasks.map((st) => ({
          id: st._id,
          title: st.title,
          completed: st.completed,
        }))
      : [],
  );
  const [errors, setErrors] = useState({});

  const handleAddSubtask = () => {
    setSubtasks([
      ...subtasks,
      { id: `new-${Date.now()}`, title: "", completed: false },
    ]);
  };

  const handleRemoveSubtask = (index) => {
    const newSubtasks = [...subtasks];
    newSubtasks.splice(index, 1);
    setSubtasks(newSubtasks);
  };

  const handleSubtaskChange = (index, value) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index].title = value;
    setSubtasks(newSubtasks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    if (deadline && new Date(deadline) < new Date(boardCreatedAt)) {
      newErrors.deadline = "Deadline cannot be before board creation date";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const taskData = {
      title,
      description,
      status,
      priority,
      deadline: deadline || null,
      subtasks: subtasks
        .filter((st) => st.title.trim() !== "")
        .map((st) => ({
          _id: st.id.startsWith("new-") ? undefined : st.id,
          title: st.title,
          completed: st.completed || false,
        })),
    };

    onSubmit(taskData);
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto bg-gray-900/50">
      <div className="w-full max-w-lg rounded-lg bg-gray-800 p-6 text-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-700 pb-3">
          <h3 className="text-lg font-medium">
            {isEditing ? "Edit Task" : "Create New Task"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full rounded-md border bg-gray-700 p-2 text-white focus:ring focus:outline-none ${errors.title ? "border-red-500" : "border-gray-600"}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white focus:ring focus:outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                className="w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white focus:ring focus:outline-none"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {Object.values(TASK_STATUSES).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Priority</label>
              <select
                className="w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white focus:ring focus:outline-none"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                {Object.values(PRIORITY_LEVELS).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Deadline</label>
            <input
              type="date"
              className={`w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white focus:ring focus:outline-none ${errors.deadline ? "border-red-500" : ""}`}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            {errors.deadline && (
              <p className="text-sm text-red-500">{errors.deadline}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Subtasks</label>
            <button
              type="button"
              onClick={handleAddSubtask}
              className="text-indigo-400 hover:underline"
            >
              <Plus className="mr-1 inline h-4 w-4" /> Add Subtask
            </button>
            <div className="mt-2 space-y-2">
              {subtasks.map((subtask, index) => (
                <div key={subtask.id} className="flex items-center space-x-2">
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white focus:ring focus:outline-none"
                    value={subtask.title}
                    onChange={(e) => handleSubtaskChange(index, e.target.value)}
                  />
                  <button
                    onClick={() => handleRemoveSubtask(index)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
            >
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
