import { useEffect, useState } from "react";

import axios from "axios";

import { Task } from "./types/Task";

const HomeRules = () => {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editTaskData, setEditTaskData] = useState<Task | null>(null);

    const deleteTask = async (id: number) => {
        if (confirm("Deseja realmente excluir esta tarefa?")) {
            await axios.delete(`http://localhost:5000/tasks/${id}`);
            setTasks(tasks.filter(task => task.id !== id));
        }
    };

    const handleEditTask = async (updatedTask: Task) => {
        try {
            await axios.put(`http://localhost:5000/tasks/${updatedTask.id}`, updatedTask);
            setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
            setIsEditMode(false);
            setEditTaskData(null);
        } catch (error) {
            console.error("Failed to edit task:", error);
        }
    };

    useEffect(() => {
        axios.get<Task[]>('http://localhost:5000/tasks')
        .then(response => {
            const orderedTasks = response.data.sort((a, b) => a.order - b.order);
            setTasks(orderedTasks);
        })
        .catch(error => console.error("Failed to fetch tasks:", error));
    }, [tasks]);

    return {
        tasks,
        isEditMode,
        editTaskData,
        deleteTask,
        handleEditTask,
        setIsEditMode,
        setEditTaskData
    }
};

export default HomeRules;