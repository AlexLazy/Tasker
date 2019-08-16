import React, { FC, useState } from 'react';

import { ApolloError } from 'apollo-client/errors/ApolloError';
import { useMutation } from '@apollo/react-hooks';
import { LOGIN } from '../gql/mutations';

import Snackbar from '@material-ui/core/Snackbar';

import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline
} from 'react-google-login';

import { FullPageLoading } from '../components';

const Login: FC = () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const [state, setState] = useState<{
    open: boolean;
    text: string | ApolloError;
  }>({
    text: 'top',
    open: false
  });
  const { text, open } = state;
  const [login, { loading }] = useMutation<{ login: string }>(LOGIN, {
    onCompleted({ login }) {
      if (login === 'User not found') {
        setState({ text: 'Такого пользователя не существует.', open: true });
      } else {
        localStorage.setItem('token', 'Bearer ' + login);
        document.location.reload();
      }
    },
    onError(error) {
      setState({ text: error.message, open: true });
    }
  });

  const responseGoogle = (login: Function) => (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    const { id_token } = (response as GoogleLoginResponse).getAuthResponse();

    login({
      variables: {
        id_token
      }
    });
  };

  function handleClose() {
    setState({ ...state, open: false });
  }

  return (
    <FullPageLoading>
      {!loading && clientId && (
        <GoogleLogin
          clientId={clientId}
          buttonText='Login'
          onSuccess={responseGoogle(login)}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />
      )}
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={text}
      />
    </FullPageLoading>
  );
};

export default Login;
