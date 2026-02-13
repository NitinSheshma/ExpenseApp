const Razorpay = require('razorpay');
const crypto = require('crypto');

const { CREDIT_TO_PAISA_MAPPING } = require('../Constants/paymentConstants');
const Users = require('../model/users');

const razorpayClient = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentsController = {

  // STEP 2: Create Razorpay Order
  createOrder: async (request, response) => {
    try {
      const { credits } = request.body;

      if (!credits || !CREDIT_TO_PAISA_MAPPING[credits]) {
        return response.status(400).json({
          message: 'Invalid credit value',
        });
      }

      const amountInPaise = CREDIT_TO_PAISA_MAPPING[credits];

      const order = await razorpayClient.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      });

      return response.status(200).json({
        success: true,
        order,
      });

    } catch (error) {
      console.error('Create Order Error:', error);
      return response.status(500).json({
        message: 'Internal server error',
      });
    }
  },


  // STEP 8: Verify Payment & Add Credits
  verifyOrder: async (request, response) => {
    try {

      console.log("BODY:", request.body);
      console.log("USER:", request.user);

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        credits,
      } = request.body;

      // Validate request data
      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !credits ||
        !CREDIT_TO_PAISA_MAPPING[credits]
      ) {
        return response.status(400).json({
          message: 'Invalid payment data',
        });
      }

      // Verify Razorpay signature
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;

      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return response.status(400).json({
          message: 'Invalid transaction',
        });
      }

      // 🔥 IMPORTANT FIX HERE
      if (!request.user || !request.user._id) {
        return response.status(401).json({
          message: 'Unauthorized user',
        });
      }

      // ✅ Correct findById usage
      const user = await Users.findById(request.user._id);

      if (!user) {
        return response.status(404).json({
          message: 'User not found',
        });
      }

      // Ensure credits field exists
      if (user.credits === undefined) {
        user.credits = 0;
      }

      // Add credits
      user.credits += Number(credits);
      await user.save();

      return response.status(200).json({
        success: true,
        message: 'Payment verified and credits added successfully',
        credits: user.credits,
      });

    } catch (error) {
      console.error('Verify Order Error:', error);
      return response.status(500).json({
        message: 'Internal server error',
      });
    }
  },
};

module.exports = paymentsController;
