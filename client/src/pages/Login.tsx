import React, { FC } from 'react';

import { useMutation } from '@apollo/react-hooks';
import { LOGIN } from '../gql/mutations';

import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline
} from 'react-google-login';

import FullPageLoading from '../components/FullPageLoading';

const Login: FC = () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const [login] = useMutation<{ login: string }>(LOGIN, {
    onCompleted({ login }) {
      localStorage.setItem('token', 'Bearer ' + login);
      document.location.reload();
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
      {clientId && (
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
