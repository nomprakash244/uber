const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// Submit review and send email directly to admin
module.exports.submitReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userName, userEmail, captainName, rating, review, rideDetails } = req.body;

  try {
    // Try sending email, but even if it fails, continue
    try {
      await sendReviewEmail({
        userName,
        userEmail,
        captainName: captainName || 'N/A',
        rating,
        review,
        rideDetails: rideDetails || {}
      });
      console.log('✅ Review email sent to admin');
    } catch (emailError) {
      console.error('⚠️ Failed to send review email:', emailError.message);
      // Don't block response if email fails
    }

    // Always respond with success
    res.status(200).json({
      success: true,
      message: 'Review submitted successfully (email sent or skipped)'
    });

  } catch (error) {
    console.error('❌ Error handling review:', error.message);
    res.status(200).json({
      success: true,
      message: 'Review submitted (email failed but ignored)'
    });
  }
};

// Helper: send email using Nodemailer
async function sendReviewEmail(data) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New Review - ${data.rating}⭐ Rating from ${data.userName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">New Ride Review</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
            ${'⭐'.repeat(data.rating)} (${data.rating}/5)
          </p>
        </div>

        <div style="padding: 30px;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #333;">👤 User Information</h3>
            <p><strong>Name:</strong> ${data.userName}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.userEmail}" style="color: #667eea;">${data.userEmail}</a></p>
          </div>

          ${data.captainName !== 'N/A' ? `
          <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #333;">🚗 Captain Information</h3>
            <p><strong>Captain:</strong> ${data.captainName}</p>
          </div>` : ''}

          ${data.rideDetails.pickup ? `
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #333;">📍 Ride Details</h3>
            <p><strong>Pickup:</strong> ${data.rideDetails.pickup}</p>
            <p><strong>Destination:</strong> ${data.rideDetails.destination}</p>
            ${data.rideDetails.fare ? `<p><strong>Fare:</strong> ₹${data.rideDetails.fare}</p>` : ''}
          </div>` : ''}

          <div style="background: #d4edda; padding: 20px; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #333;">💬 Review</h3>
            <blockquote style="margin: 0; font-style: italic;">"${data.review}"</blockquote>
          </div>

          <div style="text-align: center; padding: 20px;">
            <div style="font-size: 40px;">${'⭐'.repeat(data.rating)}${'☆'.repeat(5 - data.rating)}</div>
            <p>Rating: ${data.rating}/5</p>
          </div>
        </div>

        <div style="background: #f8f9fa; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #999;">
            📧 Automated email from Uber Clone App
          </p>
          <p style="margin: 5px 0 0; font-size: 12px; color: #999;">
            ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
        </div>

      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}
