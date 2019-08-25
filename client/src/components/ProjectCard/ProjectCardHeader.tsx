import React, { FC } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import Tooltip from '@material-ui/core/Tooltip';

import ProjectCardPrice from './ProjectCardPrice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexWrap: 'wrap'
    },
    usersWrapper: {
      display: 'flex',
      marginBottom: theme.spacing(2)
    },
    avatar: {
      width: 20,
      height: 20,
      transform: 'scale(1.5)'
    }
  })
);

export interface ProjectCardHeaderProps {
  users: {
    id: number;
    name: string;
    email: string;
    avatar: string;
  }[];
  role: 'ADMIN' | 'ROCKSTAR';
  price: string;
  price_total: string;
}

const ProjectCardHeader: FC<ProjectCardHeaderProps> = ({
  users,
  role,
  price,
  price_total
}) => {
  const classes = useStyles();

  return (
    <CardHeader
      className={classes.root}
      avatar={
        <div className={classes.usersWrapper}>
          {users.map(({ id, name, email, avatar }) => (
            <Tooltip
              key={id}
              title={
                <p>
                  <b>{name}</b>
                  <br />
                  {email}
                </p>
              }
            >
              <Avatar className={classes.avatar} src={avatar} />
            </Tooltip>
          ))}
        </div>
      }
      action={
        <ProjectCardPrice role={role} price_total={price_total} price={price} />
      }
    />
  );
};
export default ProjectCardHeader;
