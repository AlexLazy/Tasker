import { InMemoryCache, ReactiveVar, makeVar } from "@apollo/client";

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        me: {
          read() {
            return meVar();
          },
        },
        auth: {
          read() {
            return authVar();
          },
        },
        error: {
          read() {
            return errorVar();
          },
        },
      },
    },
  },
});

interface UserState {
  id: number | null;
  name: string;
  email: string;
  avatar: string;
}
const user: UserState = {
  id: null,
  name: "",
  email: "",
  avatar: "",
};

interface AuthState {
  expiresAt: string;
  token: string;
}
const auth: AuthState = {
  expiresAt: "",
  token: "",
};

interface ErrorState {
  text: string;
  open: boolean;
}
const error: ErrorState = {
  text: "",
  open: false,
};

export const meVar: ReactiveVar<UserState> = makeVar<UserState>(user);
export const authVar: ReactiveVar<AuthState> = makeVar<AuthState>(auth);
export const errorVar: ReactiveVar<ErrorState> = makeVar<ErrorState>(error);
