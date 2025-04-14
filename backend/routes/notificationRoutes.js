import express from 'express';
import { 
    createNotification, 
    getAllNotifications, 
    getUserNotifications, 
    getNotificationsByType, 
    deleteNotification 
} from '../controllers/notificationController.js';

const router = express.Router();

router.post('/create_notification', createNotification); 
router.get('/notifications', getAllNotifications); 
router.get('/type/:type', getNotificationsByType); 
router.get('/:userId', getUserNotifications);
router.delete('/notification/:id', deleteNotification); 

export default router;
