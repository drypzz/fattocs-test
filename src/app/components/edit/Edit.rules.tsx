import { useState } from 'react';

import axios from 'axios';

import { Task } from '@/app/types/Task';

import EditTaskProps from './Edit.props';

const EditRules = ({ task, onSave }: EditTaskProps) => {

    const [name, setName] = useState(task.name);
    const [cost, setCost] = useState(task.cost);
    const [deadline, setDeadline] = useState(task.deadline);

    const updateTask = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const tasks = await axios.get<Task[]>('http://localhost:5000/tasks');
            if (tasks.data.some(existingTask => existingTask.name === name && existingTask.id !== task.id)) {
                alert("Nome de tarefa já existe!");
                return;
            }
            const updatedTask = { ...task, name, cost, deadline };
            await axios.put(`http://localhost:5000/tasks/${task.id}`, updatedTask);
            onSave(updatedTask);
        } catch (error) {
            console.error("Failed to edit task:", error);
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