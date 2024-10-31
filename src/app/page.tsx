"use client";

import React from 'react';

import AddTask from './components/add/Add';
import EditTask from './components/edit/Edit';

import HomeRules from './page.rules';

const HomePage = () => {

  const {
    tasks,
    isEditMode,
    editTaskData,
    deleteTask,
    handleEditTask,
    setIsEditMode,
    setEditTaskData
  } = HomeRules();

  return (
    <> 
      <div>
        <h1>Lista de Tarefas</h1>
        <AddTask />
        {tasks.map((task, i) => (
          <div key={i} style={{ backgroundColor: task.cost >= 1000 ? 'yellow' : 'white' }}>
            <p>Nome: {task.name}</p>
            <p>Custo: R$ {task.cost}</p>
            <p>Data Limite: {task.deadline}</p>
            <button onClick={() => { setIsEditMode(true); setEditTaskData(task); }}>✏️</button>
            <button onClick={() => deleteTask(task.id)}>🗑️</button>
          </div>
        ))}
        {isEditMode && editTaskData && (
          <EditTask task={editTaskData} onSave={handleEditTask} onCancel={() => { setIsEditMode(false); setEditTaskData(null); }} />
        )}
      </div>
    </>
  );
};

export default HomePage;
