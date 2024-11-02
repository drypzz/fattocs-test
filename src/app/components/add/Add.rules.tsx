import { useState } from 'react';

import { Task } from '@/app/types/Task'; // Importa o tipo de tarefa

import axios from 'axios';

const AddRules = () => {
    
    const [name, setName] = useState(''); // Inicializa o estado com o nome da tarefa
    const [cost, setCost] = useState<number>(0); // Inicializa o estado com o custo da tarefa
    const [deadline, setDeadline] = useState(''); // Inicializa o estado com a data limite da tarefa

    const addTask = async (event: React.FormEvent) => { // Função para adicionar uma tarefa
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
        today.setHours(0, 0, 0, 0);

        if (new Date(deadline) <= today) {
            alert('A data limite não pode ser no passado');
            return;
        } // Verifica se a data limite é no futuro

        try {
            const tasks = await axios.get<Task[]>('http://localhost:5000/tasks'); // Busca todas as tarefas
            const response = await axios.post('http://localhost:5000/tasks', {
                name,
                cost,
                deadline,
                order: (tasks.data.length + 1),
            }); // Adiciona a tarefa no servidor
            console.log("Task added:", response.data);
            setName('');
            setCost(0);
            setDeadline('');
        } catch (error) {
            console.error("Failed to add task:", error);
        }
    };

    return {
        name,
        setName,
        cost,
        setCost,
        deadline,
        setDeadline,
        addTask
    };
};

export default AddRules;
