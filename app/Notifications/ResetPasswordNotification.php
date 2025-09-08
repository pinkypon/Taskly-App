<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public string $token;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        // Build frontend reset link
        $url = config('app.url') . '/reset-password?token='
            . $this->token
            . '&email=' . $notifiable->getEmailForPasswordReset();

        $expire = config('auth.passwords.' . config('auth.defaults.passwords') . '.expire');

        // Use your custom Blade email instead of default lines
        return (new MailMessage)
            ->subject('Reset Your Password')
            ->view('emails.forgot-password', [
                'url' => $url,
                'user' => $notifiable,
                'expire' => $expire,
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [];
    }
}
