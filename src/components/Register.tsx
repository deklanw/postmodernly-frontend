import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { FormikConfig, Formik } from 'formik';

import {
  GenericFormBox,
  registerValidation,
  MyTextField
} from './shared/input';
import { useRegisterMutation } from '../generated/graphql';
import { SERVER_DOWN, SOMETHING_WENT_WRONG } from '../util/constants';

interface FormValues {
  [key: string]: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const Register: React.FC<RouteComponentProps> = ({ history }) => {
  const registerUser = useRegisterMutation();

  const formikConfig: FormikConfig<FormValues> = {
    validationSchema: registerValidation,
    initialValues: { email: '', password: '', passwordConfirm: '' },
    onSubmit: async (values, { setStatus }) => {
      setStatus({});
      const { email, password, passwordConfirm } = values;

      try {
        const response = await registerUser({
          variables: { data: { email, password } }
        });

        if (response && response.data) {
          history.push('/');
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
        <GenericFormBox header="Sign-up" status={status} loading={isSubmitting}>
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
            <MyTextField
              label="Confirm password"
              type="password"
              name="passwordConfirm"
              placeholder="Your password again"
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

export default Register;
