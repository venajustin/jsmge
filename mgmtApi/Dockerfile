FROM python:3.13.9-alpine

RUN pip install --upgrade pip

RUN apk add curl

# RUN adduser -D nonroot
# RUN mkdir /home/app/ && chown -R nonroot:nonroot /home/app
# RUN mkdir -p /var/log/flask-app && touch /var/log/flask-app/flask-app.err.log && touch /var/log/flask-app/flask-app.out.log
# RUN chown -R nonroot:nonroot /var/log/flask-app
# WORKDIR /home/app
# USER nonroot

# copy all the files to the container
# COPY --chown=nonroot:nonroot . .

# as root TODO: make this work as nonroot
RUN mkdir /home/app
RUN mkdir -p /var/log/flask-app && touch /var/log/flask-app/flask-app.err.log && touch /var/log/flask-app/flask-app.out.log
WORKDIR /home/app
COPY ./database ./database
COPY ./static ./static
COPY ./templates ./templates
COPY ./usrcode ./usrcode
COPY ./dockerUtil ./dockerUtil
COPY ./app.py ./app.py
COPY ./util.py ./util.py
COPY ./requirements.txt ./requirements.txt


# venv
ENV VIRTUAL_ENV=/home/app/venv

# python setup
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
RUN export FLASK_APP=app.py
RUN pip install -r requirements.txt

# define the port number the container should expose
EXPOSE 8000

CMD ["python", "app.py"]
