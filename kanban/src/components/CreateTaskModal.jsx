import React, { useState } from "react";
import { X, Plus, Trash2, Calendar } from "lucide-react";
import { TASK_STATUSES, PRIORITY_LEVELS } from "../config";

const CreateTaskModal = ({
  onClose,
  onSubmit,
  boardId,
  task,
  isEditing = false,
}) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || TASK_STATUSES.PENDING);
  const [priority, setPriority] = useState(
    task?.priority || PRIORITY_LEVELS.MEDIUM,
  );
  const [deadlineDate, setDeadlineDate] = useState(
    task?.deadline ? new Date(task.deadline).toISOString().split("T")[0] : "",
  );

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

    // Validate
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Filter out empty subtasks
    const filteredSubtasks = subtasks.filter((st) => st.title.trim() !== "");

    const taskData = {
      title,
      description,
      status,
      priority,
      deadline: deadlineDate ? new Date(deadlineDate).toISOString() : null,
      subtasks: filteredSubtasks.map((st) => ({
        _id: st.id.startsWith("new-") ? undefined : st.id,
        title: st.title,
        completed: st.completed || false,
      })),
    };

    onSubmit(taskData);
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-900/50">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle dark:bg-gray-800 dark:text-white">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:bg-gray-800"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
              <h3 className="white:text-gray-900 text-lg leading-6 font-medium">
                {isEditing ? "Edit Task" : "Create New Task"}
              </h3>

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div>
                  <label
                    htmlFor="title"
                    className="white:white:text-gray-700 block text-sm font-medium"
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      className={`block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors.title ? "border-red-300" : ""
                      }`}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.title}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="white:text-gray-700 block text-sm font-medium"
                  >
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="status"
                      className="white:text-gray-700 block text-sm font-medium"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 pr-10 pl-3 text-base focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm dark:bg-gray-800"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      {Object.values(TASK_STATUSES).map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="priority"
                      className="white:text-gray-700 block text-sm font-medium"
                    >
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 pr-10 pl-3 text-base focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm dark:bg-gray-800"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      {Object.values(PRIORITY_LEVELS).map((priorityOption) => (
                        <option key={priorityOption} value={priorityOption}>
                          {priorityOption}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="deadline"
                    className="white:text-gray-700 block text-sm font-medium"
                  >
                    Deadline
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Calendar className="white:text-gray-400 h-5 w-5" />
                    </div>
                    <input
                      type="date"
                      id="deadline"
                      name="deadline"
                      className="block w-full rounded-md border border-gray-300 p-3 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={deadlineDate}
                      onChange={(e) => setDeadlineDate(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="white:text-gray-700 block text-sm font-medium">
                      Subtasks
                    </label>
                    <button
                      type="button"
                      onClick={handleAddSubtask}
                      className="inline-flex items-center rounded border border-transparent bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add Subtask
                    </button>
                  </div>

                  <div className="mt-2 space-y-2">
                    {subtasks.map((subtask, index) => (
                      <div key={subtask.id} className="flex items-center">
                        <input
                          type="text"
                          value={subtask.title}
                          onChange={(e) =>
                            handleSubtaskChange(index, e.target.value)
                          }
                          placeholder="Subtask title"
                          className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtask(index)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}

                    {subtasks.length === 0 && (
                      <p className="text-sm text-gray-500">
                        No subtasks added yet. Click "Add Subtask" to create
                        one.
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {isEditing ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    className="white:text-gray-700 white:hover:bg-gray-50 mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm dark:bg-gray-800 dark:hover:bg-gray-700"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
