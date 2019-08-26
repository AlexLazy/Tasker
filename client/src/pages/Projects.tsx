import React, { FC } from 'react';

import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';

import { useQuery } from '@apollo/react-hooks';
import { GET_USER_PROJECTS } from '../gql/queries';

import ProjectCard from '../components/ProjectCard';
import { AddProjectBtn } from '../components/AddBtn';

import { ProjectCardProps } from '../components/ProjectCard/ProjectCard';

const Projects: FC = () => {
  const { data, loading, error } = useQuery(GET_USER_PROJECTS);

  if (error) return <p>ERROR</p>;

  const projects = data.me && data.me.projects;

  return loading ? (
    <LinearProgress />
  ) : (
    <Grid container spacing={3}>
      {projects.length ? (
        projects.map((project: ProjectCardProps) => (
          <Grid item xl={2} lg={3} md={4} sm={6} xs={12} key={project.id}>
            <ProjectCard {...project} />
          </Grid>
        ))
      ) : (
        <p>Нет проектов.</p>
      )}
      <AddProjectBtn />
    </Grid>
  );
};

export default Projects;
