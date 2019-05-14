import React from 'react';
import { FieldProps } from 'formik';
import styled from '@emotion/styled';
import * as yup from 'yup';

const EMAIL_NOT_LONG_ENOUGH = 'Email must be at least 3 characters.';
const PASSWORD_NOT_LONG_ENOUGH = 'Password must be at least 3 characters.';
const INVALID_EMAIL = 'Email must be a valid email.';

const emailValidation = yup
  .string()
  .min(3, EMAIL_NOT_LONG_ENOUGH)
  .max(255)
  .email(INVALID_EMAIL)
  .required();
const passwordValidation = yup
  .string()
  .min(5, PASSWORD_NOT_LONG_ENOUGH)
  .max(255)
  .required();

export const registerValidation = yup.object().shape({
  email: emailValidation,
  password: passwordValidation,
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password'), null])
    .required()
});

export const loginValidation = yup.object().shape({
  email: emailValidation,
  password: passwordValidation
});

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  border-radius: 2px;
  background-color: #f2f2f2;
  border: ${(props: any) => (props.error ? '1px solid #ff5757' : 'none')};
  font-family: 'Domaine Text Light';
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
  margin-top: 100px;
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
    font-family: 'Domaine Text Regular';
    font-size: 15px;
    color: white;
    display: block;
    margin: 30px auto 0 auto;
  }

  & button:disabled {
    background-color: #b5b5b5;
  }

  & label {
    font-family: 'Domaine Text Regular';
    font-size: 18px;
    margin: 40px 0px;
    display: block;
  }
`;

const Header = styled.span`
  font-family: 'Domaine Text Medium';
  font-size: 25px;
`;

export const GenericFormBox = (props: any) => {
  const { header, children } = props;
  return (
    <Container>
      <FormBox>
        <Header>{header}</Header>
        {children}
      </FormBox>
    </Container>
  );
};
