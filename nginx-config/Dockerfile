FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY static/index.html /static/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

