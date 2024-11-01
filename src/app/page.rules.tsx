import { useEffect, useState } from "react";

import axios from "axios";

import { Task } from "./types/Task";

const HomeRules = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTaskData, setEditTaskData] = useState<Task | null>(null);

  const [draggedTaskIndex, setDraggedTaskIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedTaskIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const moveTaskUp = (index: number) => {
    if (index > 0) {
      updateTaskOrder(index, index - 1);
    }
  };
  
  const moveTaskDown = (index: number) => {
    if (index < tasks.length - 1) {
      updateTaskOrder(index, index + 1);
    }
  };
  
  const updateTaskOrder = (fromIndex: number, toIndex: number) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
  
    setTasks(updatedTasks.map((task, index) => ({ ...task, order: index + 1 })));
  
    updatedTasks.forEach(async (task, index) => {
      await axios.put(`http://localhost:5000/tasks/${task.id}`, { ...task, order: index + 1 });
    });
  };

  // const updateTaskOrder = (fromIndex: number, toIndex: number) => {
  //   const updatedTasks = [...tasks];
  //   const [movedTask] = updatedTasks.splice(fromIndex, 1);
  //   updatedTasks.splice(toIndex, 0, movedTask);

  //   setTasks(updatedTasks.map((task, index) => ({ ...task, order: index + 1 })));

  //   updatedTasks.forEach(async (task, index) => {
  //     await axios.put(`http://localhost:5000/tasks/${task.id}`, { ...task, order: index + 1 });
  //   });
  // };

  const handleDrop = (index: number) => {
    if (draggedTaskIndex !== null && draggedTaskIndex !== index) {
      updateTaskOrder(draggedTaskIndex, index);
    }
    setDraggedTaskIndex(null);
  };



  const deleteTask = async (id: number) => {
    if (confirm("Deseja realmente excluir esta tarefa?")) {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const handleEditTask = async (updatedTask: Task) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${updatedTask.id}`, updatedTask);
      setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
      setIsEditMode(false);
      setEditTaskData(null);
    } catch (error) {
      console.error("Failed to edit task:", error);
    }
  };

  function formatTexts({ type, value, date }: { type: string, value?: number, date?: string }) {
    if (type === 'cost') {
      return value?.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    }else if (type === 'date') {
      const dates = new Date(date ? date : '');
      return dates.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }else{
      return '';
    };
  };

  useEffect(() => {
    axios.get<Task[]>('http://localhost:5000/tasks')
      .then(response => {
        const orderedTasks = response.data.sort((a, b) => a.order - b.order);
        setTasks(orderedTasks);
      })
      .catch(error => {
        console.error("Failed to fetch tasks:", error)
        setTasks([]);
      });
  }, [tasks]);

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
    moveTaskDown
  };
};

export default HomeRules;
