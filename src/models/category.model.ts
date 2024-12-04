import { uuidv4 } from '../utils/shared.util';
import csvParser from 'csv-parser';
import pool from '../config/db';
import fs from 'fs';

interface Category {
    id: number;
    uuid: string;
    name: string;
    description: string;
    svg: Text;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

// Obtener todas las categorías
export const getAllCategories = async (): Promise<Category[]> => {
    const [rows] = await pool.query(
        'SELECT uuid, name, description, svg FROM categories WHERE deleted_at IS NULL'
    );
    return rows as Category[];
};

// Crear una nueva categoría
export const createCategory = async (name: string, description: string, svg: Text): Promise<void> => {
    // const categories = await searchSimiliraty(name);

    // if (categories)
    //     throw new Error('The category has already been registered.');

    await pool.query(
        'INSERT INTO categories (uuid, name, description, svg, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)', 
        [
            uuidv4(),
            name, 
            description, 
            svg, 
            new Date(), 
            new Date()
        ]
    );
};

// Actualizar una categoría por ID
export const updateCategory = async (uuid: string, name: string, description: string, svg: string): Promise<void> => {
    await pool.query(
        'UPDATE categories SET name = ?, description = ?, svg = ?, updated_at = ? WHERE uuid = ?', 
        [
            name, 
            description, 
            svg,
            new Date(),
            uuid
        ]
    );
};

// Eliminar una categoría por ID
export const deleteCategory = async (uuid: string): Promise<void> => {
    await pool.query(
        'UPDATE categories SET deleted_at = ? WHERE uuid = ?', 
        [
            new Date(),
            uuid
        ]
    );
    
    // Validar si realmente se eliminara de la DB
    // await pool.query('DELETE FROM categories WHERE uuid = ?', [uuid]);
};

// Buscar una categoria existente
export const searchSimilarity = async (category: string) => {
    const [rows] = await pool.query(
        'SELECT uuid, name, description, svg, created_at, updated_at FROM categories WHERE name LIKE ?', 
        [`%${category}%`]
    );

    return rows;
};

// Función para importar categorías desde un archivo CSV
export const importCategoriesFromCSV = async (filePath: string): Promise<void> => {
    const categories: Category[] = [];
  
    // Lee el archivo CSV
    fs.createReadStream(filePath)
      .pipe(csvParser()) // Pasa el contenido al parser CSV
      .on('data', (row: any) => {
        // Prepara los datos para insertar en la base de datos
        const category: Category = {
          id: 0,
          uuid: uuidv4(),
          name: row.name,
          description: row.description,
          svg: row.svg,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        };
  
        categories.push(category);
      })
      .on('end', async () => {
        // Al terminar de leer el archivo, inserta las categorías en la base de datos
        for (const category of categories) {
          await createCategory(category.name, category.description, category.svg);
        }
  
        console.log('CSV import completed!');
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
      });
  };