import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { SERVERURL } from 'src/utils/serverurl';

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated = window.sessionStorage.getItem('authenticated') === 'true';
    } catch (err) {
      console.error(err);
    }

    dispatch({
      type: HANDLERS.INITIALIZE
    });
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const signIn = async (email, password) => {
    try {
      const res = await axios.get(`${SERVERURL}/User/login/`, {
        params: {email, password}
      })
      try {
        window.sessionStorage.setItem('authenticated', 'true');
      } catch (err) {
        console.error(err);
      }

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: res.data
      })
    } catch (error) {
      throw new Error("Incorrect Email or Password");
    }
  };

  const signUp = async (email, name, password, level) => {
    if (!email.endsWith('@uwaterloo.ca')) {
      throw new Error('Email must be an @uwaterloo.ca domain.')
    }
    try {
      const res = await axios.get(`${SERVERURL}/User/register/`, {
        params: {email, name, password, level}
      })
      try {
        window.sessionStorage.setItem('authenticated', 'true');
      } catch (err) {
        console.error(err);
      }

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: res.data
      })
    } catch (error) {
      console.log(error);
      throw new Error("You already have an account");
    }  
  };

  const signOut = () => {
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
