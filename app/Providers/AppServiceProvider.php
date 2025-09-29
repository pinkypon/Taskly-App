<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Mail\MailManager;
use App\Mail\BrevoApiTransport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        }

        // Register Brevo API transport
        $this->app->make(MailManager::class)->extend('brevo', function () {
            return new BrevoApiTransport(
                env('BREVO_API_KEY'),
                env('MAIL_FROM_ADDRESS')
            );
        });
    }
}
