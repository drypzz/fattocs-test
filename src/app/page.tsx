'use client';

import AddTask from './components/add/Add';
import EditTask from './components/edit/Edit';

import HomeRules from './page.rules';

import './page.style.css';

const HomePage = () => {

  const {
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
  } = HomeRules();

  return (
    <>
      <section>
        <div className='container'>
          <img className='logo' src='/logo.png' alt='Logo da Fattocs' />
          <h1>Sistema de Tarefas</h1>
        </div>
        <AddTask />
        <h1 className='title'>Lista de Tarefas</h1>
        <div
          className='list'>
          {tasks.length === 0 && (
            <div className='error'>
              <p>Nenhuma tarefa encontrada!</p>
            </div>
          )}
          {tasks.map((task, i) => (
            <div
              key={task.id}
              className='card'
              style={{
                backgroundColor: (task.cost >= 1000 ? '#680707' : 'white'),
                color: (task.cost >= 1000 ? 'white' : 'black'),
                cursor: (tasks.length > 1 ? 'move' : 'default'),
                border: (task.cost >= 1000 ? '1px solid #fff' : '1px solid #00000033'),
              }}
              draggable={tasks.length > 1}
              onDragStart={() => handleDragStart(i)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(i)}
            >
              <div>
                <p className='order'>#{task.order} - [ID: {task.id}]</p>
              </div>
              <div>
                <h2>{task.name}</h2>
              </div>
              <div>
                <p>- Custo: {formatTexts({ type: 'cost', value: task.cost })}</p>
              </div>
              <div>
                <p>- Data Limite: {formatTexts({ type: 'date', date: task.deadline })}</p>
              </div>
              <div className='buttons'>
                <button
                  className='button-list'
                  onClick={() => { setIsEditMode(true); setEditTaskData(task); }}
                  style={{
                    backgroundColor: (task.cost >= 1000 ? 'white' : '#680707'),
                    color: (task.cost >= 1000 ? 'white' : 'black'),
                  }}
                >✏️
                </button>
                <button
                  className='button-list'
                  onClick={() => deleteTask(task.id)}
                  style={{
                    backgroundColor: (task.cost >= 1000 ? 'white' : '#680707'),
                    color: (task.cost >= 1000 ? 'white' : 'black'),
                  }}
                >🗑️</button>
              </div>
              <div className="mobile-buttons">
                {i > 0 && (
                  <button
                  onClick={() => moveTaskUp(i)}
                  style={{
                    backgroundColor: (task.cost >= 1000 ? 'white' : '#680707'),
                    color: (task.cost >= 1000 ? 'black' : 'white'),
                  }}
                  >🔼 Subir</button>
                )}
                {i < tasks.length - 1 && (
                  <button
                  style={{
                    backgroundColor: (task.cost >= 1000 ? 'white' : '#680707'),
                    color: (task.cost >= 1000 ? 'black' : 'white'),
                  }}
                  onClick={() => moveTaskDown(i)}
                  >🔽 Descer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {isEditMode && editTaskData && (
          <EditTask task={editTaskData} onSave={handleEditTask} onCancel={() => { setIsEditMode(false); setEditTaskData(null); }} />
        )}
      </section>
    </>
  );
};

export default HomePage;
