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
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh '''
                    JENKINS_UID=$(id -u)
                    JENKINS_GID=$(id -g)

                    echo "Jenkins UID: $JENKINS_UID"
                    echo "Jenkins GID: $JENKINS_GID"

                    docker run --rm \
                      --init \
                      --ipc=host \
                      --user "$JENKINS_UID:$JENKINS_GID" \
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
        echo 'Playwright tests passed.'
    }

    failure {
        echo 'Playwright tests failed. Open the Playwright HTML Report.'
    }

        cleanup {
            deleteDir()
        }
    }
}