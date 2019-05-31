import React, { HTMLProps } from 'react';
import isEmail from 'is-email';
import { superstruct } from 'superstruct';
import { FieldProps, useField } from 'formik';
import { styled } from 'linaria/react';
import { ERROR_RED } from '../../util/constants';
import { ExpandAndContractSpinner } from './Spinner';

const PASSWORD_NOT_LONG_ENOUGH = 'Password must be at least 5 characters.';
const PASSWORD_TOO_LONG = 'Password must be less than 256 characters.';
const PASSWORDS_MUST_MATCH = 'Passwords must match';
const INVALID_EMAIL = 'Email must be a valid email.';

const struct = superstruct({
  types: {
    email: value => {
      if (!isEmail(value)) return INVALID_EMAIL;
      return true;
    },
    password: value => {
      if (value.length < 5) return PASSWORD_NOT_LONG_ENOUGH;
      if (value.length >= 256) return PASSWORD_TOO_LONG;
      return true;
    }
  }
});

export const loginValidation = struct({
  email: 'email',
  password: 'password'
});

export const registerValidation = struct({
  email: 'email',
  password: 'password',
  passwordConfirm: (value: any, data: any) =>
    value === data.password ? true : PASSWORDS_MUST_MATCH
});

export const StyledInput = styled.input<{ error: any }>`
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  border-radius: 2px;
  background-color: #f2f2f2;
  outline: ${({ error }) => (error ? `1px solid ${ERROR_RED}` : 'unset')};
  border: none;
  font-family: 'Spectral';
  font-weight: light;
  font-size: 16px;
  color: #333333;
`;

export const InputField: React.SFC<FieldProps<any>> = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const errored = touched[field.name] && errors[field.name];

  return <StyledInput {...field} {...props} error={errored} />;
};

const Container = styled.div`
  display: flex;
  flex-direction: horizontal;
  justify-content: center;
  align-items: center;
`;

const FormBox = styled.div`
  margin-top: 20px;
  text-align: center;
  width: 600px;
  padding: 50px;
  border: 1px solid #c4c4c4;
  border-radius: 5px;
  background: white;

  & form {
    text-align: left;
  }

  & button {
    width: 150px;
    height: 45px;
    border-radius: 2px;
    background-color: #535353;
    border: none;
    font-family: 'Spectral';
    font-size: 15px;
    color: white;
    display: block;
    margin: 30px auto;
  }

  & button:disabled {
    opacity: 0.5;
  }

  & label {
    font-family: 'Spectral';
    font-size: 18px;
    margin: 40px 0px;
    display: block;
  }
`;

const Header = styled.span`
  font-family: 'Spectral';
  font-weight: medium;
  font-size: 25px;
`;

const StatusError = styled.div`
  font-family: 'Spectral';
  font-weight: medium;
  font-size: 16px;
  color: ${ERROR_RED};
`;

export const MyTextField: React.FC<HTMLProps<HTMLInputElement>> = ({
  label,
  name,
  ...props
}) => {
  const [field, meta] = useField(name!);
  return (
    <label>
      {label}
      <StyledInput {...field} {...props} error={meta.error && meta.touched} />
    </label>
  );
};

const LoadingOrStatusBox = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const GenericFormBox: React.FC<{
  header: string;
  status: any;
  children: any;
  loading: boolean;
}> = ({ header, status, children, loading }) => {
  return (
    <Container>
      <FormBox>
        <Header>{header}</Header>
        {children}
        <LoadingOrStatusBox>
          {status && <StatusError>{status.error}</StatusError>}
          {loading && <ExpandAndContractSpinner dimension={50} margin={10} />}
        </LoadingOrStatusBox>
      </FormBox>
    </Container>
  );
};
