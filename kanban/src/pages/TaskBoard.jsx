import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { API_URL, TASK_STATUSES } from "../config";
import {
  Plus,
  ChevronLeft,
  MoreVertical,
  Calendar,
  Clock,
  Flag,
} from "lucide-react";
import Layout from "../components/Layout";
import CreateTaskModal from "../components/CreateTaskModal";
import TaskDetailsModal from "../components/TaskDetailsModal";
import { formatDistanceToNow } from "date-fns";
import { PRIORITY_COLORS } from "../config";

const TaskBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState({
    [TASK_STATUSES.PENDING]: [],
    [TASK_STATUSES.IN_PROGRESS]: [],
    [TASK_STATUSES.COMPLETED]: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);

  useEffect(() => {
    if (id) {
      fetchBoardAndTasks();
    }
  }, [id]);

  const fetchBoardAndTasks = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Fetch board details
      const boardResponse = await axios.get(`${API_URL}/api/boards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBoard(boardResponse.data);

      // Fetch tasks for this board
      const tasksResponse = await axios.get(
        `${API_URL}/api/boards/${id}/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Group tasks by status
      const groupedTasks = {
        [TASK_STATUSES.PENDING]: [],
        [TASK_STATUSES.IN_PROGRESS]: [],
        [TASK_STATUSES.COMPLETED]: [],
      };

      tasksResponse.data.forEach((task) => {
        if (groupedTasks[task.status]) {
          groupedTasks[task.status].push(task);
        } else {
          groupedTasks[TASK_STATUSES.PENDING].push(task);
        }
      });

      setTasks(groupedTasks);
    } catch (error) {
      toast.error("Failed to fetch board data");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveTask = async (
    taskId,
    sourceStatus,
    destinationStatus,
    sourceIndex,
    destinationIndex,
  ) => {
    // Create a copy of the tasks
    const newTasks = { ...tasks };

    // Find the task
    const taskToMove = newTasks[sourceStatus][sourceIndex];

    // Remove the task from the source column
    newTasks[sourceStatus].splice(sourceIndex, 1);

    // Add the task to the destination column with updated status
    newTasks[destinationStatus].splice(destinationIndex, 0, {
      ...taskToMove,
      status: destinationStatus,
    });

    // Update the UI immediately
    setTasks(newTasks);

    // Update the task status in the backend
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/api/tasks/${taskId}`,
        { status: destinationStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      toast.error("Failed to update task status");
      // Revert the UI change if the API call fails
      fetchBoardAndTasks();
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/boards/${id}/tasks`,
        taskData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const newTask = response.data;

      setTasks({
        ...tasks,
        [newTask.status]: [...tasks[newTask.status], newTask],
      });

      setShowTaskModal(false);
      toast.success("Task created successfully");
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/tasks/${taskId}`,
        taskData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const updatedTask = response.data;

      // Find the status where the task currently exists
      let currentStatus = "";
      for (const status in tasks) {
        if (tasks[status].some((task) => task._id === taskId)) {
          currentStatus = status;
          break;
        }
      }

      if (currentStatus === updatedTask.status) {
        // If status hasn't changed, just update the task in place
        setTasks({
          ...tasks,
          [currentStatus]: tasks[currentStatus].map((task) =>
            task._id === taskId ? updatedTask : task,
          ),
        });
      } else {
        // If status has changed, remove from old status and add to new one
        setTasks({
          ...tasks,
          [currentStatus]: tasks[currentStatus].filter(
            (task) => task._id !== taskId,
          ),
          [updatedTask.status]: [...tasks[updatedTask.status], updatedTask],
        });
      }

      setEditingTask(null);
      toast.success("Task updated successfully");
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Find and remove the task from the appropriate status column
      for (const status in tasks) {
        if (tasks[status].some((task) => task._id === taskId)) {
          setTasks({
            ...tasks,
            [status]: tasks[status].filter((task) => task._id !== taskId),
          });
          break;
        }
      }

      setViewingTask(null);
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleToggleSubtask = async (taskId, subtaskId, completed) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/api/tasks/${taskId}/subtasks/${subtaskId}`,
        { completed },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Update the task in the UI
      for (const status in tasks) {
        const taskIndex = tasks[status].findIndex(
          (task) => task._id === taskId,
        );
        if (taskIndex !== -1) {
          const updatedTasks = { ...tasks };
          const task = { ...updatedTasks[status][taskIndex] };

          task.subtasks = task.subtasks.map((subtask) =>
            subtask._id === subtaskId ? { ...subtask, completed } : subtask,
          );

          updatedTasks[status][taskIndex] = task;
          setTasks(updatedTasks);

          // Also update the viewing task if it's open
          if (viewingTask && viewingTask._id === taskId) {
            setViewingTask({
              ...viewingTask,
              subtasks: viewingTask.subtasks.map((subtask) =>
                subtask._id === subtaskId ? { ...subtask, completed } : subtask,
              ),
            });
          }

          break;
        }
      }
    } catch (error) {
      toast.error("Failed to update subtask");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500"></div>
        </div>
      </Layout>
    );
  }

  if (!board) {
    return (
      <Layout>
        <div className="py-12 text-center">
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Board not found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            The board you're looking for doesn't exist or you don't have access
            to it.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
            >
              <ChevronLeft className="mr-2 -ml-1 h-5 w-5" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/")}
                className="mr-4 text-gray-500 hover:text-gray-600 dark:text-gray-300"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {board.title}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {board.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowTaskModal(true)}
              className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none md:mt-0"
            >
              <Plus className="mr-2 -ml-1 h-5 w-5" />
              Add Task
            </button>
          </div>

          <div className="mt-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {Object.keys(tasks).map((status) => (
                <div
                  key={status}
                  className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
                >
                  <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                    {status} ({tasks[status].length})
                  </h2>

                  <div className="min-h-[200px] space-y-3">
                    {tasks[status].map((task, index) => (
                      <div
                        key={task._id}
                        className="cursor-pointer rounded-md bg-white p-4 shadow transition-shadow hover:shadow-md dark:bg-gray-700"
                        onClick={() => setViewingTask(task)}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("taskId", task._id);
                          e.dataTransfer.setData("sourceStatus", status);
                          e.dataTransfer.setData("sourceIndex", index);
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const taskId = e.dataTransfer.getData("taskId");
                          const sourceStatus =
                            e.dataTransfer.getData("sourceStatus");
                          const sourceIndex = parseInt(
                            e.dataTransfer.getData("sourceIndex"),
                          );

                          // Only process if dropping in a different position
                          if (
                            sourceStatus !== status ||
                            sourceIndex !== index
                          ) {
                            handleMoveTask(
                              taskId,
                              sourceStatus,
                              status,
                              sourceIndex,
                              index,
                            );
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {task.title}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingTask(task);
                            }}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>

                        {task.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-300">
                            {task.description}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2">
                          {task.priority && (
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}
                            >
                              <Flag className="mr-1 h-3 w-3" />
                              {task.priority}
                            </span>
                          )}

                          {task.deadline && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                              <Calendar className="mr-1 h-3 w-3" />
                              {new Date(task.deadline).toLocaleDateString()}
                            </span>
                          )}

                          {task.subtasks.length > 0 && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                              {
                                task.subtasks.filter((st) => st.completed)
                                  .length
                              }
                              /{task.subtasks.length} subtasks
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDistanceToNow(new Date(task.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    ))}

                    {tasks[status].length === 0 && (
                      <div
                        className="rounded-md border-2 border-dashed border-gray-200 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const taskId = e.dataTransfer.getData("taskId");
                          const sourceStatus =
                            e.dataTransfer.getData("sourceStatus");
                          const sourceIndex = parseInt(
                            e.dataTransfer.getData("sourceIndex"),
                          );

                          // Only process if dropping in a different column
                          if (sourceStatus !== status) {
                            handleMoveTask(
                              taskId,
                              sourceStatus,
                              status,
                              sourceIndex,
                              0,
                            );
                          }
                        }}
                      >
                        No tasks
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showTaskModal && (
        <CreateTaskModal
          onClose={() => setShowTaskModal(false)}
          onSubmit={handleCreateTask}
          boardId={id || ""}
        />
      )}

      {editingTask && (
        <CreateTaskModal
          onClose={() => setEditingTask(null)}
          onSubmit={(data) => handleUpdateTask(editingTask._id, data)}
          boardId={id || ""}
          task={editingTask}
          isEditing={true}
        />
      )}

      {viewingTask && (
        <TaskDetailsModal
          task={viewingTask}
          onClose={() => setViewingTask(null)}
          onEdit={() => {
            setEditingTask(viewingTask);
            setViewingTask(null);
          }}
          onDelete={() => handleDeleteTask(viewingTask._id)}
          onToggleSubtask={handleToggleSubtask}
        />
      )}
    </Layout>
  );
};

export default TaskBoard;
