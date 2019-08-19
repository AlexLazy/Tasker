import React, { FC, ReactChild } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  root: {
    position: 'relative'
  },
  progress: (size: number) => ({
    position: 'absolute',
    top: `calc(50% - ${size / 2}px)`,
    left: `calc(50% - ${size / 2}px)`,
    color: green[500]
  })
});

interface CircleLoadingProps {
  size: number;
  isLoading: boolean;
  children: ReactChild;
}

const CircleLoading: FC<CircleLoadingProps> = ({
  size,
  isLoading,
  children
}) => {
  const classes = useStyles(size);
  return (
    <div className={classes.root}>
      {children}
      {isLoading && (
        <CircularProgress className={classes.progress} size={size} />
      )}
    </div>
  );
};
export default CircleLoading;
