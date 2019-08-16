import React, { FC, useState } from 'react';

import { Link } from 'react-router-dom';

import { useQuery, useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  })
);

export interface ProjectCardProps {
  id: number;
  title: string;
}

export const ProjectCard: FC<ProjectCardProps> = ({ id, title }) => {
  const classes = useStyles();
  const [hover, setHover] = useState(false);

  return (
    <Link to={`/projects/${id}`}>
      <Card
        raised={hover}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <CardContent>
          <Typography variant='h5' component='h2'>
            {title}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};
