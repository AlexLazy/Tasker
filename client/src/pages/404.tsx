import React, { FC } from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  }
});

const Page404: FC = () => {
  const classes = useStyles();
  return (
    <section className={classes.root}>
      <Typography variant='h1' component='h2' gutterBottom>
        404
      </Typography>
    </section>
  );
};

export default Page404;
