import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { API_URL } from "../config";
import { useAuth } from "../contexts/AuthContext";
import {
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart2,
  Search,
  Trash2,
  Edit,
} from "lucide-react";
import Stats from "../components/Stats";
import TaskBoardModal from "../components/TaskBoardModal";
import Layout from "../components/Layout";

const Dashboard = () => {
  const { user } = useAuth();
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/boards`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoards(response.data);
    } catch (error) {
      toast.error("Failed to fetch boards");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBoard = async (title, description) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/boards`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setBoards([...boards, response.data]);
      setShowCreateModal(false);
      toast.success("Board created successfully");
    } catch (error) {
      toast.error("Failed to create board");
    }
  };

  const handleUpdateBoard = async (id, title, description) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/boards/${id}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setBoards(
        boards.map((board) =>
          board._id === id ? { ...board, title, description } : board,
        ),
      );
      setEditingBoard(null);
      toast.success("Board updated successfully");
    } catch (error) {
      toast.error("Failed to update board");
    }
  };

  const handleDeleteBoard = async (id) => {
    if (!window.confirm("Are you sure you want to delete this board?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/boards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBoards(boards.filter((board) => board._id !== id));
      toast.success("Board deleted successfully");
    } catch (error) {
      toast.error("Failed to delete board");
    }
  };

  const filteredBoards = boards.filter(
    (board) =>
      board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      board.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Layout>
      <div className="py-6 dark:bg-gray-900 dark:text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none md:mt-0"
            >
              <Plus className="mr-2 -ml-1 h-5 w-5" />
              New Board
            </button>
          </div>

          <Stats boards={boards} />

          <div className="mt-8">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-medium text-gray-900">Your Boards</h2>
              <div className="relative mt-4 max-w-xs rounded-md shadow-sm md:mt-0">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="dark: block w-full rounded-md border border-gray-300 border-gray-500 p-2 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Search boards"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500"></div>
              </div>
            ) : filteredBoards.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <BarChart2 className="h-full w-full" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No boards found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? "Try a different search term"
                    : "Get started by creating a new board"}
                </p>
                {!searchTerm && (
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                    >
                      <Plus className="mr-2 -ml-1 h-5 w-5" />
                      New Board
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBoards.map((board) => (
                  <div
                    key={board._id}
                    className="relative overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800"
                  >
                    <div className="absolute top-0 right-0 flex space-x-2 pt-7 pr-4">
                      <button
                        onClick={() => setEditingBoard(board)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBoard(board._id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <Link to={`/board/${board._id}`}>
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="truncate pr-16 text-lg font-medium text-gray-900 dark:text-white">
                          {board.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                          {board.description}
                        </p>
                        <div className="mt-4 flex items-center text-sm text-gray-500">
                          <Calendar className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                          <span>
                            Created{" "}
                            {new Date(board.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-4">
                          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                            <div className="flex items-center">
                              <Clock className="h-5 w-5 text-gray-400" />
                              <span className="ml-2 text-sm font-medium text-gray-500">
                                {board.tasksCount} Tasks
                              </span>
                            </div>
                          </div>
                          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                            <div className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className="ml-2 text-sm font-medium text-gray-500">
                                {board.completedTasksCount} Completed
                              </span>
                            </div>
                          </div>
                          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                            <div className="flex items-center">
                              <Calendar className="h-5 w-5 text-blue-500" />
                              <span className="ml-2 text-sm font-medium text-gray-500">
                                {board.upcomingDeadlinesCount} Upcoming
                              </span>
                            </div>
                          </div>
                          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                            <div className="flex items-center">
                              <AlertCircle className="h-5 w-5 text-red-500" />
                              <span className="ml-2 text-sm font-medium text-gray-500">
                                {board.overdueTasksCount} Overdue
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <TaskBoardModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateBoard}
        />
      )}

      {editingBoard && (
        <TaskBoardModal
          onClose={() => setEditingBoard(null)}
          onSubmit={(title, description) =>
            handleUpdateBoard(editingBoard._id, title, description)
          }
          initialTitle={editingBoard.title}
          initialDescription={editingBoard.description}
          isEditing={true}
        />
      )}
    </Layout>
  );
};

export default Dashboard;
