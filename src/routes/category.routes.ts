import express from 'express';
import {
    getCategories,
    addCategory,
    updateCategoryByUuid,
    deleteCategoryByUuid,
    getCategory,
} from '../controllers/category.controller';

const router = express.Router();

router.get('/', getCategories);
router.post('/addCategories', addCategory);
router.put('/updateCategory/:uuid', updateCategoryByUuid);
router.delete('/deleteCategory/:uuid', deleteCategoryByUuid);
router.post('/getCategory', getCategory);

export default router;
