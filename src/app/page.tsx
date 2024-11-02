'use client';

import AddTask from './components/add/Add'; // Componente de adição de tarefas
import EditTask from './components/edit/Edit'; // Componente de edição de tarefas

import HomeRules from './page.rules'; // Regras da página

import './page.style.css'; // Estilo da página

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
  } = HomeRules(); // Regras da página

  return (
    <>
      <section className='main'>
        <div className='container'>
          <img className='logo' src='/logo.png' alt='Logo da Fattocs' />
          <h1>Sistema de Tarefas</h1>
        </div>

        {
          // Exibe o formulário de adição de tarefas
        }
        <AddTask />
        
        <h1 className='title'>Lista de Tarefas</h1>
        <div className='list'>

          {
            // Verifica se há tarefas na lista e exibe as tarefas
          }
          {tasks.length === 0 && (
            <div className='error'>
              <p>Nenhuma tarefa encontrada!</p>
            </div>
          )}

          {
            // Listagem das tarefas
          }
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
              draggable={tasks.length > 1} // Permite arrastar a tarefa
              onDragStart={() => handleDragStart(i)} // Inicia o arraste da tarefa
              onDragOver={handleDragOver} // Permite a tarefa ser arrastada
              onDrop={() => handleDrop(i)} // Finaliza o arraste da tarefa
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
              <div
                style={{
                  borderTop: (task.cost >= 1000 ? '1px solid #ffffff33' : '1px solid #00000033'),
                }}
                className='buttons'
              >
                <button
                  className='button-list'
                  onClick={() => { setIsEditMode(true); setEditTaskData(task); }} // Edita a tarefa
                  style={{
                    backgroundColor: (task.cost >= 1000 ? 'white' : '#680707'),
                    color: (task.cost >= 1000 ? 'black' : 'white'),
                  }}
                >✏️ - Editar
                </button>
                <button
                  className='button-list'
                  onClick={() => deleteTask(task.id)} // Deleta a tarefa
                  style={{
                    backgroundColor: (task.cost >= 1000 ? 'white' : '#680707'),
                    color: (task.cost >= 1000 ? 'black' : 'white'),
                  }}
                >🗑️ - Deletar
                </button>
              </div>
              <div className="mobile-buttons">
                {i > 0 && (
                  <button
                  onClick={() => moveTaskUp(i)} // Move a tarefa para cima
                  style={{
                    backgroundColor: (task.cost >= 1000 ? 'white' : '#680707'),
                    color: (task.cost >= 1000 ? 'black' : 'white'),
                  }}
                  >🔼 - Subir</button>
                )}
                {i < tasks.length - 1 && (
                  <button
                  style={{
                    backgroundColor: (task.cost >= 1000 ? 'white' : '#680707'),
                    color: (task.cost >= 1000 ? 'black' : 'white'),
                  }}
                  onClick={() => moveTaskDown(i)} // Move a tarefa para baixo
                  >🔽 - Descer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {
          // Verifica se está em modo de edição e exibe o formulário de edição
        }
        {isEditMode && editTaskData && (
          <EditTask task={editTaskData} onSave={handleEditTask} onCancel={() => { setIsEditMode(false); setEditTaskData(null); }} /> // Edita a tarefa
        )}
      </section>
    </>
  );
};

export default HomePage;
