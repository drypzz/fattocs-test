"use client";

import React from 'react';

import EditTaskProps from './Edit.props';

import EditRules from './Edit.rules';

const EditTask = ({ task, onSave, onCancel }: EditTaskProps) => {

  const { name, cost, deadline, setName, setCost, setDeadline, updateTask } = EditRules({ task, onSave, onCancel });

  return (
    <>
      <div>
        <h2>Editar Tarefa (#{task.order})</h2>
        <form onSubmit={updateTask}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="number"
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
          <button type="submit">Atualizar</button>
          <button type="button" onClick={onCancel}>Cancelar</button>
        </form>
      </div>
    </>
  );
};

export default EditTask;