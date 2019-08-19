import React, { FC } from 'react';

import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { LOGIN } from '../gql/mutations';

import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline
} from 'react-google-login';

import FullPageLoading from '../components/FullPageLoading';

const Login: FC = () => {
  const client = useApolloClient();
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const [login, { loading }] = useMutation<{ login: string }>(LOGIN, {
    onCompleted({ login }) {
      if (login === 'User not found') {
        client.writeData({
          data: {
            error: {
              __typename: 'error',
              text: 'Такого пользователя не существует.',
              open: true
            }
          }
        });
      } else {
        localStorage.setItem('token', 'Bearer ' + login);
        document.location.reload();
      }
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
    </FullPageLoading>
  );
};

export default Login;
