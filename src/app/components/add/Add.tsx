'use client';

import React from 'react';

import AddRules from './Add.rules';

import './Add.style.css';

const AddTask = () => {

  const { name, setName, cost, setCost, deadline, setDeadline, addTask } = AddRules();

  return (
    <>
      <div className='add'>
        <form onSubmit={addTask}>
          <div className='form-container'>
            <div>
              <input
                type='text'
                placeholder='Nome da Tarefa'
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type='number'
                placeholder='Custo'
                value={cost || ''}
                onChange={e => setCost(parseFloat(e.target.value))}
                required
              />
            </div>
            <div>
              <input
                type='date'
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <div>
              <button className='submit' type='submit'>Adicionar</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddTask;
