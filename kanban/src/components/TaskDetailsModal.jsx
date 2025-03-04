import React from "react";
import { X, Edit, Trash2, Calendar, Flag, Clock } from "lucide-react";
import { PRIORITY_COLORS } from "../config";
import { formatDistanceToNow } from "date-fns";

const TaskDetailsModal = ({
  task,
  onClose,
  onEdit,
  onDelete,
  onToggleSubtask,
}) => {
  const completedSubtasks = task.subtasks.filter((st) => st.completed).length;
  const totalSubtasks = task.subtasks.length;
  const progress =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
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

        <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle dark:bg-gray-800">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:bg-gray-800"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div>
            <div className="flex items-start justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {task.title}
              </h3>
              <div className="me-6 flex space-x-2">
                <button
                  onClick={onEdit}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={onDelete}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-4 flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}
                >
                  <Flag className="mr-1 h-3 w-3" />
                  {task.priority}
                </span>

                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                  Status: {task.status}
                </span>

                {task.deadline && (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    <Calendar className="mr-1 h-3 w-3" />
                    {new Date(task.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>

              {task.description && (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-50">
                  <p>{task.description}</p>
                </div>
              )}

              {task.subtasks.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Subtasks ({completedSubtasks}/{totalSubtasks})
                  </h4>

                  <div className="mt-2 h-2.5 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2.5 rounded-full bg-indigo-600"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <ul className="mt-4 space-y-3">
                    {task.subtasks.map((subtask) => (
                      <li key={subtask._id} className="flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id={`subtask-${subtask._id}`}
                            type="checkbox"
                            checked={subtask.completed}
                            onChange={(e) =>
                              onToggleSubtask(
                                task._id,
                                subtask._id,
                                e.target.checked,
                              )
                            }
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <label
                          htmlFor={`subtask-${subtask._id}`}
                          className={`ml-3 text-sm dark:text-gray-100 ${subtask.completed ? "text-gray-400 line-through" : "text-gray-700"}`}
                        >
                          {subtask.title}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 flex items-center text-xs text-gray-500 dark:text-gray-50">
                <Clock className="mr-1 h-3 w-3" />
                Created{" "}
                {formatDistanceToNow(new Date(task.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>

            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:text-sm"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
