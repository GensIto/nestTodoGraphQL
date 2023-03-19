import jwtDecode from "jwt-decode";
import Header from "./Header";
import TaskTable from "./TaskTable";
import { Payload } from "../types/payload";
import { useQuery } from "@apollo/client";
import { Task } from "../types/task";
import { GET_TASKS } from "../queries/taskQueries";
import Typography from "@mui/material/Typography";
import Loading from "./Loading";
import { Stack } from "@mui/material";
import AddTask from "./AddTask";

const Main = () => {
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode<Payload>(token!);
  const userId = decodedToken.sub;

  const { loading, data, error } = useQuery<{ getTasks: Task[] }>(GET_TASKS, {
    variables: { userId },
  });

  return (
    <>
      <Header />
      <Stack spacing={4} direction='column' m={8} alignItems='center'>
        {loading && <Loading />}
        {error && <Typography color='red'>ERROR!</Typography>}
        {!loading && !error && (
          <>
            <AddTask userId={userId} />
            <TaskTable tasks={data?.getTasks} userId={userId} />
          </>
        )}
      </Stack>
    </>
  );
};

export default Main;
