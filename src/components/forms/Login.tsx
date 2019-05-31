import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { FormikConfig, Formik } from 'formik';

import { GenericFormBox, loginValidation, MyTextField } from '../shared/input';
import { ME_QUERY } from '../../graphql/graphql';
import { useLoginUserMutation } from '../../generated/graphql';
import { SERVER_DOWN } from '../../util/constants';
import { superstructToFormik } from '../../util/util';

interface FormValues {
  [key: string]: string;
  email: string;
  password: string;
}

const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const loginUser = useLoginUserMutation();

  const formikConfig: FormikConfig<FormValues> = {
    validate: v => {
      try {
        loginValidation(v);
      } catch (e) {
        return superstructToFormik(e);
      }
      return {};
    },
    initialValues: { email: '', password: '' },
    onSubmit: async (values, { setStatus }) => {
      setStatus({});
      const { email, password } = values;
      try {
        const response = await loginUser({
          variables: { email, password },
          update: (store, { data }) => {
            if (!data || !data.login) {
              return;
            }

            // update Me query, triggering rerender in Header .
            store.writeQuery({
              query: ME_QUERY,
              data: {
                me: {
                  __typename: data.login.__typename,
                  id: data.login.id,
                  email: data.login.email
                }
              }
            });
          }
        });

        if (response && response.data && response.data.login) {
          history.push('/');
        }
        if (response && response.data && !response.data.login) {
          setStatus({
            error: 'Credentials incorrect. Check your email and password.'
          });
        }
      } catch (errors) {
        setStatus({
          error: SERVER_DOWN
        });
      }
    }
  };

  return (
    <Formik {...formikConfig}>
      {({ isSubmitting, isValid, handleSubmit, status }) => (
        <GenericFormBox header="Login" status={status} loading={isSubmitting}>
          <form onSubmit={handleSubmit}>
            <MyTextField
              label="Email"
              type="text"
              name="email"
              placeholder="Your email"
            />
            <MyTextField
              label="Password"
              type="password"
              name="password"
              placeholder="Your password"
            />
            <button type="submit" disabled={isSubmitting || !isValid}>
              Submit
            </button>
          </form>
        </GenericFormBox>
      )}
    </Formik>
  );
};

export default Login;
