# Navyug Contact Form API

Install `navyug-contact-form-api.php` as a WordPress plugin on the backend site:

`https://lightgray-magpie-707312.hostingersite.com/`

After activation, go to:

`WordPress Admin > Settings > Navyug Contact Form`

Add:

- SendGrid API key
- Recipient emails: `navyugglobalventures@gmail.com,salvis.smglobal@gmail.com`
- From email: `navyugglobalventures@gmail.com`

The `From Email` address must be a verified sender in SendGrid.

You can also configure the plugin with `wp-config.php` constants instead:

```php
define('NAVYUG_SENDGRID_API_KEY', 'your-sendgrid-api-key');
define('NAVYUG_CONTACT_TO_EMAIL', 'navyugglobalventures@gmail.com,salvis.smglobal@gmail.com');
define('NAVYUG_CONTACT_FROM_EMAIL', 'navyugglobalventures@gmail.com');
```

After activation, this endpoint should exist:

`https://lightgray-magpie-707312.hostingersite.com/wp-json/custom/v1/contact-form`
