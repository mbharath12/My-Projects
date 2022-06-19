#!groovy<200b>
pipeline {
    agent none
    options {
        disableConcurrentBuilds()
        skipDefaultCheckout true
        timeout(time: 1, unit: 'DAYS')
    }
    stages {
        stage('git-checkout') {
            agent any
            steps {
                git branch: 'master', credentialsId: 'ci-jenkins', url: 'https://gogs.codetantra.in/CloudScaleQA/ct-automation.git'
            }
        }
        stage('ant build') {
            agent any
            steps {
                sh  label: 'ant build',
                    returnStatus: true,
                    script: '''
                        cd ${WORKSPACE}
                        chmod -R 777 TestData
                        echo "driverpath = ${WORKSPACE}/Drivers/chromedriver" > config.properties
                        ant
                    '''
            }
        }
        stage('zipping') {
            agent any
            steps {
                sh  label: 'zipping',
                    returnStatus: true,
                    script: '''
                        cd ${WORKSPACE}
                        mkdir ct-automation
                        mv Drivers/ TestData/ extent-config.xml ExtentConfig.properties config.properties ct.jar CT_logo.jpg ct-automation
                        zip -r ct-automation.zip ct-automation
                    '''
            }
        }
        stage('Uploading the zip into s3') {
            agent any
            steps {
                sh 'cd ${WORKSPACE}'
                withAWS(credentials: 'aws-jenkins-user', region: 'ap-south-1') {
                    s3Upload(file:'ct-automation.zip', bucket:'ct-automation-artifacts', path:'ct-automation.zip')
                }
            }
        }
        stage('workspace-cleanup') {
            agent any
            steps {
                cleanWs deleteDirs: true, notFailBuild: true
            }
        }
    }
}
