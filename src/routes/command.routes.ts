import express from 'express';
import multer from 'multer';
import { 
    addCommand, 
    deleteCommandByUuid, 
    getCommand, 
    getCommandsController, 
    importCommands, 
    updateCommandByUuid
} from '../controllers/command.controller';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getCommandsController);
router.post('/addCommand', addCommand);
router.put('/updateCommand/:uuid', updateCommandByUuid);
router.delete('/deleteCommand/:uuid', deleteCommandByUuid);
router.post('/getCommand', getCommand);
router.post('/import-csv', upload.single('file'), importCommands);

export default router;