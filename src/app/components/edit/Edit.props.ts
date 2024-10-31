import { Task } from '../../types/Task';

interface EditTaskProps {
    task: Task;
    onSave: (updatedTask: Task) => void;
    onCancel: () => void;
  
}

export default EditTaskProps;