import React, { FC, ReactChild, HTMLAttributes } from 'react';

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

interface CircleLoadingProps extends HTMLAttributes<HTMLDivElement> {
  size: number;
  isLoading: boolean;
  children: ReactChild;
}

const CircleLoading: FC<CircleLoadingProps> = ({
  size,
  isLoading,
  children,
  ...props
}) => {
  const classes = useStyles(size);
  return (
    <div {...props}>
      <div className={classes.root}>
        {children}
        {isLoading && (
          <CircularProgress className={classes.progress} size={size} />
        )}
      </div>
    </div>
  );
};
export default CircleLoading;
