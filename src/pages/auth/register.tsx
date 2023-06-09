import React, { useContext, useState } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { getSession, signIn } from 'next-auth/react';

import { useForm } from 'react-hook-form';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material'
import ErrorOutline from '@mui/icons-material/ErrorOutline';

import { AuthLayout } from '@/components/layouts'
import { validations } from '@/utils';
import { AuthContext } from '@/context';

type FormData = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const {registerUser} = useContext(AuthContext)
  
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')

  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onRegisterForm = async ({name, email, password}: FormData) => {
    setShowError(false)

    const {hasError, message} = await registerUser(name, email, password);

    if(hasError) {
      setShowError(true);
      setErrorMessage(message!);
      setTimeout(() =>setShowError(false), 3000);      
      return;
    }

    // const destination = router.query.p?.toString() || '/';    
    // router.replace(destination);
    await signIn('credentials',{email, password})
  }

  return (
    <AuthLayout title='Crear cuenta'>
      <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component={'h1'}>Crear cuenta</Typography>
              {
                showError && 
                <Chip
                  label={`${errorMessage}`}
                  // label="El correo ya está en uso"
                  color="error"
                  icon={<ErrorOutline />}
                  className='fadeIn'
                />
              }
            </Grid>

            <Grid item xs={12}>
              <TextField label="Nombre completo" variant="filled" fullWidth
                {...register('name', {
                  required: 'Este campo es requerido',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                })}
                error={!!errors.name}
                helperText={errors.name?.message} />
            </Grid>

            <Grid item xs={12}>
              <TextField label="Correo" variant="filled" fullWidth
                {...register('email', {
                  required: 'Este campo es requerido',
                  validate: validations.isEmail
                })}
                error={!!errors.email}
                helperText={errors.email?.message} />
            </Grid>

            <Grid item xs={12}>
              <TextField label="Contraseña" type='password' variant="filled" fullWidth
                {...register('password', {
                  required: 'Este campo es requerido',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                })}
                error={!!errors.password}
                helperText={errors.password?.message} />
            </Grid>

            <Grid item xs={12}>
              <Button
                type='submit'
                color='secondary'
                className='circular-btn' size='large' fullWidth>
                Crear cuenta
              </Button>
            </Grid>

            <Grid item xs={12} display={'flex'} justifyContent={'center'}>
              <Link component={NextLink} href={router.query.q ? `/auth/login?p=${router.query.q}`:'/auth/login'}  passHref underline='always'>¿Ya tienes cuenta?</Link>
            </Grid>

          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const session = await getSession({req});
  const { p = '/'} = query;

  if(session){
    return {
      redirect:{
        destination: p.toString(),
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}

export default RegisterPage