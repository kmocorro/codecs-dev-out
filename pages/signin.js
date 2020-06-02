import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { login } from '../utils/auth';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        Fab4 META
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();

    const username = useForm('');
    const password = useForm('');
    const [ responseError, setResponseError ] = useState('');
    const [ signInButton, setSignInButton ] = useState(false);

    function useForm(init){
        const [ value, setValue ] = useState(init);

        function handleOnChange(e){
            setValue(e.target.value);
        }

        return {
            value,
            onChange: handleOnChange
        }
    }

    async function handleOnSubmit(e){
        e.preventDefault();
        setResponseError('');
        setSignInButton(true);

        let route = 'http://dev-metaspf401.sunpowercorp.com:4000/login'

        try {
            const response = await fetch(route, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: username.value, 
                    password: password.value 
                })
            });

            if (response.ok) {
                const { token, err } = await response.json();

                console.log(token);
                if( typeof token === 'undefined'){
                    //console.log({ err })
                    setResponseError(err ? err : responseError)
                    setSignInButton(false);
                } else {
                    console.log({ token })
                    await login({ token });
                }
                
                
            } else {
                //console.log('Login failed.');

                let error = new Error(response.statusText)
                error.response = response

                //setResponseError(error)

                throw error
            }
        } catch (error) {
            console.error(' You have an error in your code or there are network issues. ', error)

            const { response } = error
            setResponseError(response ? response.statusText : responseError)
            setSignInButton(false);
        }

    }

    return (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            Sign-in
            </Typography>
            <form className={classes.form} >
                <TextField
                margin="normal"
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username.value}
                onChange={username.onChange}
                />
                <TextField
                    className={classes.textField}
                    margin="normal"
                    required
                    variant="outlined"
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password.value}
                    onChange={password.onChange}
                />
                {
                    signInButton ?
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        className={classes.submit}
                        disabled
                    >
                        Sign in
                    </Button>
                    
                    :
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        className={classes.submit}
                        onClick={handleOnSubmit}
                    >
                        Sign in
                    </Button>
                }
                <Grid container>
                <Grid item xs>
                    <Typography variant="body2" color="error">
                        {responseError}
                    </Typography>
                </Grid>
                </Grid>
                <Grid item xs={12} lg={12} md={12}>
                    <Typography color="textSecondary" variant="caption">
                        By signing in, you agree that you will enter your canteen electronic payment credentials to META. We, the "META" developers, Kevin Mocorro, Kristiana Mikaela Ayeng & Elmer Malazarte will never ask, save or track your password. If you have questions, please send an email to <Link href="mailto:kmocorro@sunpowercorp.com?subject=META%20Sign-in%20CEP%20" color="primary" style={{textDecoration: 'underline', color: 'black'}}>Kevin.</Link>.
                    </Typography>
                </Grid>
            </form>
        </div>
        <Box mt={8}>
            <Copyright />
        </Box>
        </Container>
    );
}