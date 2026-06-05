# Navyug Contact Form API

Install `navyug-contact-form-api.php` as a WordPress plugin on the backend site:

`https://lightgray-magpie-707312.hostingersite.com/`

Add these constants to `wp-config.php` on the WordPress server, above the line that says "That's all, stop editing":

```php
define('NAVYUG_SENDGRID_API_KEY', 'your-sendgrid-api-key');
define('NAVYUG_RECAPTCHA_SECRET', 'your-recaptcha-secret-key');
define('NAVYUG_CONTACT_TO_EMAIL', 'navyugglobalventures@gmail.com');
define('NAVYUG_CONTACT_FROM_EMAIL', 'navyugglobalventures@gmail.com');
```

The `NAVYUG_CONTACT_FROM_EMAIL` address must be a verified sender in SendGrid.

After activation, this endpoint should exist:

`https://lightgray-magpie-707312.hostingersite.com/wp-json/custom/v1/contact-form`
