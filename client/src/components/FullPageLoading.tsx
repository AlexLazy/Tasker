import React, { FC } from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  root: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: '100vh',
    padding: '0 30px',
    '& button': {
      zIndex: 2
    }
  },
  rectangles: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    '& .rectangle': {
      position: 'absolute',
      width: 20,
      height: 20,
      background: 'rgba(255, 255, 255, 0.2)',
      animation: '$bubbling 25s linear infinite',
      bottom: -150,
      '&:nth-child(1)': {
        left: '25%',
        width: 80,
        height: 80,
        animationDelay: '0s'
      },
      '&:nth-child(2)': {
        left: '10%',
        width: 20,
        height: 20,
        animationDelay: '2s',
        animationDuration: '12s'
      },
      '&:nth-child(3)': {
        left: '70%',
        width: 20,
        height: 20,
        animationDelay: '4s'
      },
      '&:nth-child(4)': {
        left: '40%',
        width: 60,
        height: 60,
        animationDelay: '0s',
        animationDuration: '18s'
      },
      '&:nth-child(5)': {
        left: '65%',
        width: 20,
        height: 20,
        animationDelay: '0s'
      },
      '&:nth-child(6)': {
        left: '75%',
        width: 110,
        height: 110,
        animationDelay: '3s'
      },
      '&:nth-child(7)': {
        left: '35%',
        width: 150,
        height: 150,
        animationDelay: '7s'
      },
      '&:nth-child(8)': {
        left: '50%',
        width: 25,
        height: 25,
        animationDelay: '15s',
        animationDuration: '45s'
      },
      '&:nth-child(9)': {
        left: '20%',
        width: 15,
        height: 15,
        animationDelay: '2s',
        animationDuration: '35s'
      },
      '&:nth-child(10)': {
        left: '85%',
        width: 150,
        height: 150,
        animationDelay: '0s',
        animationDuration: '11s'
      }
    }
  },
  '@keyframes bubbling': {
    '0%': {
      transform: 'translateY(0) rotate(0deg)',
      opacity: 1,
      borderRadius: 0
    },
    '100%': {
      transform: 'translateY(-1000px) rotate(720deg)',
      opacity: 0,
      borderRadius: '50%'
    }
  }
});

const FullPageLoading: FC = ({ children }) => {
  const classes = useStyles();

  return (
    <CssBaseline>
      <section className={classes.root}>
        {children}
        <div className={classes.rectangles}>
          {new Array(10).fill(0).map((v, i) => (
            <div className='rectangle' key={i} />
          ))}
        </div>
      </section>
    </CssBaseline>
  );
};

export default FullPageLoading;
