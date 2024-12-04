import { Request, Response, RequestHandler } from 'express';
import fs from 'fs';
import { 
    getAllCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory, 
    searchSimilarity, 
    importCategoriesFromCSV 
} from '../models/category.model';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await getAllCategories();
        res.status(200).json({ error: false, data: categories });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Failed to fetch categories' });
    }
};

export const addCategory = async (req: Request, res: Response) => {
    try {
        const { name, description, svg } = req.body;
        await createCategory(name, description, svg);
        res.status(201).json({ error: false, message: 'Category created successfully' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send({ error: false, message: error.message });
        } else {
            res.status(500).send({ error: true, message: "Failed to create category" });
        }
    }
};

export const updateCategoryByUuid = async (req: Request, res: Response) => {
    try {
        const { uuid } = req.params;
        const { name, description, svg } = req.body;
        await updateCategory(String(uuid), name, description, svg);

        res.status(200).json({ error: false, message: req.body });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send({ error: false, message: error.message });
        } else {
            res.status(500).send({ error: true, message: "Failed to update category" });
        }
    }
};

export const deleteCategoryByUuid = async (req: Request, res: Response) => {
    try {
        const { uuid } = req.params;
        await deleteCategory(String(uuid));
        res.status(200).json({ error: false, message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Failed to delete category' });
    }
};

export const getCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const categories = await searchSimilarity(String(name));
        
        res.status(200).json({ error: false, data: categories });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send({ error: false, message: error.message });
        } else {
            res.status(500).send({ error: true, message: "Failed to search category" });
        }
    }
};

export const importCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: true, message: 'No file uploaded' });
            return;
        }

        const filePath = req.file.path;

        await importCategoriesFromCSV(filePath);

        fs.unlinkSync(filePath);

        res.status(200).json({ error: false, message: 'Categories imported successfully' });
    } catch (error) {
        console.error('Error importing categories:', error);
        res.status(500).json({ error: true, message: 'Failed to import categories' });
    }
};
