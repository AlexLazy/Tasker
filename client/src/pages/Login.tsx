import React, { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { useMutation, gql } from "@apollo/client";
import { useHistory } from "react-router-dom";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { meVar, authVar } from "../cache";
import FullPageLoading from "../components/FullPageLoading";

const useStyles = makeStyles({
  root: {
    textAlign: "center",
    zIndex: 2,
  },
  btn: {
    marginBottom: 16,
  },
});

const LOGIN = gql`
  mutation Login($id_token: String!) {
    login(id_token: $id_token) {
      message
      userInfo {
        id
        name
        email
        avatar
      }
      token
    }
  }
`;
const Login: FC = () => {
  const [login, { loading }] = useMutation(LOGIN);
  const classes = useStyles();
  const history = useHistory();

  const handleSuccess = async (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    const { id_token } = (response as GoogleLoginResponse).getAuthResponse();
    const { data } = await login({ variables: { id_token } });
    const { expiresAt, token } = data.login;

    meVar(data.login.userInfo);
    authVar({ expiresAt, token });
    history.push("/dashboard");
  };

  return loading ? (
    <FullPageLoading />
  ) : (
    <FullPageLoading>
      <section className={classes.root}>
        <GoogleLogin
          className={classes.btn}
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ""}
          buttonText="Login"
          onSuccess={handleSuccess}
          isSignedIn={true}
          cookiePolicy={"single_host_origin"}
          render={({ onClick, disabled }) => (
            <Button
              variant="contained"
              color="primary"
              onClick={onClick}
              disabled={disabled}
            >
              Вход
            </Button>
          )}
        />
      </section>
    </FullPageLoading>
  );
};

export default Login;
