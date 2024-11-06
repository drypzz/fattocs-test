import { useState } from 'react';

import { updateTaskPrisma, getTasksPrisma } from '@/lib/actions';

import EditTaskProps from './Edit.props'; // Importa a interface de propriedades da edição

const EditRules = ({ task, onSave }: EditTaskProps) => {

    const [name, setName] = useState(task.name); // Inicializa o estado com o nome da tarefa
    const [cost, setCost] = useState(task.cost); // Inicializa o estado com o custo da tarefa
    const [deadline, setDeadline] = useState(task.deadline); // Inicializa o estado com a data limite da tarefa

    const updateTask = async (event: React.FormEvent) => { // Função para atualizar a tarefa
        event.preventDefault();

        if (!name || !cost || !deadline) {
            return;
        } // Verifica se os campos estão preenchidos

        if (isNaN(cost)) {
            alert('O custo deve ser um número');
            return;
        } // Verifica se o custo é um número

        if (cost < 0) {
            alert('O custo não pode ser negativo');
            return;
        } // Verifica se o custo é positivo

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Zera as horas, minutos, segundos e milissegundos

        if (new Date(deadline) < today) {
            alert('A data limite não pode ser no passado');
            return;
        } // Verifica se a data limite é no futuro

        try {
            const tasks = await getTasksPrisma(); // Obtém as tarefas do banco de dados

            if (tasks.some(t => t.name === name && t.id !== task.id)) {
                alert('Já existe uma tarefa com esse nome');
                return;
            } // Verifica se já existe uma tarefa com o mesmo nome

            const updatedTask = { ...task, name, cost, deadline: new Date(deadline) }; // Atualiza a tarefa com os novos valores
            await updateTaskPrisma(task.id, updatedTask)
            onSave({...task, name, cost, deadline: new Date(deadline).toISOString()});
            alert('Tarefa atualizada com sucesso');
            setName('');
            setCost(0);
            setDeadline('');
        } catch (error) {
            console.log('Failed to edit task:', error);
        }
    };

    return {
        name,
        cost,
        deadline,
        setName,
        setCost,
        setDeadline,
        updateTask
    }
}

export default EditRules;