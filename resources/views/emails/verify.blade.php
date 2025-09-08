<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - Taskly</title>
    <style>
        /* Reset and base styles */
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

        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
        }

        .logo-section {
            position: relative;
            z-index: 2;
            margin-bottom: 20px;
        }

        .logo-section h1 {
            color: white;
            font-size: 32px;
            font-weight: 900;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .email-icon {
            display: inline-block;
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            margin: 0 auto 20px;
            position: relative;
        }

        .email-icon::before {
            content: '✉';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 28px;
            color: white;
        }

        .header-title {
            color: white;
            font-size: 28px;
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

        .verify-button {
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

        /* Mobile responsiveness */
        @media only screen and (max-width: 600px) {
            body {
                padding: 10px;
            }

            .header {
                padding: 30px 20px;
            }

            .content {
                padding: 30px 20px;
            }

            .header-title {
                font-size: 24px;
            }

            .verify-button {
                padding: 14px 28px;
                font-size: 15px;
            }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .email-container {
                background: rgba(17, 24, 39, 0.95);
                color: #f9fafb;
            }

            .content {
                color: #f3f4f6;
            }

            .message {
                color: #d1d5db;
            }

            .security-note {
                background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
                border-left-color: #6366f1;
            }

            .security-note p {
                color: #d1d5db;
            }

            .footer {
                background: #1f2937;
                border-top-color: #374151;
            }

            .footer p {
                color: #9ca3af;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <!-- Header Section -->
        <div class="header" style="text-align: center; margin-bottom: 20px;">
            <div class="logo-section"
                style="display: inline-flex; align-items: center; justify-content: center; gap: 10px;">
                <!-- Taskly text -->
                <h1
                    style="margin: 0; font-size: 28px; font-weight: bold; color: #312e81;; font-family: Arial, sans-serif;">
                    Taskly
                </h1>

                <!-- Logo -->
                <img src="{{ asset('images/task-logo.png') }}" alt="Taskly Logo" width="40"
                    style="display: inline-block; vertical-align: middle;">
            </div>

            <h2 class="header-title"
                style="margin-top: 12px; font-size: 20px; font-weight: normal; color: #312e81;; font-family: Arial, sans-serif;">
                Verify Your Email
            </h2>
        </div>


        <!-- Main Content -->
        <div class="content">
            <div class="greeting">
                Hello <span class="user-name">{{ $user->name }}</span>,
            </div>

            <p class="message">
                Welcome to Taskly! We're excited to have you on board. To complete your registration and secure your
                account, please verify your email address by clicking the button below.
            </p>

            <!-- Call to Action -->
            <div class="cta-section">
                <a href="{{ $url }}" class="verify-button" style="color: white;">
                    Verify Email Address
                </a>
            </div>

            <!-- Security Note -->
            <div class="security-note">
                <p>
                    <strong>🔒 Security Note:</strong> This verification link will expire in 1 hour for your security.
                    If you didn't create a Taskly account, you can safely ignore this email.
                </p>
            </div>

            <p class="message">
                If the button above doesn't work, copy and paste this link into your browser:
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