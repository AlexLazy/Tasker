import React, { FC } from 'react';

import Grid from '@material-ui/core/Grid';

import { useQuery } from '@apollo/react-hooks';
import { GET_USER_PROJECTS } from '../gql/queries';

const Projects: FC = () => {
  const { data, loading, error } = useQuery(GET_USER_PROJECTS);
  if (loading) return <p>loading</p>;
  if (error) return <p>ERROR</p>;

  return <p>Project</p>;
};

export default Projects;
