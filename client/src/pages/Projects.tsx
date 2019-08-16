import React, { FC } from 'react';

import Grid from '@material-ui/core/Grid';

import { useQuery } from '@apollo/react-hooks';
import { GET_USER_PROJECTS } from '../gql/queries';

import { ProjectCard } from '../components';

import { ProjectCardProps } from '../components/ProjectCard';

const Projects: FC = () => {
  const { data, loading, error } = useQuery(GET_USER_PROJECTS);
  if (loading) return <p>loading</p>;
  if (error) return <p>ERROR</p>;

  return (
    <Grid container spacing={3}>
      {data.me &&
        data.me.projects &&
        data.me.projects.map((project: ProjectCardProps) => (
          <Grid item xs={2} key={project.id}>
            <ProjectCard {...project} />
          </Grid>
        ))}
    </Grid>
  );
};

export default Projects;