import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
} from '@mui/material';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const dispatch = useDispatch();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
  };

  return (
    <div>
      <Container maxWidth="xl">
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <FormControl variant="standard">
              <InputLabel htmlFor="Email">Email</InputLabel>
              <Input
                id="Email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.currentTarget.value)
                }
                aria-describedby="component-helper-text"
              />
              <FormHelperText id="component-helper-text">
                Some important helper text
              </FormHelperText>
            </FormControl>

            <FormControl variant="standard">
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.currentTarget.value)
                }
                aria-describedby="component-helper-text"
              />
              <FormHelperText id="component-helper-text">
                Some important helper text
              </FormHelperText>
            </FormControl>
            <Button type="submit">Отправить</Button>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default Login;
