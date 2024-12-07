import { Request, Response, RequestHandler } from 'express';
import fs from 'fs';
import {
    getAllCommands,
    createCommand,
    updateCommand,
    deleteCommand,
    searchSimilarity,
    importCommandsFromCSV
} from '../models/command.model';

export const getCommandsController = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
        const { commands, total } = await getAllCommands(page, limit);

        res.status(200).json({
            data: commands,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch commands", error });
    }
};

export const addCommand = async (req: Request, res: Response) => {
    try {
        const { name, description, category_id } = req.body;
        await createCommand(name, description, category_id);
        res.status(201).json({ error: false, message: 'Command created successfully' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send({ error: false, message: error.message });
        } else {
            res.status(500).send({ error: true, message: "Failed to create command" });
        }
    }
};

export const updateCommandByUuid = async (req: Request, res: Response) => {
    try {
        const { uuid } = req.params;
        const { name, description } = req.body;
        await updateCommand(String(uuid), name, description);

        res.status(200).json({ error: false, message: req.body });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send({ error: false, message: error.message });
        } else {
            res.status(500).send({ error: true, message: "Failed to update command" });
        }
    }
};

export const deleteCommandByUuid = async (req: Request, res: Response) => {
    try {
        const { uuid } = req.params;
        await deleteCommand(String(uuid));
        res.status(200).json({ error: false, message: 'Command deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Failed to delete command' });
    }
};

export const getCommand = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const commands = await searchSimilarity(String(name));

        res.status(200).json({ error: false, data: commands });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send({ error: false, message: error.message });
        } else {
            res.status(500).send({ error: true, message: "Failed to search command" });
        }
    }
};

export const importCommands = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: true, message: 'No file uploaded' });
            return;
        }

        const filePath = req.file.path;

        await importCommandsFromCSV(filePath);

        fs.unlinkSync(filePath);

        res.status(200).json({ error: false, message: 'Commands imported successfully' });
    } catch (error) {
        console.error('Error importing commands:', error);
        res.status(500).json({ error: true, message: 'Failed to import commands' });
    }
};
