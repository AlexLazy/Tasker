import React, { FC, useState } from 'react';

import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { GET_USER_PROJECTS } from '../../gql/queries';
import { ADD_PROJECT } from '../../gql/mutations';

import TextField from '@material-ui/core/TextField';

import AddBtn from './AddBtn';

const AddProjectBtn: FC = () => {
  const [title, setTitle] = useState('');
  const client = useApolloClient();
  const [mutateAddProject, { loading: loadingAddProject }] = useMutation(
    ADD_PROJECT,
    {
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
  return (
    <AddBtn
      title='Добавить проект'
      reguest={mutateAddProject}
      loading={loadingAddProject}
      variables={{ title }}
    >
      <TextField
        label='Название проекта'
        onChange={e => setTitle(e.target.value)}
      />
    </AddBtn>
  );
};
export default AddProjectBtn;
