import React from 'react';
import { 
  BarChart2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Calendar
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Stats = ({ boards }) => {
  const totalTasks = boards.reduce((sum, board) => sum + board.tasksCount, 0);
  const completedTasks = boards.reduce((sum, board) => sum + board.completedTasksCount, 0);
  const upcomingDeadlines = boards.reduce((sum, board) => sum + board.upcomingDeadlinesCount, 0);
  const overdueTasks = boards.reduce((sum, board) => sum + board.overdueTasksCount, 0);
  
  const completionRate = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  const statusChartData = {
    labels: ['Completed', 'Upcoming', 'Overdue', 'Other'],
    datasets: [
      {
        data: [
          completedTasks, 
          upcomingDeadlines, 
          overdueTasks, 
          totalTasks - (completedTasks + upcomingDeadlines + overdueTasks)
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)',
          'rgba(59, 130, 246, 0.6)',
          'rgba(239, 68, 68, 0.6)',
          'rgba(156, 163, 175, 0.6)'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const boardsChartData = {
    labels: boards.slice(0, 5).map(board => board.title),
    datasets: [
      {
        label: 'Total Tasks',
        data: boards.slice(0, 5).map(board => board.tasksCount),
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
      },
      {
        label: 'Completed',
        data: boards.slice(0, 5).map(board => board.completedTasksCount),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
      },
    ],
  };
  
  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Overview</h2>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Tasks */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="p-5 flex items-center">
            <BarChart2 className="h-6 w-6 text-gray-400 dark:text-gray-300" />
            <div className="ml-5 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">{totalTasks}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        {/* Completed Tasks */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="p-5 flex items-center">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <div className="ml-5 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Tasks</dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {completedTasks} ({completionRate}%)
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="p-5 flex items-center">
            <Calendar className="h-6 w-6 text-blue-500" />
            <div className="ml-5 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Upcoming Deadlines
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {upcomingDeadlines}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="p-5 flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <div className="ml-5 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Overdue Tasks
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {overdueTasks}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {boards.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-5">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Task Status Distribution</h3>
            <div className="mt-6" style={{ height: '250px' }}>
              <Doughnut 
                data={statusChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' } },
                }} 
              />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-5">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Boards Comparison</h3>
            <div className="mt-6" style={{ height: '250px' }}>
              <Bar 
                data={boardsChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' } },
                  scales: { y: { beginAtZero: true } }
                }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
