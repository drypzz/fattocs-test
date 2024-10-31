"use client";

import React from 'react';

import AddRules from './Add.rules';

const AddTask = () => {

  const { name, setName, cost, setCost, deadline, setDeadline, addTask } = AddRules();

  return (
    <>
      <div>
        <form onSubmit={addTask}>
          <input
            type="text"
            placeholder="Nome da Tarefa"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Custo"
            value={cost || ''}
            onChange={e => setCost(parseFloat(e.target.value))}
            required
          />
          <input
            type="date"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            required
          />
          <button type="submit">Salvar</button>
        </form>
      </div>
    </>
  );
};

export default AddTask;
