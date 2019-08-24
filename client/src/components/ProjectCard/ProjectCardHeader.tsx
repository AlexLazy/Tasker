import React, { FC } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import CakeIcon from '@material-ui/icons/Cake';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexWrap: 'wrap'
    },
    usersWrapper: {
      display: 'flex',
      marginBottom: theme.spacing(2)
    },
    priceWrapper: {
      display: 'flex',
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1)
    },
    avatar: {
      width: 20,
      height: 20,
      transform: 'scale(1.5)'
    },
    price: {
      marginLeft: theme.spacing(1)
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
  price: number;
  price_total: number;
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
        <div className={classes.priceWrapper}>
          <Chip
            size='small'
            label={price_total}
            avatar={
              <Avatar>
                <BusinessCenterIcon />
              </Avatar>
            }
          />
          <Chip
            className={classes.price}
            size='small'
            color='primary'
            label={role === 'ADMIN' ? price_total - price : price}
            avatar={
              <Avatar>
                <CakeIcon />
              </Avatar>
            }
          />
        </div>
      }
    />
  );
};
export default ProjectCardHeader;
