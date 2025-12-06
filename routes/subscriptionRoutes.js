const express = require('express');
const router = express.Router();
const {
  getSubscriptions,
  getSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getAnalytics,
} = require('../controllers/subscriptionController');
const {
  detectSubscriptions,
  bulkImport,
  detectSubscriptions,
  bulkImport,
  detectFromEmailContent,
  scanGmail,
} = require('../controllers/subscriptionDetectionController');
const { protect } = require('../middleware/auth');

router.use(protect); // All routes require authentication

router.get('/analytics/summary', getAnalytics);
router.post('/detect', detectSubscriptions);
router.post('/bulk-import', bulkImport);
router.post('/detect-from-email', detectFromEmailContent);
router.post('/scan-gmail', scanGmail);
router.route('/').get(getSubscriptions).post(createSubscription);
router.route('/:id').get(getSubscription).put(updateSubscription).delete(deleteSubscription);

module.exports = router;

