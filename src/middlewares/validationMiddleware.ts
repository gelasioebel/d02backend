import * as yup from 'yup';

export const validationMiddleware = async (data: any) => {
  const schema = yup.object({
    tipo: yup.string().required('Tipo é obrigatório'),
    nome: yup.string().required('Nome é obrigatório'),
    altura: yup.number().required('Altura é obrigatória').positive('Altura deve ser positiva'),
  });

  try {
    await schema.validate(data, { abortEarly: false });
    return { error: null }; 
  } catch (err: any) {
    return { error: err.inner }; 
  }
};
