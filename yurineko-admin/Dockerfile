# Common build stage
FROM node:14.15.0-alpine3.12 as common-build-stage

COPY . ./app

WORKDIR /app

#RUN npm install

#EXPOSE 3000

# Development build stage
FROM common-build-stage as development-build-stage

#RUN chmod +x /app/docker-entrypoint.sh

#ENTRYPOINT [ "docker-entrypoint.sh" ]

ENV NODE_ENV development

RUN yarn --frozen-lockfile

# RUN npm run build
RUN yarn run build

RUN npm install -g serve

EXPOSE 3000

# start app
CMD ["serve", "-s", "build"]
#CMD ["npm", "start"]

# # Production build stage
# FROM common-build-stage as production-build-stage

# ENV NODE_ENV production

# CMD ["npm", "run", "start"]
