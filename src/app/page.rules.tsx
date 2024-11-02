import { useEffect, useState } from 'react';

import axios from 'axios';

import { Task } from './types/Task'; // Importa o tipo Task

const HomeRules = () => {
  const [tasks, setTasks] = useState<Task[]>([]); // Array de tarefas
  const [isEditMode, setIsEditMode] = useState(false); // Modo de edição
  const [editTaskData, setEditTaskData] = useState<Task | null>(null); // Dados da tarefa em edição

  const [draggedTaskIndex, setDraggedTaskIndex] = useState<number | null>(null); // Índice da tarefa sendo arrastada

  const handleDragStart = (index: number) => {
    setDraggedTaskIndex(index);
  }; // Inicia o arraste da tarefa

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }; // Permite a tarefa ser arrastada

  const moveTaskUp = (index: number) => {
    if (index > 0) {
      updateTaskOrder(index, index - 1);
    }
  }; // Move a tarefa para cima
  
  const moveTaskDown = (index: number) => {
    if (index < tasks.length - 1) {
      updateTaskOrder(index, index + 1);
    }
  }; // Move a tarefa para baixo
  
  const updateTaskOrder = (fromIndex: number, toIndex: number) => {
    const updatedTasks = [...tasks]; // Cria uma cópia do array de tarefas
    const [movedTask] = updatedTasks.splice(fromIndex, 1); // Remove a tarefa que será movida
    updatedTasks.splice(toIndex, 0, movedTask); // Insere a tarefa na nova posição
  
    setTasks(updatedTasks.map((task, index) => ({ ...task, order: index + 1 }))); // Atualiza o estado das tarefas
  
    updatedTasks.forEach(async (task, index) => {
      await axios.put(`http://localhost:5000/tasks/${task.id}`, { ...task, order: index + 1 }); // Atualiza a ordem das tarefas no banco de dados
    });
  }; // Atualiza a ordem das tarefas

  const handleDrop = (index: number) => {
    if (draggedTaskIndex !== null && draggedTaskIndex !== index) { // Verifica se a tarefa foi arrastada e se a posição é diferente da original
      updateTaskOrder(draggedTaskIndex, index); // Atualiza a ordem das tarefas
    }
    setDraggedTaskIndex(null);
  }; // Finaliza o arraste da tarefa

  const deleteTask = async (id: number) => {
    if (confirm('Deseja realmente excluir esta tarefa?')) {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id)); // Remove a tarefa do array de tarefas
    }
  }; // Deleta uma tarefa

  const handleEditTask = async (updatedTask: Task) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${updatedTask.id}`, updatedTask); // Atualiza a tarefa no banco de dados
      setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task))); // Atualiza a tarefa no array de tarefas
      setIsEditMode(false);
      setEditTaskData(null);
    } catch (error) {
      console.error('Failed to edit task:', error);
    }
  }; // Edita uma tarefa

  function formatTexts({type, value, date}: { type: string; value?: number; date?: string }) {
    if (type === 'cost') {
      return value?.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }); // Formata o valor
    } else if (type === 'date' && date) {
      const parsedDate = new Date(date);
      return parsedDate.toLocaleDateString('pt-BR', {
        timeZone: 'UTC',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }); // Formata a data
    } else {
      return '';
    }
  } // Formata os textos exibidos

  useEffect(() => {
    axios.get<Task[]>('http://localhost:5000/tasks')
      .then(response => {
        const orderedTasks = response.data.sort((a, b) => a.order - b.order); // Ordena as tarefas pela ordem
        setTasks(orderedTasks); // Atualiza o array de tarefas
      })
      .catch(error => {
        console.error('Failed to fetch tasks:', error)
        setTasks([]);
      });
  }, [tasks]); // Busca as tarefas ao carregar a página

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
