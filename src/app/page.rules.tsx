import { useEffect, useState } from 'react';
import { Task } from './types/Task';

import prisma from '@/lib/prisma';

const HomeRules = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTaskData, setEditTaskData] = useState<Task | null>(null);
  const [draggedTaskIndex, setDraggedTaskIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => setDraggedTaskIndex(index);
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const moveTaskUp = (index: number) => index > 0 && updateTaskOrder(index, index - 1);
  const moveTaskDown = (index: number) => index < tasks.length - 1 && updateTaskOrder(index, index + 1);

  const updateTaskOrder = async (fromIndex: number, toIndex: number) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);

    setTasks(updatedTasks.map((task, index) => ({ ...task, order: index + 1 })));
    
    for (const task of updatedTasks) {
      await prisma.task.update({
        where: { id: task.id },
        data: { order: task.order },
      });
    }
  };

  const handleDrop = (index: number) => {
    if (draggedTaskIndex !== null && draggedTaskIndex !== index) {
      updateTaskOrder(draggedTaskIndex, index);
    }
    setDraggedTaskIndex(null);
  };

  const deleteTask = async (id: number) => {
    if (confirm('Deseja realmente excluir esta tarefa?')) {
      await prisma.task.delete({ where: { id } });
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const handleEditTask = async (updatedTask: Task) => {
    try {
      await prisma.task.update({
        where: { id: updatedTask.id },
        data: updatedTask,
      });
      setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
      setIsEditMode(false);
      setEditTaskData(null);
    } catch (error) {
      console.error('Failed to edit task:', error);
    }
  };

  function formatTexts({ type, value, date }: { type: string; value?: number; date?: string }) {
    if (type === 'cost') {
      return value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } else if (type === 'date' && date) {
      const parsedDate = new Date(date);
      return parsedDate.toLocaleDateString('pt-BR', {
        timeZone: 'UTC',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } else {
      return '';
    }
  }

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksFromDB = await prisma.task.findMany({
          orderBy: { order: 'asc' },
        });
        setTasks(tasksFromDB.map(task => ({ ...task, deadline: task.deadline.toISOString() })));
      } catch (error) {
        console.log('Failed to fetch tasks:', error);
        setTasks([]);
      }
    };

    fetchTasks();
  }, []);

  return {
    tasks,
    isEditMode,
    editTaskData,
    deleteTask,
    handleEditTask,
    setIsEditMode,
    setEditTaskData,
    formatTexts,
    handleDragStart,
    handleDragOver,
    handleDrop,
    moveTaskUp,
    moveTaskDown,
  };
};

export default HomeRules;
