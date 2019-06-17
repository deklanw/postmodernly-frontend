import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { FormikConfig, Formik } from 'formik';

import {
  GenericFormBox,
  MyTextField,
  justEmailValidation
} from '../shared/input';
import { useForgotPasswordMutation } from '../../generated/graphql';
import { SOMETHING_WENT_WRONG } from '../../util/constants';
import { superstructToFormik } from '../../util/util';

interface FormValues {
  [key: string]: string;
  email: string;
}

const ForgotPassword: React.FC<RouteComponentProps> = ({ history }) => {
  const forgotPassword = useForgotPasswordMutation();

  const formikConfig: FormikConfig<FormValues> = {
    validate: v => {
      try {
        justEmailValidation(v);
      } catch (e) {
        return superstructToFormik(e);
      }
      return {};
    },
    initialValues: { email: '' },
    onSubmit: async (values, { setStatus }) => {
      setStatus({});
      const { email } = values;

      try {
        const response = await forgotPassword({
          variables: { email }
        });

        if (response && response.data && response.data.forgotPassword) {
          setStatus({
            success: 'Check your email to complete changing your password.'
          });
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
        <GenericFormBox
          header="Forgot Password"
          status={status}
          loading={isSubmitting}
        >
          <form onSubmit={handleSubmit}>
            <MyTextField
              label="Email"
              type="text"
              name="email"
              placeholder="Your email"
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

export default ForgotPassword;
