import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { UPDATE_TASK } from "../mutations/taskMutations";
import { Task } from "../types/task";
import { TaskStatus } from "../types/taskStatus";
import { GET_TASKS } from "../queries/taskQueries";

export default function EditTask({
  task,
  userId,
}: {
  task: Task;
  userId: number;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(task.name);
  const [status, setStatus] = useState(task.status);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [description, setDescription] = useState(task.description);
  const [isInvalidName, setIsInvalidName] = useState(false);
  const [isInvalidDueDta, setIsInvalidDueDta] = useState(false);

  const [updatedTask] = useMutation<{ updateTask: Task }>(UPDATE_TASK);

  const navigate = useNavigate();

  const resetState = () => {
    setName(task.name);
    setDueDate(task.dueDate);
    setDescription(task.description);
    setIsInvalidName(false);
    setIsInvalidDueDta(false);
  };

  const handleEditTask = async () => {
    let canEdit = true;

    if (name.length === 0) {
      canEdit = false;
      setIsInvalidName(true);
    } else {
      setIsInvalidName(false);
    }

    if (!Date.parse(dueDate)) {
      canEdit = false;
      setIsInvalidDueDta(true);
    } else {
      setIsInvalidDueDta(false);
    }

    if (canEdit) {
      const updateTaskInput = {
        id: task.id,
        name,
        dueDate,
        status,
        description,
      };
      try {
        await updatedTask({
          variables: { updateTaskInput },
          refetchQueries: [{ query: GET_TASKS, variables: { userId } }],
        });
        resetState();
        setOpen(false);
      } catch (error: any) {
        if (error.message === "Unauthorized") {
          localStorage.removeItem("toke");
          alert("トークンの有効期限が切れています。サンイイン画面に遷移します");
          navigate("/signin");
          return;
        }
        alert("タスクの更新に失敗しました");
      }
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    resetState();
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title='編集'>
        <IconButton onClick={handleClickOpen}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Dialog fullWidth={true} maxWidth='sm' open={open} onClose={handleClose}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='normal'
            id='name'
            label='Task Name'
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={isInvalidName}
            helperText={isInvalidName && "タスク名を入力してください"}
          />
          <TextField
            autoFocus
            margin='normal'
            id='dueDate'
            label='Due Date'
            placeholder='yyyy-mm-dd'
            fullWidth
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            error={isInvalidDueDta}
            helperText={isInvalidDueDta && "日付けの形式が間違っています"}
          />
          <FormControl fullWidth={true} margin='normal'>
            <InputLabel id='taskStatusLabel'>Status</InputLabel>
            <Select
              id='taskStatus'
              labelId='taskStatusLabel'
              label='Status'
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}>
              <MenuItem value={"NOT_STARTED"}>Not Stared</MenuItem>
              <MenuItem value={"IN_PROGRESS"}>In Progress</MenuItem>
              <MenuItem value={"COMPLETED"}>Completed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin='normal'
            id='description'
            label='Description'
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEditTask}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
