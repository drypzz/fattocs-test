import { useEffect, useState } from 'react';

import { Task } from './types/Task'; // Importa o tipo Task

import { updateTaskPrisma, getTasksPrisma, deleteTaskPrisma } from '@/lib/actions'; // Importa as funções de atualização, busca e exclusão de tarefas

const HomeRules = () => {
  const [tasks, setTasks] = useState<Task[]>([]); // Inicializa o estado com um array vazio de tarefas

  const [isEditMode, setIsEditMode] = useState(false); // Inicializa o estado de edição como falso
  const [editTaskData, setEditTaskData] = useState<Task | null>(null); // Inicializa o estado de dados da tarefa a ser editada como nulo
  const [draggedTaskIndex, setDraggedTaskIndex] = useState<number | null>(null); // Inicializa o estado de índice da tarefa arrastada como nulo

  const handleDragStart = (index: number) => setDraggedTaskIndex(index); // Função para iniciar o arrasto da tarefa
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault(); // Função para arrastar a tarefa

  const moveTaskUp = (index: number) => index > 0 && updateTaskOrder(index, (index - 1)); // Função para mover a tarefa para cima
  const moveTaskDown = (index: number) => index < tasks.length - 1 && updateTaskOrder(index, (index + 1)); // Função para mover a tarefa para baixo

  const updateTaskOrder = async (fromIndex: number, toIndex: number) => { // Função para atualizar a ordem das tarefas
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);

    setTasks(updatedTasks.map((task, index) => ({ ...task, order: (index + 1) })));

    await updateTaskPrisma(movedTask.id, {
      order: (toIndex + 1)
    });
  };

  const handleDrop = (index: number) => { // Função para soltar a tarefa
    if (draggedTaskIndex !== null && draggedTaskIndex !== index) {
      updateTaskOrder(draggedTaskIndex, index);
    }
    setDraggedTaskIndex(null);
  };

  const deleteTask = async (id: number) => { // Função para deletar a tarefa
    if (confirm('Deseja realmente excluir esta tarefa?')) {
      await deleteTaskPrisma(id);
      setTasks(tasks.filter(task => task.id !== id));
      alert('Tarefa excluída com sucesso!');
    }
  };

  const handleEditTask = async (updatedTask: Task) => { // Função para editar a tarefa
    try {
      await updateTaskPrisma(updatedTask.id, {
        name: updatedTask.name,
        cost: updatedTask.cost,
        deadline: new Date(updatedTask.deadline)
      });
      setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
      setIsEditMode(false);
      setEditTaskData(null);
    } catch (error) {
      console.error('Failed to edit task:', error);
    }
  };

  function formatTexts({ type, value, date }: { type: string; value?: number; date?: string }) { // Função para formatar os textos
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
  };

  useEffect(() => {
    const fetchTasks = async () => { // Função para buscar as tarefas
      try {
        const tasksFromDB = await getTasksPrisma();
        const sortedTasks = tasksFromDB.sort((a, b) => a.order - b.order);
        const tasksDB = sortedTasks.map(task => ({ ...task, deadline: task.deadline.toISOString() }));
        setTasks(tasksDB);
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
