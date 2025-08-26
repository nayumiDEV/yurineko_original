# Common build stage
FROM node:14.17.6 as common-build-stage

COPY . ./app

WORKDIR /app

#RUN npm install

#EXPOSE 3000

# Development build stage
FROM common-build-stage as development-build-stage

#RUN chmod +x /app/docker-entrypoint.sh

#ENTRYPOINT [ "docker-entrypoint.sh" ]

ENV NODE_ENV development

RUN yarn install

# RUN npm run build
RUN yarn run build


EXPOSE 3000

# start app
CMD ["yarn", "start"]
#CMD ["npm", "start"]

# # Production build stage
# FROM common-build-stage as production-build-stage

# ENV NODE_ENV production

# CMD ["npm", "run", "start"]

