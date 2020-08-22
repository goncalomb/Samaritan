FROM httpd:2.4-alpine

COPY ./www /usr/local/apache2/htdocs

EXPOSE 80
