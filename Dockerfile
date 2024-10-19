#
# The builder image.
#
FROM node:latest as builder

#
# Set the working directory for the entire project.
#
WORKDIR /usr/src

#
# Copy microservices code.
# In a bigger project this copies more than is needed, but at least it's simple.
#
COPY ./ ./

# 
# Set the working directory for the particular microservice.
#
WORKDIR /usr/src

# Install dependencies
RUN npm install            

# Build application including libraries.
RUN npm run build

#
# Set the working directory to the build directory.
#
WORKDIR /usr/src/build

#
# The prod image.
#
FROM node:latest

WORKDIR /usr/src/app

# Copy the bundle from the builder image.
COPY --from=builder /usr/src/build ./

WORKDIR /usr/src/app
    
EXPOSE 80
CMD npm start