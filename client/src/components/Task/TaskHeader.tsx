import React, { FC, ChangeEvent } from 'react';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';

import CircleLoading from '../CircleLoading';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      marginBottom: theme.spacing(3)
    },
    label: {
      color: '#fff !important'
    },
    input: {
      marginLeft: theme.spacing(2),
      '& input, & label': {
        color: '#fff !important'
      },
      '& .MuiInput-underline:before, & .MuiInput-underline:after': {
        borderBottomColor: '#fff !important'
      }
    },
    selectBorder: {
      '&::before, &::after': {
        borderBottomColor: '#fff !important'
      }
    },
    select: {
      color: '#fff'
    },
    icon: {
      fill: '#fff'
    },
    btn: {
      marginLeft: theme.spacing(4)
    },
    btnGreen: {
      color: green[500]
    },
    close: {
      marginRight: 'auto'
    }
  })
);

interface TaskHeaderProps {
  status: 'OPEN' | 'CHECKS' | 'CLOSED';
  price_total: string;
  price: string;
  changeLoading: boolean;
  deleteLoading: boolean;
  disabled: boolean;
  isCreate: boolean;
  onStatus(e: ChangeEvent<{ name?: string | undefined; value: unknown }>): void;
  onPriceTotal(e: ChangeEvent<HTMLInputElement>): void;
  onPrice(e: ChangeEvent<HTMLInputElement>): void;
  onSave(): void;
  onDelete(): void;
  onEnabled(): void;
  onClose(): void;
}

const TaskHeader: FC<TaskHeaderProps> = ({
  status,
  price_total,
  price,
  changeLoading,
  deleteLoading,
  disabled,
  isCreate,
  onStatus,
  onPriceTotal,
  onPrice,
  onSave,
  onDelete,
  onEnabled,
  onClose
}) => {
  const classes = useStyles();

  return (
    <AppBar className={classes.header} position='static'>
      <Toolbar>
        <IconButton
          className={classes.close}
          edge='start'
          color='inherit'
          onClick={onClose}
          aria-label='close'
        >
          <CloseIcon />
        </IconButton>
        <FormControl>
          <InputLabel className={classes.label} htmlFor='task-status'>
            Статус
          </InputLabel>
          <Select
            className={classes.selectBorder}
            classes={{
              select: classes.select,
              icon: classes.icon
            }}
            value={status}
            onChange={onStatus}
            inputProps={{
              name: 'status',
              id: 'task-status'
            }}
            disabled={disabled || isCreate}
          >
            <MenuItem value='OPEN'>Открыта</MenuItem>
            <MenuItem value='CHECKS'>На проверке</MenuItem>
            <MenuItem value='CLOSED'>Закрыта</MenuItem>
          </Select>
        </FormControl>
        <TextField
          classes={{
            root: classes.input
          }}
          label='Стоимость задачи'
          color='#fff'
          type='number'
          value={price_total}
          onChange={onPriceTotal}
          disabled={disabled}
        />
        <TextField
          classes={{
            root: classes.input
          }}
          label='Стоимость работы'
          color='#fff'
          type='number'
          value={price}
          onChange={onPrice}
          disabled={disabled}
        />
        {disabled ? (
          <Button
            variant='outlined'
            className={classes.btn}
            color='inherit'
            onClick={onEnabled}
          >
            Редактировать
          </Button>
        ) : (
          <CircleLoading
            className={classes.btn}
            size={24}
            isLoading={changeLoading}
          >
            <Button
              classes={{
                outlined: classes.btnGreen
              }}
              variant='outlined'
              color='inherit'
              onClick={onSave}
              disabled={changeLoading}
            >
              Сохранить
            </Button>
          </CircleLoading>
        )}
        <CircleLoading
          className={classes.btn}
          size={24}
          isLoading={deleteLoading}
        >
          <Tooltip title='Удалить задачу' placement='bottom'>
            <div>
              <IconButton
                aria-label='Удалить задачу'
                onClick={onDelete}
                disabled={deleteLoading || isCreate}
              >
                <DeleteIcon color='error' />
              </IconButton>
            </div>
          </Tooltip>
        </CircleLoading>
      </Toolbar>
    </AppBar>
  );
};
export default TaskHeader;
