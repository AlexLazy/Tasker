import React, { FC, ReactFragment, useState, useRef } from 'react';

import { REQUEST_ERROR } from '../../constants';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { GET_USER_PROJECTS } from '../../gql/queries';
import { ADD_PROJECT } from '../../gql/mutations';

import TextField from '@material-ui/core/TextField';

import AddBtn from './AddBtn';

const AddProjectBtn: FC = () => {
  const addBtnRef = useRef<ReactFragment & { success(): void }>(null);
  const [title, setTitle] = useState('');
  const client = useApolloClient();
  const [mutateAddProject, { loading }] = useMutation(ADD_PROJECT, {
    refetchQueries: [
      {
        query: GET_USER_PROJECTS
      }
    ],
    onCompleted({ createProject }) {
      client.writeData({
        data: {
          error: {
            __typename: 'error',
            text: createProject
              ? `Проект "${createProject.title}" успешно создан`
              : 'Произошла ошибка',
            open: true
          }
        }
      });
    },
    onError(error) {
      client.writeData(REQUEST_ERROR(error));
    }
  });

  const handleAddProject = async () => {
    await mutateAddProject({ variables: { title } });
    addBtnRef && addBtnRef.current && addBtnRef.current.success();
  };

  return (
    <AddBtn
      title='Добавить проект'
      onSave={handleAddProject}
      loading={loading}
      disabled={!title}
      ref={addBtnRef}
    >
      <TextField
        label='Название проекта'
        fullWidth
        onChange={e => setTitle(e.target.value)}
      />
    </AddBtn>
  );
};
export default AddProjectBtn;
