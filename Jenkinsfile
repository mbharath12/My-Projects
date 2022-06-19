pipeline {
  agent {
    label 'winslave'
  }
  stages {
    stage('Build') {
      steps {
        echo 'Downloading required libraries mentioned in Requirements.txt'
        bat 'pip install -r Requirements.txt'
      // This command will compile the python files.
      //bat 'python -m compileall CustomLibrary.py'
      }
    }

     stage('Run Mobile Tests') {
       steps {
         echo 'Running mobile testcases'
        bat '''
            robot --listener allure_robotframework;allure-results --outputdir Mobile_Reports KeywordTestCases/Mobile/Android/Android_Demo_Test_Suite.robot
            exit 0 '''
       }
     }
    stage('Generate Reports') {
      steps {
        script {
          allure([
          includeProperties: false, jdk: '', properties: [], reportBuildPolicy: 'ALWAYS', results: [[path: 'allure-results']]])
        }
        echo 'Merging output testresults'
        bat '''
            rebot --output output.xml Mobile_Reports/output.xml
            exit 0 '''
      }
    }
  }
  post {
    // Updates pipeline status in Gitlab
    failure {
      updateGitlabCommitStatus name: 'Build',
      state: 'failed'
    }
    success {
      updateGitlabCommitStatus name: 'Build',
      state: 'success'
    }
    always {
      script {
        step([
        $class: 'RobotPublisher', outputPath: '', outputFileName: 'output.xml', disableArchiveOutput: false, passThreshold: 100, unstableThreshold: 95.0, otherFiles: '*.png', ])
      }
    }
  }
}
