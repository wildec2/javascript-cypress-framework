# Overview
This is a Cypress test automation project for testing web apps(responsive/pwa) across browsers and devices. 
Various Cypress testing techniques are outlined below as well as a docker and continuous integration set up with jenkins.


## Initial Set Up
1. Download [nodejs](https://nodejs.org/en/download/).
2. Create a directory.
3. Open directory in your ide(I use [Visual Studio Code](https://code.visualstudio.com/)).
4. Open a terminal/command prompt.
5. Run 'npm init -y'. This creates package.json and initialises the folder to be ready for npm commands. When we install cypress npm needs to register it's installed in our test folder and it does so inside package.json. If using a project with an existing package.json you can skip this step.
6. Run 'npm install cypress' this installs cypress locally in the current directory.
7. Run 'npx cypress open' to open the cypress ui.
8. Everything is local to this package. If you commit it to source control and somebody else checks it out, all they will need to do is run 'npm install' and immediately they can begin writing and running tests. If you have cloned this repo just run npm, skipping steps 2-6.
	

## Writing Tests
1. The integration sub folder under cypress is where we write our tests.
2. [mocha](https://mochajs.org/) is the test runner that comes built in with cypress and we must use it.
3. The 'cy' object is the built in cypress object and is used to call all the cypress apis.
4. Under integration we have created a desktop folder to holder our desktop specific tests and a mobile folder to hold our mobile specific test. This is because we need to set the user agent for mobile for sites which are rendered server side. The user agent must be set before cypress runs so the desktop and mobile tests cannot run together. See the below sections for more details.


## Accessing Elements
1. 'cy.get(selector)' is used to get one or more DOM elements.
2. Interactions we carry out on DOM elements can be chained to this, eg.
	click

	dblClick

	type

	check

	uncheck

	scrollTo

	hover

See [commands](https://docs.cypress.io/api/api/table-of-contents.html) docs for full list of commands.

3. Cypress automatically waits implicitly for 4 seconds when trying to find an element.
4. We can also update this by setting a timeout as an optional second parameter in the get method.
```
cy.get('#CybotCookiebotDialogBodyButtonAccept', {timeout: 6000})
```
5. Alternatively we can find elements by text(or partial text) by using 'cy.contains(text)'.


## Validations
1. All validations use should.
```
cy.get('#CybotCookiebotDialogBodyButtonAccept').should('have.text', 'accept')
cy.get('#CybotCookiebotDialogBodyButtonAccept').should('not.be.visible')
cy.get('#someElement').should('not.be.checked')
cy.get('label').should('have.css', 'text-decoration-line', 'line-through')
```
See [assertions](https://docs.cypress.io/guides/references/assertions.html#Chai) doc for full list of validations.
	

## Grouping Tests
1. Tests in mocha are grouped around describe groups with an it for each test inside.
```
describe('suite name', () => {
	it('test name 1', () => {
		cy.visit('https://www.discoverireland.ie/')
	})

	it('test name 2', () => {
		cy.visit('https://www.discoverireland.ie/')
	})
})
```
2. We can run one test on it's own by appending '.only' to an it.
```
it.only('test name 2', () => {
	cy.visit('https://www.discoverireland.ie/')
})
```
3. We can use beforeEach(() => {}) to run commands that are common to each test.
4. Additionally we group our mobile and desktop tests in seperate folders so we can set the user agent for mobile tests when we run Cypress.


## Running Tests from CLI
1. 'npx cypress run' will run your tests headlessly from the CLI.
	This automatically creates a video under the video folder.
2. 'npx cypress run --help' will give you all the commands you can run.
'npx cypress run --spec cypress/integration/discoverirelandhomepage.spec.js' will run the single test file specified
3. enabling 'npm run cypress', command.
Add the following to package.json > scripts 
```
"cy:open": "cypress open"
```
4. Additionally we've added the following to package.json to run further commands.
```
"cy:open": "cypress open",
"cy:open:mobile": "cypress open --config viewportWidth=375,viewportHeight=667,userAgent=iPhone",
"cy:run:desktop": "cypress run --headless --spec cypress/integration/desktop/*.js",
"cy:run:mobile": "cypress run --config viewportWidth=375,viewportHeight=667,userAgent=iPhone --headless --spec cypress/integration/mobile/*.js",
"cy:run:chrome": "cypress run --browser chrome --headless",
"cy:run:firefox": "cypress run --browser firefox --headless",
"cy:run:edge": "cypress run --browser edge --headless"
```
We specify 'viewportWidth=375,viewportHeight=667,userAgent=iPhone' to emulate a mobile device. Also we only want the mobile tests to run when cypress is configured for mobile so we specify the files in the specific folder to run with '--spec cypress/integration/mobile/*.js'. The same applies for desktop. '--browser' sets the browser to what we tell it.



## Page Objects
1. If we have instance variables(state) we can use classes, else, we can just use a regular set of module functions to represent our page as cypress takes care of all the browser initialization.
2. classes -
We create a class with variables and functions.
```
export Homepage() {
	export function enterSearchTerm(searchTerm) {
    		cy.get('#Hero__Search').type(searchTerm)
	}
}
```
In our test module we can then import the class.
```
import { Homepage } from "../page-objects/homepage"
```
Create a variable.
```
const homepage = new Homepage()
```
And the we can access everything the class has to offer.
```
homepage.enterSearchTerm('Mayo')
```
3. Set of functions - 
Create the functions in your page object module.
```
export function enterSearchTerm(searchTerm) {
		cy.get('#Hero__Search').type(searchTerm)
}
```
Import in our test module.
```
import {
    	navigateToHomePage,
    	enterSearchTerm,
    	selectSearchResult
} from "../page-objects/homepage"
```
And we can just call the function to use it.
```
enterSearchTerm('Mayo')
```


## Mocking Responses and Making Requests
1. Cypress allows you to stub responces to control the body, status, headers and even network delay to control the data returned to the app.
```
cy.intercept(url, routeHandler?)
cy.intercept(method, url, routeHandler?)
cy.intercept(routeMatcher, routeHandler?)
```
2. We use [cy.intercept()](https://docs.cypress.io/api/commands/intercept.html#Comparison-to-cy-route) to intercept all types of network requests including Fetch API, page loads, XMLHttpRequests, resource loads, etc.
```
cy.intercept('POST', '/indexes/destinations', {fixture: mockSuggestedDestinationSearchResults})
```
3. When intercepting fetch api requests be sure to intercept the request before the action occurs that fulfills the promise and the response is received.
```
mockSuggestedDestinationSearchResults('mayo_suggested_destinations_post_response.json')
enterSearchTerm('Mayo')
```
4. We can intercepting XMLHttpRequests(XMR) requests just after the action is to make the request is made. But it's probably good practice to treat them as you would the fetch requests.
5. We store our mocked responses in the fixtures folder. This fixed data in the files allows us to ensures we are working with a fixed environment without the need to seed a database or actually. Additionally the frontend can be tested independentr of any API/Service as they do not need to be fully working for us to complete tests.
6. Cypress also allows us to [make requests](https://docs.cypress.io/api/commands/request.html#Syntax) to speed up pur tests.
```
cy.request(url)
cy.request(url, body)
cy.request(method, url)
cy.request(method, url, body)
```


## Cross Browser\Mobile Device Testing
1. Chrome, Edge and Firefox are the only meaningful browsers supported at the moment. You can set the browser to run from the command line using '--browser'. Add the following script to package.json.

```
"cy:run:firefox": "cypress run --browser firefox"
```
And then you can run from the command line with 'npm run cy:run:firefox'. 

2. The browsers need to be installed on you system to use them. The [cypress/included](https://hub.docker.com/r/cypress/included) image comes with chrome and firefox built in now. See [additional browser images here](https://hub.docker.com/r/cypress/browsers/tags?page=1&ordering=last_updated).

3. To run on mobile sized browsers we can set the viewport to the the desired resolution. Add the following script to package.json and run via the cli with 'npm run cy:run:mobile'.
```
"cy:run:mobile": "cypress run --config viewportWidth=375,viewportHeight=667"
```
This option won't work well for apps that are rendered server side based on the client user agent. That's why we set 'userAgent=iPhone'. This also means we need to separate our desktop and mobile tests and run them separately. 


## Test Retries
1. We can set failing tests to fun again any number of time in both run and open mode by adding the following to the cypress.json configuration file.
```
"retries": {
    "runMode": 2,
    "openMode": 0
}
```
2. Or alternatively we can just set a default number of retries for all modes.
```
"retries": 1
```


## Parallelelization
1. Cypress’ parallelization strategy is to run test files in parallel. 
2. Spec files are assigned to available machines.
3. Can only be run in parallel in your CI system by adding the '--parallel' key to your run command.
4. Running tests in parallel requires the --record flag be passed.

## Dashboard
1. Go to the [Cypress Dashboard](https://dashboard.cypress.io/) and create an account or login.
2. Open the test runner and select 'Runs'.
3. Login if you're asked to and fill in the details regarding your project as prompted.
4. After setting this you are given a projectId and a key.
5. Add the projectId to cypress.json
```
"projectId": "3bwqu1"
```
6. Add the key to your run command to record test results in the Dashboard.
```
"cy:run:chrome": "cypress run --browser chrome --headless --record --key XXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
```
Then running 'npm run cy:run:chrome' will run your tests and record the results in the dashboard. This can be passed in when building a image or using docker-compose. When running your tests in a CI this is the best place to see the full results and error details should they appear.


## Target Environment
1. baseUrl can be set in you configuration file, cypress.json. 
```
"baseUrl": "https://www.discoverireland.ie"
```
Then cy.visit() and cy.request() are automatically prefixed with this value
Then we can also set an environment variable on your OS to override it when running from CLI
```
CYPRESS_BASE_URL=http://localhost:3000 npm run test
```
2. key/value pairs can be set in cypress.json under the env key
```
"env": {
        "wild_atlantic_way_url": "/wild-atlantic-way",
        "irelands_ancient_east_url": "/irelands-ancient-east",
        "irelands_hidden_heartlands_url": "/irelands-hidden-heartlands"
}
```
And the tests can access them as follows.
```
cy.visit(Cypress.env('wild_atlantic_way_url'))
cy.visit(Cypress.env('Irelands_ancient_east_url'))
cy.visit(Cypress.env('irelands_hidden_heartlands_url'))
```

## Docker
1. We are using docker-compose to build our environment and run our tests.
2. These tests do not run against an app hosted locally. Ideally they would. That's why we use docker-compose to create containers for our app and cypress and allow them to talk to each other.
```
some-app:
    image: "path/or/url/to/app/image"
    ports:
    	- "3000:3000"
```
or build from a Dockerfile in the root of the project
```
some-app:
     build: ../
	 image: autImageName
     ports:
       - "3000:3000"
```
Here we define a docker for our application under test container and expose it on the specified port.
3. We also create a docker container for Cypress and running our tests. Each is configured for the particular conditions we want to test our app under.
```
electron-desktop-tests:
    image: "cypress/included:6.3.0"
    environment:
      - CYPRESS_baseUrl=https://www.discoverireland.ie
    working_dir: /cypress-setup
    command: "--headless --spec cypress/integration/desktop/*.js --record --key 6749cc00-d205-4f62-a701-208e872a6516"
    volumes:
      - ./:/cypress-setup
      - /dev/shm:/dev/shm

  electron-mobile-tests:
    image: "cypress/included:6.3.0"
    environment:
      - CYPRESS_baseUrl=https://www.discoverireland.ie
    working_dir: /cypress-setup
    command: "--config viewportWidth=375,viewportHeight=667,userAgent=iPhone --headless --spec cypress/integration/mobile/*.js --record --key 6749cc00-d205-4f62-a701-208e872a6516"
    volumes:
      - ./:/cypress-setup
      - /dev/shm:/dev/shm
```
The 'cypress/included' image comes with the default electron browser, Chrome and Firefox are built in. Using this image allows ensures cypress tests are ran as soon as the container starts up.
4. If running the tests against another service defined in our docker-compose file we would add a dependency
```
depends_on:
  - some-app
```
5. We can also pass environment variables here which overwrite those defined in cypress.json.
```
environment:
    - CYPRESS_baseUrl=https://www.discoverireland.ie
```
6. Dockers volume mounting feature is used so that the Cypress Docker container shares the hosts file system so that when cypress writes results, logs, screenshots, videos etc. they are available on the host machine. working_dir ensures cypress treats this as it's current folder in the filesystem.
7. We can pass browsers set up instructions under command.
```
command: "--browser chrome --config viewportWidth=375,viewportHeight=667"
```
8. We can also hook up our dashboard here so the tests ran in a container record their results here bt adding '--record --key XXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'.
```
command: "--browser chrome --config viewportWidth=375,viewportHeight=667 --record --key XXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
```
9. Run 'docker-compose run electron-desktop-tests' or 'docker-compose run electron-mobile-tests' from the folder containing the compose file. 

10. Run 'docker-compose down' to stop and remove the created containers(app and cypress).

Additionally we have added a dockerfile for edge. Run 'docker build -t cypress-edge-tests-image:1.0.0 -f edge_tests.dockerfile .'.
```
#base image
FROM cypress/browsers:node12.18.4-edge88
#create directory inside container
RUN mkdir cypress-setup
#define working directory inside container
WORKDIR /cypress-setup 
#copy root directory from host to working specified directory inside the container
COPY . /cypress-setup
#install cypress in container, same as project set up on your own machine
RUN npm install 
#script to run on edge as defined in package.json
RUN npm run cy:run:edge
```

## Continuous Integration
1. We have 2 stages:

Checkout project from source control.
```
stage ('Checkout from SCM'){
	steps{
		cleanWs()
        checkout scm
	}
}
	    
```
Run containers as defined in docker-compose.yml.
```
stage ('Run Tests'){  
	steps{
		sh "docker-compose run electron-mobile-tests"
	}
}
```
2. And we have one post action:
```
post{
 	always{
 	    sh "docker-compose down"
		//delete image created for application under test "sh docker image rm cypress/someAppImageName
 	}
}
```
This stops and deletes the created containers. You'll probaly want to add a hook to notify the source control management tool you are using also. Jenkins allows you to specify an action to notify bitbucket or github or whichever one you want.

If you have added '--record --key' to your container that runs the tests as highlighted above then the results will be stored in your dashboard including all the details you need to debug failures and videos(if you have chosen not to disable).

At the moment we are running our tests for mobile and desktop sequentially. Need to look into how we could run these in parrallel.

