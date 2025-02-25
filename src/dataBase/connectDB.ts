import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('db.db', (err) => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados', err);
  } else {
    console.log('Conexão com o banco de dados bem-sucedida!');
  }
});

export default db;
