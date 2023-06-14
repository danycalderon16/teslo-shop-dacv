import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';

import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import DriveFileRenameOutline from '@mui/icons-material/DriveFileRenameOutline';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import UploadOutlined from '@mui/icons-material/UploadOutlined';

import { AdminLayout } from '../../../components/layouts'
import { IProduct } from '../../../interfaces';
import { dbProducts } from '../../../database';
import { tesloApi } from '@/api';
import { Product } from '@/models';


const validTypes = ['shirts', 'pants', 'hoodies', 'hats']
const validGender = ['men', 'women', 'kid', 'unisex']
const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

interface FormData {
	_id?: string;
	description: string;
	images: string[];
	inStock: number;
	price: number;
	sizes: string[];
	slug: string;
	tags: string[];
	title: string;
	type: string;
	gender: string;
}

interface Props {
	product: IProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {

	const { register,
		control,
		handleSubmit,
		formState: { errors },
		getValues,
		setValue,
		watch
	} = useForm<FormData>({
		defaultValues: product,
	});

	const router = useRouter();
	const [newTagsValue, setNewTagsValue] = useState('');
	const [isSaving, setIsSaving] = useState(false);
 	const fileInputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		const subscription = watch((value, { name, type }) => {
			if (name == 'title') {
				const newSlug = value.title?.trim()
					.replaceAll(' ', '_')
					.replaceAll('\'', '')
					.toLocaleLowerCase() || '';
				setValue('slug', newSlug);
			}
		});
		return () => {
			subscription.unsubscribe();
		};
	}, [watch, setValue]);

	const onChangeSize = (size: string) => {
		const currentSizes = getValues('sizes');
		if (currentSizes.includes(size)) {
			return setValue('sizes', currentSizes.filter(s => s !== size), { shouldValidate: true })
		}

		const tamaniosPredefinidos: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
		const arreglo = [...currentSizes, size]

		arreglo.sort((a, b) => {
			return tamaniosPredefinidos.indexOf(a) - tamaniosPredefinidos.indexOf(b);
		});

		setValue('sizes', arreglo, { shouldValidate: true });
	}

	const onDeleteTag = (tag: string) => {
		const currentTags = getValues('tags');
		setValue('tags', currentTags.filter(current => current !== tag), { shouldValidate: true });
	}

	const onSubmit = async (form: FormData) => {
		if (form.images.length < 2) return alert('Mínimo 2 imágenes');
		setIsSaving(true);
		try {
			const { data } = await tesloApi({
				url: '/admin/products',
				method: form._id ? 'PUT' : 'POST',
				data: form
			});
			console.log({ data });

			if (!form._id) {
				router.replace(`/admin/products/${form.slug}`);
			} else {
				setIsSaving(false);
			}
		} catch (error) {
			console.error(error);
			setIsSaving(false);
		}
	}

	const addNewTags = () => {
		// const words = newTagsValue.trim().split(' ');
		// // const wordsArr = words.filter(word => !tags.includes(word));
		// setTags(state => state.concat(words.filter(word => !tags.includes(word))));

		const newTag = newTagsValue.trim().toLocaleLowerCase();
		setNewTagsValue('');
		const currentTags = getValues('tags');

		if (currentTags.includes(newTag)) return;

		setValue('tags', [...currentTags, newTag], { shouldValidate: true });
	}

	const onFileSelected = ({target}:ChangeEvent<HTMLInputElement>) =>{
		if(!target.files || target.files.length === 0) return;

		
		try {
			for(const file of target.files) {
				const  formData = new FormData();
				console.log(file);
				
			}

		} catch (error) {
			
		}
		
	}

	return (
		<AdminLayout
			title={'Producto'}
			subTitle={`Editando: ${product.title}`}
			icon={<DriveFileRenameOutline />}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
					<Button
						color="secondary"
						startIcon={<SaveOutlined />}
						sx={{ width: '150px' }}
						type="submit"
						disabled={isSaving}
					>
						Guardar
					</Button>
				</Box>

				<Grid container spacing={2}>
					{/* Data */}
					<Grid item xs={12} sm={6}>

						<TextField
							label="Título"
							variant="filled"
							fullWidth
							sx={{ mb: 1 }}
							{...register('title', {
								required: 'Este campo es requerido',
								minLength: { value: 2, message: 'Mínimo 2 caracteres' }
							})}
							error={!!errors.title}
							helperText={errors.title?.message}
						/>

						<Controller
							name="description"
							rules={{
								required: 'This field is required',
								minLength: {
									value: 8,
									message: 'You must type at least 8 characters!'
								}
							}}
							control={control}
							defaultValue=""
							render={({ field }) => (
								<TextField
									{...field}
									label="Description"
									variant="filled"
									fullWidth
									multiline
									rows={5} // <-- ESTO LO ARREGLA
									sx={{ mb: 1 }}
									error={!!errors.description}
									helperText={errors.description?.message}
								/>
							)}
						/>

						<TextField
							label="Inventario"
							type='number'
							variant="filled"
							fullWidth
							sx={{ mb: 1 }}
							{...register('inStock', {
								required: 'Este campo es requerido',
								min: { value: 0, message: 'Mínimo valor de cero' }
							})}
							error={!!errors.inStock}
							helperText={errors.inStock?.message}
						/>

						<TextField
							label="Precio"
							type='number'
							variant="filled"
							fullWidth
							sx={{ mb: 1 }}
							{...register('price', {
								required: 'Este campo es requerido',
								min: { value: 0, message: 'Mínimo valor de cero' }
							})}
							error={!!errors.price}
							helperText={errors.price?.message}
						/>

						<Divider sx={{ my: 1 }} />

						<FormControl sx={{ mb: 1 }}>
							<FormLabel>Tipo</FormLabel>
							<RadioGroup
								row
								value={getValues('type')}
								onChange={({ target }) => setValue('type', target.value, { shouldValidate: true })}
							>
								{
									validTypes.map(option => (
										<FormControlLabel
											key={option}
											value={option}
											control={<Radio color='secondary' />}
											label={capitalize(option)}
										/>
									))
								}
							</RadioGroup>
						</FormControl>

						<FormControl sx={{ mb: 1 }}>
							<FormLabel>Género</FormLabel>
							<RadioGroup
								row
								value={getValues('gender')}
								onChange={({ target }) => setValue('gender', target.value, { shouldValidate: true })}
							>
								{
									validGender.map(option => (
										<FormControlLabel
											key={option}
											value={option}
											control={<Radio color='secondary' />}
											label={capitalize(option)}
										/>
									))
								}
							</RadioGroup>
						</FormControl>

						<FormGroup>
							<FormLabel>Tallas</FormLabel>
							{
								validSizes.map(size => (
									<FormControlLabel
										key={size}
										control={<Checkbox checked={getValues('sizes').includes(size)} />}
										label={size}
										onChange={() => onChangeSize(size)}
									/>
								))
							}
						</FormGroup>

					</Grid>

					{/* Tags e imagenes */}
					<Grid item xs={12} sm={6}>
						<TextField
							label="Slug - URL"
							variant="filled"
							fullWidth
							sx={{ mb: 1 }}
							{...register('slug', {
								required: 'Este campo es requerido',
								validate: (val) => val.trim().includes(' ') ? 'No puede tener espacios' : undefined
							})}
							error={!!errors.slug}
							helperText={errors.slug?.message}
						/>

						<TextField
							label="Etiquetas"
							variant="filled"
							fullWidth
							value={newTagsValue}
							onChange={(e) => setNewTagsValue(e.target.value)}
							sx={{ mb: 1 }}
							helperText="Presiona [spacebar] para agregar"
							onKeyUp={({ code }) => code === 'Space' ? addNewTags() : undefined}
						/>

						<Box sx={{
							display: 'flex',
							flexWrap: 'wrap',
							listStyle: 'none',
							p: 0,
							m: 0,
						}}
							component="ul">
							{
								getValues('tags').map((tag) => {

									return (
										<Chip
											key={tag}
											label={tag}
											onDelete={() => onDeleteTag(tag)}
											color="primary"
											size='small'
											sx={{ ml: 1, mt: 1 }}
										/>
									);
								})}
						</Box>

						<Divider sx={{ my: 2 }} />

						<Box display='flex' flexDirection="column">
							<FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
							<Button
								color="secondary"
								fullWidth
								startIcon={<UploadOutlined />}
								sx={{ mb: 3 }}
								onClick={() => fileInputRef.current?.click()}>
								Cargar imagen
							</Button>
							<input
							ref={fileInputRef}
								type="file"
								multiple
								accept='image/png, image/jpeg, image/gif'
								style={{ display: 'none' }}
								onChange={onFileSelected}/>

							<Chip
								label="Es necesario al 2 imagenes"
								color='error'
								variant='outlined'/>

							<Grid container spacing={2}>
								{
									product.images.map(img => (
										<Grid item xs={4} sm={3} key={img}>
											<Card>
												<CardMedia
													component='img'
													className='fadeIn'
													image={`/products/${img}`}
													alt={img}
												/>
												<CardActions>
													<Button fullWidth color="error">
														Borrar
													</Button>
												</CardActions>
											</Card>
										</Grid>
									))
								}
							</Grid>

						</Box>

					</Grid>

				</Grid>
			</form>
		</AdminLayout>
	)
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ query }) => {

	const { slug = '' } = query;

	let product: IProduct | null;

	if (slug === 'new') {
		const tempProduct = JSON.parse(JSON.stringify(new Product()))
		delete tempProduct._id;
		tempProduct.images = ['img1.jpg', 'img2.jpg'];
		product = tempProduct;
	} else {
		product = await dbProducts.getProductBySlug(slug.toString());
	}

	if (!product) {
		return {
			redirect: {
				destination: '/admin/products',
				permanent: false,
			}
		}
	}


	return {
		props: {
			product
		}
	}
}


export default ProductAdminPage