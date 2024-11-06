import { useState } from 'react';

import { addTaskPrisma } from '@/lib/actions';

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
            const response = await addTaskPrisma({ name, cost, deadline: new Date(deadline) });
            console.log(response);

            setName('');
            setCost(0);
            setDeadline('');

            // const response = await prisma.task.create({ // Adiciona a tarefa no banco de dados
            //     data: {
            //         name,
            //         cost,
            //         deadline,
            //         order: (await prisma.task.count()) + 1, // Assuming order is based on the count of tasks
            //     },
            // }).then((e) => {
            //     console.log(e);
            //     setName('');
            //     setCost(0);
            //     setDeadline('');
            // }).catch((e) => {
            //     console.log(e);
            // });
        } catch (error) {
            console.log("Failed to add task:", error);
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
