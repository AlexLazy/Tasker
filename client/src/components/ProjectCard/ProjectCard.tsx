import React, { FC, useState } from 'react';

import { Link } from 'react-router-dom';

import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';
import { GET_USER_PROJECTS, GET_LOCAL_CURRENT_USER } from '../../gql/queries';
import { DELETE_PROJECT } from '../../gql/mutations';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';

import ProjectCardHeader from './ProjectCardHeader';
import ProjectCardFooter from './ProjectCardFooter';

const useStyles = makeStyles({
  link: {
    color: 'inherit',
    textDecoration: 'none'
  }
});

export interface IUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export interface ProjectCardProps {
  id: number;
  title: string;
  users: IUser[];
  tasks: {
    price: number;
    price_total: number;
  }[];
}

const ProjectCard: FC<ProjectCardProps> = ({
  id,
  title,
  users: inProjectUsers,
  tasks
}) => {
  const classes = useStyles();
  const client = useApolloClient();
  const [isHover, setIsHover] = useState(false);
  const { data: localUser } = useQuery(GET_LOCAL_CURRENT_USER);
  const role = localUser && localUser.me && localUser.me.role;
  const [mutateDeleteProject, { loading: loadingDeleteProject }] = useMutation(
    DELETE_PROJECT,
    {
      variables: { id },
      refetchQueries: [
        {
          query: GET_USER_PROJECTS
        }
      ],
      onCompleted({ deleteProject }) {
        !deleteProject &&
          client.writeData({
            data: {
              error: {
                __typename: 'error',
                text: 'Такого проекта не существует',
                open: true
              }
            }
          });
      },
      onError(error) {
        client.writeData({
          data: {
            error: {
              __typename: 'error',
              text: error.message,
              open: true
            }
          }
        });
      }
    }
  );
  const { price, price_total } = tasks.reduce(
    (prev, cur) => ({
      price: prev.price + cur.price,
      price_total: prev.price_total + cur.price_total
    }),
    {
      price: 0,
      price_total: 0
    }
  );

  return (
    <Card
      raised={isHover}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <ProjectCardHeader
        users={inProjectUsers}
        role={role}
        price={price}
        price_total={price_total}
      />
      <Link className={classes.link} to={`/projects/${id}`}>
        <CardActionArea>
          <CardContent>
            <Typography variant='h5' component='h2'>
              {title}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
      <ProjectCardFooter
        id={id}
        mutateDeleteProject={mutateDeleteProject}
        loadingDeleteProject={loadingDeleteProject}
        inProjectUsers={inProjectUsers}
      />
    </Card>
  );
};
export default ProjectCard;
