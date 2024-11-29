import { uuidv4 } from '../utils/shared.util';
import pool from '../config/db';

interface Category {
    id: number;
    uuid: string;
    name: string;
    description: string;
    svg: Text;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
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

