import * as yup from 'yup';

export const validationMiddleware = async (data: any) => {
  const schema = yup.object({
    nome: yup.string().required('Nome é obrigatório'),
    subtitulo: yup.string().required('Subtítulo é obrigatório'),
    etiquetas: yup.string().required('Etiquetas são obrigatórias'),
    preco: yup.number().required('Preço é obrigatório').positive('Preço deve ser positivo'),
    caracteristicas: yup.string().required('Características são obrigatórias'),
    descricao: yup.string().required('Descrição é obrigatória'),
    url_imagem: yup.string().required('URL da imagem é obrigatória'),
    tipo_planta_id: yup.number().required('Tipo de planta é obrigatório').positive('ID do tipo de planta deve ser positivo'),
    esta_em_promocao: yup.boolean().optional(),
    porcentagem_desconto: yup.number().optional().when('esta_em_promocao', {
      is: true,
      then: (schema) => schema.required('Porcentagem de desconto é obrigatória quando está em promoção')
          .positive('Porcentagem de desconto deve ser positiva')
          .max(100, 'Porcentagem de desconto não pode ser maior que 100%')
    })
  });

  try {
    await schema.validate(data, { abortEarly: false });
    return { error: null };
  } catch (err: any) {
    return { error: err.inner };
  }
};