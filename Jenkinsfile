```groovy
pipeline {
    agent any

    environment {
        CI = 'true'
        PLAYWRIGHT_IMAGE = 'mcr.microsoft.com/playwright:v1.61.1-noble'
        PLAYWRIGHT_JUNIT_OUTPUT_NAME = 'test-results/results.xml'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Environment Information') {
            steps {
                sh '''
                    echo "Workspace: $WORKSPACE"
                    echo "Jenkins user: $(whoami)"
                    echo "Jenkins UID: $(id -u)"
                    echo "Jenkins GID: $(id -g)"

                    git --version
                    docker --version
                '''
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh '''
                    JENKINS_UID=$(id -u)
                    JENKINS_GID=$(id -g)

                    echo "Running Playwright container as UID:GID ${JENKINS_UID}:${JENKINS_GID}"

                    docker run --rm \
                      --init \
                      --ipc=host \
                      --user "${JENKINS_UID}:${JENKINS_GID}" \
                      --volumes-from jenkins \
                      --workdir "$WORKSPACE" \
                      -e CI=true \
                      -e HOME=/tmp \
                      -e npm_config_cache=/tmp/npm-cache \
                      -e PLAYWRIGHT_JUNIT_OUTPUT_NAME=test-results/results.xml \
                      "$PLAYWRIGHT_IMAGE" \
                      /bin/bash -c "
                        npm ci &&
                        npx playwright test --reporter=html,junit
                      "
                '''
            }
        }
    }

    post {
        always {
            junit(
                testResults: 'test-results/results.xml',
                allowEmptyResults: true
            )

            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report',
                reportTitles: 'Playwright Test Results'
            ])

            archiveArtifacts(
                artifacts: 'playwright-report/**,test-results/**',
                allowEmptyArchive: true,
                fingerprint: true
            )
        }

        success {
            echo 'Playwright tests passed successfully.'
        }

        unstable {
            echo 'Some Playwright test results are unstable. Check the reports.'
        }

        failure {
            echo 'Playwright tests failed. Open the Playwright HTML Report for details.'
        }

        cleanup {
            echo 'Cleaning Jenkins workspace.'
            deleteDir()
        }
    }
}
```
