import { Tooltip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation } from "@apollo/client";
import { DELETE_TASK } from "../mutations/taskMutations";
import { GET_TASKS } from "../queries/taskQueries";
import { useNavigate } from "react-router-dom";

export default function DeleteTask({
  id,
  userId,
}: {
  id: number;
  userId: number;
}) {
  const [deleteTask] = useMutation<{ deleteTask: number }>(DELETE_TASK);
  const navigate = useNavigate();

  const handleDeleteTask = async () => {
    try {
      await deleteTask({
        variables: { id },
        refetchQueries: [{ query: GET_TASKS, variables: { userId } }],
      });
      alert("タスクが削除されました");
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        localStorage.removeItem("toke");
        alert("トークンの有効期限が切れています。サンイイン画面に遷移します");
        navigate("/signin");
        return;
      }
      alert("タスクの削除に失敗しました");
    }
  };

  return (
    <div>
      <Tooltip title='編集'>
        <IconButton onClick={handleDeleteTask}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}
