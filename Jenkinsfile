def img = null

pipeline {
  agent any

  environment {
    PACKAGE_VERSION = "${sh (returnStdout: true, script: '''grep 'version' package.json | cut -d '"' -f4 | tr -d '\n' ''')}"
    IMAGE_NAME = 'gbm/bridge-ui'
  }

  stages {
    stage('Build Image') {
      steps {
        script {
          img = docker.build(IMAGE_NAME)
        }
      }
    }

    stage('Deploy Image') {
      when {
        branch 'master'
      }

      environment {
        TAG = 'latest'
        CONTAINER_NAME = 'prod-gbm-bridge-ui'
      }

      steps {
        script {
          sh 'docker stop $CONTAINER_NAME || true && docker rm $CONTAINER_NAME || true'
          img.run('''-d \
            --name $CONTAINER_NAME \
            --network app_gbm-infra \
          ''')
        }
      }
    }

    stage('Removing Untagged Instances') {
      steps {
        script {
          sh 'docker rmi $(docker images --filter "dangling=true" -q --no-trunc) -f || true'
        }
      }
    }
  }

  post {
    always {
      cleanWs()
      dir("${env.WORKSPACE}@tmp") {
        deleteDir()
      }
      dir("${env.WORKSPACE}@script") {
        deleteDir()
      }
      dir("${env.WORKSPACE}@script@tmp") {
        deleteDir()
      }
    }
  }
}
