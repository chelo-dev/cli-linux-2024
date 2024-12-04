import express from 'express';
import multer from 'multer';
import {
    getCategories,
    addCategory,
    updateCategoryByUuid,
    deleteCategoryByUuid,
    getCategory,
    importCategories,
} from '../controllers/category.controller';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getCategories);
router.post('/addCategories', addCategory);
router.put('/updateCategory/:uuid', updateCategoryByUuid);
router.delete('/deleteCategory/:uuid', deleteCategoryByUuid);
router.post('/getCategory', getCategory);
router.post('/import-csv', upload.single('file'), importCategories);

export default router;
