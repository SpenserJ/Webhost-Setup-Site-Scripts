server {
  server_name {{ name }}.{{ hostname }};
  listen 80;

  root          /var/www/shared/{{ name }}/public_html;
  access_log    /var/www/shared/{{ name }}/logs/access.log;
  error_log     /var/www/shared/{{ name }}/logs/error.log;

  index index.php index.html index.htm;

  include conf.d/includes/handle_standard_files.conf;
  include conf.d/includes/{{ type }}.conf;

  client_max_body_size 1024m;

  location @php {
    include       /etc/nginx/fastcgi_params;
    fastcgi_pass  unix:/var/run/php5-fpm_www.sock;
    fastcgi_param HTTPS $https_proxied;
    if ($log_php_request = 0) {
      access_log  off;
    }
  }
}
