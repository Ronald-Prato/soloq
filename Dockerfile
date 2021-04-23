FROM node:13
WORKDIR /home/node/soloq
COPY server /home/node/soloq
RUN yarn
CMD yarn app