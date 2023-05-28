import React, { useContext, useState } from 'react'
import NextLink from 'next/link';
import { AuthLayout } from '@/components/layouts'
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form';
import { validations } from '@/utils';
import { ErrorOutline } from '@mui/icons-material';
import { tesloApi } from '@/api';
import { AuthContext } from '@/context';
import { useRouter } from 'next/router';

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

    router.replace('/');
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
              <Link component={NextLink} href='/auth/login' passHref underline='always'>¿Ya tienes cuenta?</Link>
            </Grid>

          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}

export default RegisterPage