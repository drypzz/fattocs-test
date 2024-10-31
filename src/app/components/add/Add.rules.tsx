import { useState } from 'react';

import { Task } from '@/app/types/Task';

import axios from 'axios';

const AddRules = () => {
    const [name, setName] = useState('');
    const [cost, setCost] = useState<number>(0);
    const [deadline, setDeadline] = useState('');

    const addTask = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const tasks = await axios.get<Task[]>('http://localhost:5000/tasks');
            const response = await axios.post('http://localhost:5000/tasks', {
                name,
                cost,
                deadline,
                order: (tasks.data.length + 1),
            });
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
