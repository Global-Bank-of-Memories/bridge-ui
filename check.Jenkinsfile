pipeline {
  agent any

  tools {
    nodejs "node"
  }

  stages {
    stage('Install Dependencies') {
      steps {
        script {
          sh 'npm install'
        }
      }
    }

    stage('Prettier Lint') {
      steps {
        script {
          sh 'npm run prettier'
        }
      }
    }

    stage('Stylelint') {
      steps {
        script {
          sh 'npm run stylelint'
        }
      }
    }

    stage('ESLint') {
      steps {
        script {
          sh 'npm run eslint'
        }
      }
    }

    stage('Pre-Build') {
      steps {
        script {
          sh 'npm run build:prod'
        }
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}
