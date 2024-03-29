import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { FormikConfig, Formik } from 'formik';
import { styled } from 'linaria/react';

import {
  GenericFormBox,
  registerValidation,
  MyTextField
} from '../shared/input';
import { useRegisterMutation } from '../../generated/graphql';
import { SOMETHING_WENT_WRONG } from '../../util/constants';
import { superstructToFormik } from '../../util/util';

interface FormValues {
  [key: string]: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const ResendConfirmation = styled(Link)`
  font-size: 14px;
`;

const ResendContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Register: React.FC<RouteComponentProps> = ({ history }) => {
  const registerUser = useRegisterMutation();

  const formikConfig: FormikConfig<FormValues> = {
    validate: v => {
      try {
        registerValidation(v);
      } catch (e) {
        return superstructToFormik(e);
      }
      return {};
    },
    initialValues: { email: '', password: '', passwordConfirm: '' },
    onSubmit: async (values, { setStatus }) => {
      setStatus({});
      const { email, password, passwordConfirm } = values;

      try {
        const response = await registerUser({
          variables: { data: { email, password } }
        });

        if (response && response.data && response.data.register) {
          setStatus({ success: 'Registered successfully. Check your email.' });
        }
      } catch (errors) {
        setStatus({
          error: SOMETHING_WENT_WRONG
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
            <ResendContainer>
              <ResendConfirmation to="/resend-confirmation">
                Resend confirmation email?
              </ResendConfirmation>
            </ResendContainer>
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
