FROM node:latest
RUN mkdir -p /home/server
WORKDIR /home/server
COPY . /home/server
# RUN npm config set registry https://registry.npm.taobao.org
RUN npm install
CMD ["node","cloud-converter.js"] 