import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Task } from "../types/task";
import { CREATE_TASK } from "../mutations/taskMutations";
import { GET_TASKS } from "../queries/taskQueries";
import { useNavigate } from "react-router-dom";

export default function AddTask({ userId }: { userId: number }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [isInvalidName, setIsInvalidName] = useState(false);
  const [isInvalidDueDta, setIsInvalidDueDta] = useState(false);

  const [createTask] = useMutation<{ createTask: Task }>(CREATE_TASK);

  const navigate = useNavigate();

  const resetState = () => {
    setName("");
    setDueDate("");
    setDescription("");
    setIsInvalidName(false);
    setIsInvalidDueDta(false);
  };

  const handleAddTask = async () => {
    let canAdd = true;

    if (name.length === 0) {
      canAdd = false;
      setIsInvalidName(true);
    } else {
      setIsInvalidName(false);
    }

    if (!Date.parse(dueDate)) {
      canAdd = false;
      setIsInvalidDueDta(true);
    } else {
      setIsInvalidDueDta(false);
    }

    if (canAdd) {
      const createTaskInput = { name, dueDate, description, userId };
      try {
        await createTask({
          variables: { createTaskInput },
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
        alert("タスクの登録に失敗しました");
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
      <Button
        variant='contained'
        sx={{ width: "270px" }}
        onClick={handleClickOpen}>
        Add Task
      </Button>
      <Dialog fullWidth={true} maxWidth='sm' open={open} onClose={handleClose}>
        <DialogTitle>Add Task</DialogTitle>
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
          <Button onClick={handleAddTask}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
