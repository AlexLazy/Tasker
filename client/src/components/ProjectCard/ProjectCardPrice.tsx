import React, { FC } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import CakeIcon from '@material-ui/icons/Cake';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    priceWrapper: {
      display: 'flex',
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1)
    },
    price: {
      marginLeft: theme.spacing(1)
    }
  })
);

export interface ProjectCardPriceProps {
  role: 'ADMIN' | 'ROCKSTAR';
  price: string;
  price_total: string;
}

const ProjectCardPrice: FC<ProjectCardPriceProps> = ({
  role,
  price,
  price_total
}) => {
  const classes = useStyles();

  return (
    <div className={classes.priceWrapper}>
      <Chip
        size='small'
        label={price_total.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
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
        label={(role === 'ADMIN'
          ? parseInt(price_total) - parseInt(price)
          : price
        )
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
        avatar={
          <Avatar>
            <CakeIcon />
          </Avatar>
        }
      />
    </div>
  );
};
export default ProjectCardPrice;
