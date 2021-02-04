pipeline{

	agent any

    options{
        buildDiscarder(logRotator(numToKeepStr: '8'))
    }

    stages{
        stage ('Checkout from SCM'){
		    steps{
				script{
                    currentBuild.displayName = "#${BUILD_NUMBER} [${GIT_BRANCH}]"
                }
			    cleanWs()
                checkout scm
		    }
        }
		//stage('create test environment') {
			//steps{
                //sh "docker-compose run some-app"
            //}
		//}
	    stage ('Run Desktop Tests'){  
		    steps{
                sh "docker-compose run electron-desktop-tests"
            }
        }

		stage ('Run Mobile Tests'){  
		    steps{
				sh "docker-compose run electron-mobile-tests"
		    }
        }
	}
 	post{
 	    always{
 	        sh "docker-compose down"
			//delete image created for application under test "sh docker image rm cypress/someAppImageName"
 	    }
 	}
}