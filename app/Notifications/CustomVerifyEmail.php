<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailNotification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;
use Illuminate\Contracts\Queue\ShouldQueue;  
use Illuminate\Bus\Queueable;     
use Illuminate\Support\Facades\Config;

class CustomVerifyEmail extends VerifyEmailNotification implements ShouldQueue
{
    use Queueable;
    /**
     * Generate the verification URL.
     */
    protected function verificationUrl($notifiable)
    {
        // Force HTTPS in production for Render deployment
        if (app()->environment('production')) {
            URL::forceScheme('https');
        }

        return URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(60), // expires in 60 minutes
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
    }

    /**
     * Customize the verification email.
     */
    public function toMail($notifiable)
    {
        $url = $this->verificationUrl($notifiable);

        return (new MailMessage())
            ->subject('Verify Your Email - Taskly')
            ->view(
                'emails.verify',
                [
                    'url' => $url,
                    'user' => $notifiable,
                ]
            );
    }
}