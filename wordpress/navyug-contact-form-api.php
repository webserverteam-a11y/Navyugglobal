<?php
/**
 * Plugin Name: Navyug Contact Form API
 * Description: Adds a REST endpoint for the Navyug contact form with SendGrid mail delivery.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/contact-form', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'navyug_contact_form_submit',
        'permission_callback' => '__return_true',
    ));
});

add_action('admin_menu', function () {
    add_options_page(
        'Navyug Contact Form',
        'Navyug Contact Form',
        'manage_options',
        'navyug-contact-form',
        'navyug_contact_form_settings_page'
    );
});

add_action('admin_init', function () {
    register_setting('navyug_contact_form_settings', 'navyug_sendgrid_api_key', array(
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => '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',
    ));

    register_setting('navyug_contact_form_settings', 'navyug_contact_to_email', array(
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => 'navyugglobalventures@gmail.com,dishan.m@ditechcdm.com,shubham.s@ditechcdm.com',
    ));

    register_setting('navyug_contact_form_settings', 'navyug_contact_from_email', array(
        'type' => 'string',
        'sanitize_callback' => 'sanitize_email',
        'default' => 'navyugglobalventures@gmail.com',
    ));
});

add_filter('plugin_action_links_' . plugin_basename(__FILE__), function ($links) {
    $settings_link = sprintf(
        '<a href="%s">%s</a>',
        esc_url(admin_url('options-general.php?page=navyug-contact-form')),
        esc_html__('Settings', 'navyug-contact-form-api')
    );

    array_unshift($links, $settings_link);
    return $links;
});

function navyug_contact_form_config($constant, $env, $option = '', $default = '') {
    if (defined($constant) && constant($constant)) {
        return constant($constant);
    }

    $value = getenv($env);
    if ($value) {
        return $value;
    }

    if ($option) {
        $value = get_option($option);
        if ($value) {
            return $value;
        }
    }

    return $default;
}

function navyug_contact_form_submit(WP_REST_Request $request) {
    $sendgrid_api_key = navyug_contact_form_config(
        'NAVYUG_SENDGRID_API_KEY',
        'NAVYUG_SENDGRID_API_KEY',
        'navyug_sendgrid_api_key',
        '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'
    );
    $to_emails = navyug_contact_form_recipients(
        navyug_contact_form_config(
            'NAVYUG_CONTACT_TO_EMAIL',
            'NAVYUG_CONTACT_TO_EMAIL',
            'navyug_contact_to_email',
            'navyugglobalventures@gmail.com,dishan.m@ditechcdm.com,shubham.s@ditechcdm.com'
        )
    );
    $from_email = navyug_contact_form_config(
        'NAVYUG_CONTACT_FROM_EMAIL',
        'NAVYUG_CONTACT_FROM_EMAIL',
        'navyug_contact_from_email',
        'navyugglobalventures@gmail.com'
    );

    if (!$sendgrid_api_key || empty($to_emails)) {
        return new WP_Error(
            'navyug_contact_missing_config',
            'Contact form mail service is not configured.',
            array('status' => 500)
        );
    }

    $first_name = sanitize_text_field($request->get_param('firstName'));
    $last_name = sanitize_text_field($request->get_param('lastName'));
    $email = sanitize_email($request->get_param('email'));
    $phone = sanitize_text_field($request->get_param('phone'));
    $company = sanitize_text_field($request->get_param('company'));
    $job_title = sanitize_text_field($request->get_param('jobTitle'));
    $message = sanitize_textarea_field($request->get_param('message'));

    if (!$first_name || !$last_name || !$email || !$phone || !$message) {
        return new WP_Error(
            'navyug_contact_required_fields',
            'Please complete all required fields.',
            array('status' => 422)
        );
    }

    if (!is_email($email)) {
        return new WP_Error(
            'navyug_contact_invalid_email',
            'Please enter a valid email address.',
            array('status' => 422)
        );
    }

    $attachments = navyug_contact_form_collect_attachments($request);
    if (is_wp_error($attachments)) {
        return $attachments;
    }

    $subject = sprintf('New pitch enquiry from %s %s', $first_name, $last_name);
    $html_message = navyug_contact_form_email_html(array(
        'First Name' => $first_name,
        'Last Name' => $last_name,
        'Email' => $email,
        'Phone' => $phone,
        'Company' => $company,
        'Job Title' => $job_title,
        'Message' => nl2br(esc_html($message)),
    ));

    $payload = array(
        'personalizations' => array(
            array(
                'to' => $to_emails,
                'subject' => $subject,
            ),
        ),
        'from' => array(
            'email' => $from_email,
            'name' => 'Navyug Global Ventures',
        ),
        'reply_to' => array(
            'email' => $email,
            'name' => trim($first_name . ' ' . $last_name),
        ),
        'content' => array(
            array(
                'type' => 'text/html',
                'value' => $html_message,
            ),
        ),
    );

    if (!empty($attachments)) {
        $payload['attachments'] = $attachments;
    }

    $send_response = wp_remote_post('https://api.sendgrid.com/v3/mail/send', array(
        'timeout' => 20,
        'headers' => array(
            'Authorization' => 'Bearer ' . $sendgrid_api_key,
            'Content-Type' => 'application/json',
        ),
        'body' => wp_json_encode($payload),
    ));

    if (is_wp_error($send_response)) {
        return new WP_Error(
            'navyug_contact_send_failed',
            'Could not send your message. Please try again.',
            array('status' => 502)
        );
    }

    $status_code = wp_remote_retrieve_response_code($send_response);
    if ($status_code < 200 || $status_code >= 300) {
        return new WP_Error(
            'navyug_contact_sendgrid_failed',
            'Could not send your message. Please try again.',
            array('status' => 502)
        );
    }

    return rest_ensure_response(array(
        'success' => true,
        'message' => 'Message sent successfully.',
    ));
}

function navyug_contact_form_settings_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    $default_recipients = 'navyugglobalventures@gmail.com,dishan.m@ditechcdm.com,shubham.s@ditechcdm.com';
    $default_from = 'navyugglobalventures@gmail.com';
    ?>
    <div class="wrap">
        <h1>Navyug Contact Form</h1>
        <form method="post" action="options.php">
            <?php settings_fields('navyug_contact_form_settings'); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row">
                        <label for="navyug_sendgrid_api_key">SendGrid API Key</label>
                    </th>
                    <td>
                        <input
                            type="password"
                            id="navyug_sendgrid_api_key"
                            name="navyug_sendgrid_api_key"
                            value="<?php echo esc_attr(get_option('navyug_sendgrid_api_key')); ?>"
                            class="regular-text"
                            autocomplete="off"
                        />
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="navyug_contact_to_email">Recipient Emails</label>
                    </th>
                    <td>
                        <input
                            type="text"
                            id="navyug_contact_to_email"
                            name="navyug_contact_to_email"
                            value="<?php echo esc_attr(get_option('navyug_contact_to_email', $default_recipients)); ?>"
                            class="large-text"
                        />
                        <p class="description">Separate multiple emails with commas.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="navyug_contact_from_email">From Email</label>
                    </th>
                    <td>
                        <input
                            type="email"
                            id="navyug_contact_from_email"
                            name="navyug_contact_from_email"
                            value="<?php echo esc_attr(get_option('navyug_contact_from_email', $default_from)); ?>"
                            class="regular-text"
                        />
                        <p class="description">This must be a verified sender in SendGrid.</p>
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

function navyug_contact_form_collect_attachments(WP_REST_Request $request) {
    $files = $request->get_file_params();

    if (empty($files)) {
        return array();
    }

    $normalized = array();
    foreach ($files as $field => $file_group) {
        if (strpos($field, 'attachments') !== 0) {
            continue;
        }

        $normalized = array_merge($normalized, navyug_contact_form_normalize_files($file_group));
    }

    if (count($normalized) > 5) {
        return new WP_Error(
            'navyug_contact_too_many_files',
            'You can upload a maximum of 5 files.',
            array('status' => 422)
        );
    }

    $allowed_mimes = array(
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'application/zip',
        'application/x-zip-compressed',
    );
    $max_file_size = 20 * 1024 * 1024;
    $max_total_size = 20 * 1024 * 1024;
    $total_size = 0;
    $attachments = array();

    foreach ($normalized as $file) {
        if (empty($file['name']) || empty($file['tmp_name'])) {
            continue;
        }

        if (!empty($file['error'])) {
            return new WP_Error(
                'navyug_contact_upload_error',
                'One of the uploaded files could not be processed.',
                array('status' => 422)
            );
        }

        if ($file['size'] > $max_file_size) {
            return new WP_Error(
                'navyug_contact_file_too_large',
                'Each file must be less than 20MB.',
                array('status' => 422)
            );
        }

        $total_size += (int) $file['size'];
        if ($total_size > $max_total_size) {
            return new WP_Error(
                'navyug_contact_total_too_large',
                'Total upload size must be less than 20MB.',
                array('status' => 422)
            );
        }

        $file_type = wp_check_filetype($file['name']);
        if (empty($file_type['type']) || !in_array($file_type['type'], $allowed_mimes, true)) {
            return new WP_Error(
                'navyug_contact_file_type',
                'Only PDF, DOC, DOCX, JPG, PNG, and ZIP files are allowed.',
                array('status' => 422)
            );
        }

        $content = file_get_contents($file['tmp_name']);
        if ($content === false) {
            return new WP_Error(
                'navyug_contact_file_read_failed',
                'One of the uploaded files could not be processed.',
                array('status' => 422)
            );
        }

        $attachments[] = array(
            'content' => base64_encode($content),
            'type' => $file_type['type'],
            'filename' => sanitize_file_name($file['name']),
            'disposition' => 'attachment',
        );
    }

    return $attachments;
}

function navyug_contact_form_recipients($emails) {
    $recipients = array();
    $items = array_map('trim', explode(',', $emails));

    foreach ($items as $email) {
        $email = sanitize_email($email);
        if (is_email($email)) {
            $recipients[] = array('email' => $email);
        }
    }

    return $recipients;
}

function navyug_contact_form_normalize_files($file_group) {
    if (!is_array($file_group) || empty($file_group['name'])) {
        return array();
    }

    if (!is_array($file_group['name'])) {
        return array($file_group);
    }

    $files = array();
    foreach ($file_group['name'] as $index => $name) {
        $files[] = array(
            'name' => $name,
            'type' => isset($file_group['type'][$index]) ? $file_group['type'][$index] : '',
            'tmp_name' => isset($file_group['tmp_name'][$index]) ? $file_group['tmp_name'][$index] : '',
            'error' => isset($file_group['error'][$index]) ? $file_group['error'][$index] : UPLOAD_ERR_NO_FILE,
            'size' => isset($file_group['size'][$index]) ? (int) $file_group['size'][$index] : 0,
        );
    }

    return $files;
}

function navyug_contact_form_email_html($fields) {
    $rows = '';

    foreach ($fields as $label => $value) {
        if ($value === '') {
            $value = '-';
        }

        $rows .= sprintf(
            '<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;">%s</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">%s</td></tr>',
            esc_html($label),
            $label === 'Message' ? $value : esc_html($value)
        );
    }

    return sprintf(
        '<div style="font-family:Arial,sans-serif;color:#111827;"><h2>New Navyug contact form submission</h2><table style="border-collapse:collapse;width:100%%;max-width:720px;">%s</table></div>',
        $rows
    );
}
