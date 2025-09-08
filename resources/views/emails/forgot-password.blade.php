<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - Taskly</title>
  <style>
    /* Same styles as your Verify template */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #374151;
      background: linear-gradient(135deg, #e2e8f0 0%, #a5b4fc 50%, #93c5fd 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .email-container {
      max-width: 480px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .header {
      background: #F0F1FF;
      padding: 40px 30px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .logo-section {
      position: relative;
      z-index: 2;
      margin-bottom: 20px;
    }

    .logo-section h1 {
      color: #312e81;
      font-size: 32px;
      font-weight: 900;
      margin-bottom: 10px;
    }

    .header-title {
      color: #312e81;
      font-size: 24px;
      font-weight: bold;
      margin: 0;
    }

    .content {
      padding: 40px 30px;
    }

    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
    }

    .user-name {
      font-weight: 600;
      color: #4f46e5;
    }

    .message {
      color: #6b7280;
      margin-bottom: 30px;
      font-size: 16px;
    }

    .cta-section {
      text-align: center;
      margin: 40px 0;
    }

    .reset-button {
      display: inline-block;
      background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
      color: white;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3), 0 4px 6px -2px rgba(79, 70, 229, 0.05);
    }

    .security-note {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      border-left: 4px solid #4f46e5;
      padding: 20px;
      border-radius: 8px;
      margin: 30px 0;
    }

    .security-note p {
      margin: 0;
      color: #4b5563;
      font-size: 14px;
    }

    .footer {
      background: #f8fafc;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }

    .footer p {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 10px;
    }

    .brand-name {
      font-weight: 600;
      color: #4f46e5;
    }
  </style>
</head>

<body>
  <div class="email-container">
    <!-- Header Section -->
    <div class="header">
      <div class="logo-section" style="display: inline-flex; align-items: center; justify-content: center; gap: 10px;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #312e81;">Taskly</h1>
        <img src="{{ asset('images/task-logo.png') }}" alt="Taskly Logo" width="40">
      </div>
      <h2 class="header-title">Reset Your Password</h2>
    </div>

    <!-- Main Content -->
    <div class="content">
      <div class="greeting">
        Hello <span class="user-name">{{ $user->name }}</span>,
      </div>

      <p class="message">
        We received a request to reset the password for your Taskly account.
        You can set a new password by clicking the button below.
      </p>

      <!-- Call to Action -->
      <div class="cta-section">
        <a href="{{ $url }}" class="reset-button" style="color: white;">Change Password</a>
      </div>

      <!-- Security Note -->
      <div class="security-note">
        <p>
          <strong>🔒 Security Note:</strong> This password reset link will expire in {{ $expire }} minutes.
          If you didn’t request a password reset, please ignore this email — your account is safe.
        </p>
      </div>

      <p class="message">
        If the button above doesn’t work, copy and paste this link into your browser:
      </p>

      <p
        style="word-break: break-all; color: #4f46e5; font-size: 14px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
        {{ $url }}
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Need help? Contact our support team anytime.</p>
      <p>
        Best regards,<br>
        The <span class="brand-name">Taskly</span> Team
      </p>
      <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
        © {{ date('Y') }} Taskly. All rights reserved.
      </p>
    </div>
  </div>
</body>

</html>