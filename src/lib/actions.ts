'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obter tarefas
const getTasksPrisma = async () => {
  const tasks = await prisma.task.findMany({
    orderBy: { order: 'asc' },
  });
  return tasks;
};

// Adicionar tarefa
const addTaskPrisma = async (taskData: { name: string, cost: number, deadline: Date }) => {
  const order = (await prisma.task.count()) + 1;
  const newTask = await prisma.task.create({
    data: { ...taskData, order },
  });
  return newTask;
};

// Editar tarefa
const updateTaskPrisma = async (id: number, taskData: { name?: string, cost?: number, deadline?: Date, order?: number }) => {
  const updatedTask = await prisma.task.update({
    where: { id },
    data: taskData,
  });
  return updatedTask;
};

// Deletar tarefa
const deleteTaskPrisma = async (id: number) => {
  await prisma.task.delete({ where: { id } });
};

export { getTasksPrisma, addTaskPrisma, updateTaskPrisma, deleteTaskPrisma };