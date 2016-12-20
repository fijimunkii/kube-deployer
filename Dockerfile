FROM ubuntu:14.04.4

MAINTAINER Harrison Powers, harrisonpowers@gmail.com

ARG BUILD_DATE
ARG VCS_REF
ARG VCS_URL

LABEL org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.vcs-url=$VCS_URL

RUN sudo apt-get update && apt-get install -y curl && \
  curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -

RUN sudo apt-get update && apt-get install -y --no-install-recommends \
  nodejs vim build-essential wget openssh-client gettext

RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl && chmod +x ./kubectl && sudo mv ./kubectl /usr/local/bin/kubectl

RUN npm i pm2 -g

COPY . /usr/src/app
WORKDIR /usr/src/app

RUN npm i

CMD pm2 start index.js -i 1 --no-daemon

EXPOSE 5555
