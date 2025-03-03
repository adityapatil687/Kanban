import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { API_URL, TASK_STATUSES, PRIORITY_COLORS } from "../config";
import { formatDistanceToNow } from "date-fns";
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

      const boardResponse = await axios.get(`${API_URL}/api/boards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBoard(boardResponse.data);

      const tasksResponse = await axios.get(
        `${API_URL}/api/boards/${id}/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

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
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
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

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {Object.keys(tasks).map((status) => (
              <div key={status} className="rounded-lg bg-gray-50 p-4">
                <h2 className="mb-4 text-lg font-medium text-gray-900">
                  {status} ({tasks[status].length})
                </h2>
                {tasks[status].map((task) => (
                  <div
                    key={task._id}
                    className="cursor-pointer rounded-md bg-white p-4 shadow transition-shadow hover:shadow-md"
                    onClick={() => setViewingTask(task)}
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        {task.title}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTask(task);
                          setShowTaskModal(true); // Ensure modal opens
                        }}
                        className="text-gray-400 hover:text-gray-500 cursor-pointer"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                    {task.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">
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
                          {task.subtasks.filter((st) => st.completed).length}/
                          {task.subtasks.length} subtasks
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center text-xs text-gray-500">
                      <Clock className="mr-1 h-3 w-3" />
                      {formatDistanceToNow(new Date(task.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showTaskModal && (
        <CreateTaskModal
          onSubmit={handleCreateTask}
          boardId={id}
          onClose={() => setShowTaskModal(false)}
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
            setShowTaskModal(true); // Ensure modal opens
          }}
          onDelete={() => handleDeleteTask(viewingTask._id)}
          onToggleSubtask={handleToggleSubtask}
        />
      )}
    </Layout>
  );
};

export default TaskBoard;
