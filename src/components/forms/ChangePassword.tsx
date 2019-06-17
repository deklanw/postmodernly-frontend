import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { FormikConfig, Formik } from 'formik';

import {
  GenericFormBox,
  MyTextField,
  changePasswordValidation
} from '../shared/input';
import { useChangePasswordMutation } from '../../generated/graphql';
import { SOMETHING_WENT_WRONG } from '../../util/constants';
import { superstructToFormik } from '../../util/util';

interface FormValues {
  [key: string]: string;
  password: string;
  passwordConfirm: string;
}

type Params = {
  token: string;
};

const ChangePassword: React.FC<RouteComponentProps<Params>> = ({
  history,
  match
}) => {
  const registerUser = useChangePasswordMutation();

  const formikConfig: FormikConfig<FormValues> = {
    validate: v => {
      try {
        changePasswordValidation(v);
      } catch (e) {
        return superstructToFormik(e);
      }
      return {};
    },
    initialValues: { password: '', passwordConfirm: '' },
    onSubmit: async (values, { setStatus }) => {
      setStatus({});
      const { password, passwordConfirm } = values;

      try {
        const response = await registerUser({
          variables: { data: { password, token: match.params.token } }
        });

        if (response && response.data && response.data.changePassword) {
          setStatus({
            success: 'Password changed successfully. Redirecting to login...'
          });
          setTimeout(() => history.push('/login'), 3000);
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
          header="Change your password"
          status={status}
          loading={isSubmitting}
        >
          <form onSubmit={handleSubmit}>
            <MyTextField
              label="Password"
              type="password"
              name="password"
              placeholder="Your new password"
            />
            <MyTextField
              label="Confirm password"
              type="password"
              name="passwordConfirm"
              placeholder="Your new password again"
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

export default ChangePassword;
