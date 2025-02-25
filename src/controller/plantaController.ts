import { Request, Response } from 'express';
import db from '../dataBase/connectDB';  

export const getPlantas = async (req: Request, res: Response) => {
  const query = `
    SELECT * FROM plantas;
  `;

  try {
    const rows = await new Promise<any[]>((resolve, reject) => {
      db.all(query, (err, rows) => {
        if (err) {
          reject(err);  
        } else {
          resolve(rows);  
        }
      });
    });

    res.status(200).json(rows);
  } catch (err: any) {
    console.error('Erro ao buscar plantas:', err);
    res.status(500).json({ message: 'Erro ao buscar plantas', error: err.message });
  }
};

export const addPlanta = (req: Request, res: Response): void => {
  const { nome, subtitulo, etiquetas, preco, esta_em_promocao, porcentagem_desconto, caracteristicas, descricao, url_imagem, tipo_planta_id } = req.body;

  if (!nome || !subtitulo || !etiquetas || !preco || !caracteristicas || !descricao || !url_imagem || !tipo_planta_id) {
    res.status(400).json({ message: 'Dados incompletos. Todos os campos são obrigatórios.' });
    return;
  }

  const query = `
    INSERT INTO plantas (nome, subtitulo, etiquetas, preco, esta_em_promocao, porcentagem_desconto, caracteristicas, descricao, url_imagem, tipo_planta_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [nome, subtitulo, etiquetas, preco, esta_em_promocao, porcentagem_desconto, caracteristicas, descricao, url_imagem, tipo_planta_id], function(err) {
    if (err) {
      console.error('Erro ao adicionar planta:', err);
      res.status(500).json({ message: 'Erro ao adicionar planta', error: err.message });
      return;
    }

    res.status(201).json({ message: 'Planta adicionada com sucesso!' });
  });
};
