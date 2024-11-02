'use client';

import React from 'react';

import EditTaskProps from './Edit.props'; // Propriedades de edição de tarefa

import EditRules from './Edit.rules'; // Importando regras de edição de tarefa

import './Edit.style.css'; // Estilo de edição de tarefa

const EditTask = ({ task, onSave, onCancel }: EditTaskProps) => { // Componente de edição de tarefa

  const { name, cost, deadline, setName, setCost, setDeadline, updateTask } = EditRules({ task, onSave, onCancel }); // Regras de edição de tarefa

  return (
    <>
      <div className='modal'>
        <div className='modal-content'>
          <div>
            <h2>Editar Tarefa (#{task.order})</h2>
          </div>
          <div>
            <form onSubmit={updateTask}>
              <input
                type='text'
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <input
                type='number'
                value={cost || ''}
                onChange={e => setCost(parseFloat(e.target.value))}
                required
              />
              <input
                type='date'
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                required
              />
              <div className='buttons-modal'>
                <div>
                  <button type='submit' className='save'>Atualizar</button>
                </div>
                <div>
                  <button type='button' className='cancel' onClick={onCancel}>Cancelar</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTask;