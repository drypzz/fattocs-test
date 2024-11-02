import { Task } from '../../types/Task'; // import Task type
interface EditTaskProps {
    task: Task;
    onSave: (updatedTask: Task) => void;
    onCancel: () => void;
} // interface EditTaskProps

export default EditTaskProps;