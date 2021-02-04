FROM cypress/browsers:node12.18.4-edge88
RUN mkdir cypress-setup
WORKDIR /cypress-setup
COPY . /cypress-setup
RUN npm install
RUN npm run cy:run:edge