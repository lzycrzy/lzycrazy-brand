import express from 'express';
import Asset from '../models/Assets.js';
const router = express.Router();
import  {uploadToCloudinary} from '../utils/cloudinary.js';
import uploads from '../middlewares/multer.middleware.js';
router.post('/upload', uploads.single('asset'), async (req, res) => {
    try {
        const { file } = req;
        const {originalname} = file;

        const secure_url = await uploadToCloudinary(file.path)

        const asset = new Asset({
            name: originalname,
            url: secure_url,
        });

        await asset.save();

        res.status(200).json({
            success: true,
            asset,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}); 

router.get('/', async (req, res) => {
    const assets = await Asset.find();
    res.status(200).json({
        success: true,
        assets,
    });
});

export default router;  