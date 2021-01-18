import React, { FC, ChangeEvent, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { TextField, LinearProgress, Grid } from "@material-ui/core";
import ProjectCard from "../components/ProjectCard";
import AddBtn from "../components/AddBtn";
import RefetchProgress, { useRefetch } from "../components/RefetchProgress";
import { ProjectCardProps } from "../components/ProjectCard/ProjectCard";

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      authorId
      title
      users {
        id
        name
        email
        avatar
      }
      tasks {
        price
        priceTotal
      }
    }
  }
`;

const ADD_PROJECT = gql`
  mutation AddProject($title: String!) {
    addProject(title: $title) {
      message
    }
  }
`;

const Dashboard: FC = () => {
  const [title, setTitle] = useState("");
  const { data, loading, refetch, networkStatus } = useQuery(GET_PROJECTS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
  });
  const isNotRefetch = useRefetch(loading, networkStatus);
  const [addProject, { loading: loadingProject }] = useMutation(ADD_PROJECT);

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => setTitle(e.target.value);

  const handleAddProject = async () => {
    await addProject({ variables: { title } });
    setTitle("");
    await refetch();
  };

  return isNotRefetch ? (
    <LinearProgress />
  ) : (
    <Grid container spacing={3}>
      <RefetchProgress networkStatus={networkStatus} />
      {data?.projects.length ? (
        data.projects.map((project: ProjectCardProps) => (
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12} key={project.id}>
            <ProjectCard {...project} refetch={refetch} />
          </Grid>
        ))
      ) : (
        <p>Нет проектов.</p>
      )}
      <AddBtn
        title="Добавить проект"
        loading={loadingProject}
        disabled={!title}
        onSave={handleAddProject}
      >
        <TextField
          label="Название проекта"
          fullWidth
          autoFocus
          onChange={handleChange}
        />
      </AddBtn>
    </Grid>
  );
};

export default Dashboard;
