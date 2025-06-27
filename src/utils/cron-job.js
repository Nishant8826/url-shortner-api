import cron from 'node-cron';
import axios from 'axios';

cron.schedule('*/14 * * * *', async () => {
    try {
        const response = await axios.get('https://url-shortner-api-sw4a.onrender.com/');
        console.log(`[CRON] Pinged Render API: ${response.status}`);
    } catch (error) {
        console.error('[CRON] Error pinging API:', error.message);
    }
});
