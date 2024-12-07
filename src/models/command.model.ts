import { uuidv4, capitalizeFirstLetter } from '../utils/shared.util';
import csvParser from 'csv-parser';
import pool from '../config/db';
import fs from 'fs';

interface Command {
    id: number;
    uuid: string;
    name: string;
    description: string;
    category_id: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

// Obtener todos los comandos
export const getAllCommands = async (page: number, limit: number): Promise<{ commands: any[]; total: number }> => {
    const offset = (page - 1) * limit;

    // Obtener comandos con paginación
    const [rows] = await pool.query(
        `SELECT 
            commands.uuid AS command_uuid, 
            commands.name AS command_name, 
            commands.description AS command_description, 
            commands.category_id, 
            categories.name AS category_name, 
            categories.uuid AS category_uuid 
        FROM 
            commands
        INNER JOIN 
            categories 
        ON 
            commands.category_id = categories.id 
        WHERE 
            commands.deleted_at IS NULL
        LIMIT ? OFFSET ?`,
        [limit, offset]
    );

    // Obtener el número total de comandos
    const [countResult] = await pool.query(`SELECT COUNT(*) AS total FROM commands WHERE deleted_at IS NULL`);
    const total = (countResult as any[])[0].total;

    // Transformar los datos
    const commands = (rows as any[]).map((row) => ({
        uuid: row.command_uuid,
        name: row.command_name,
        description: capitalizeFirstLetter(row.command_description),
        category: {
            id: row.category_id,
            uuid: row.category_uuid,
            name: capitalizeFirstLetter(row.category_name),
        },
    }));

    return { commands, total };
};



// Crear un nuevo comando
export const createCommand = async (name: string, description: string, category_id: number): Promise<void> => {
    // const commands = await searchSimiliraty(name);

    // if (commands)
    //     throw new Error('The command has already been registered.');

    await pool.query(
        'INSERT INTO commands (uuid, name, description, category_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [
            uuidv4(),
            name,
            description,
            category_id,
            new Date(),
            new Date()
        ]
    );
};

// Actualizar un comando por ID
export const updateCommand = async (uuid: string, name: string, description: string): Promise<void> => {
    await pool.query(
        'UPDATE commands SET name = ?, description = ?, updated_at = ? WHERE uuid = ?',
        [
            name,
            description,
            new Date(),
            uuid
        ]
    );
};

// Eliminar un comando por ID
export const deleteCommand = async (uuid: string): Promise<void> => {
    await pool.query(
        'UPDATE commands SET deleted_at = ? WHERE uuid = ?',
        [
            new Date(),
            uuid
        ]
    );

    // Validar si realmente se eliminara de la DB
    // await pool.query('DELETE FROM commands WHERE uuid = ?', [uuid]);
};

// Buscar un comando
export const searchSimilarity = async (command: string) => {
    const [rows] = await pool.query(
        'SELECT uuid, name, description, category_id, created_at, updated_at FROM commands WHERE name LIKE ?',
        [`%${command}%`]
    );

    return rows;
};

// Función para importar comandos desde un archivo CSV
export const importCommandsFromCSV = async (filePath: string): Promise<void> => {
    const commands: Command[] = [];

    // Lee el archivo CSV
    fs.createReadStream(filePath)
        .pipe(csvParser()) // Pasa el contenido al parser CSV
        .on('data', (row: any) => {
            // Prepara los datos para insertar en la base de datos
            const command: Command = {
                id: 0,
                uuid: uuidv4(),
                name: row.name,
                description: row.description,
                category_id: row.category_id,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
            };

            commands.push(command);
        })
        .on('end', async () => {
            // Al terminar de leer el archivo, inserta las categorías en la base de datos
            for (const command of commands) {
                await createCommand(command.name, command.description, command.category_id);
            }

            console.log('CSV import completed!');
        })
        .on('error', (error) => {
            console.error('Error reading CSV file:', error);
        });
};