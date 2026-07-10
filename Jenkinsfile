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

        stage('Environment Information') {
            steps {
                sh '''
                    echo "Workspace: $WORKSPACE"
                    git --version
                    docker --version
                    docker info
                '''
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh '''
                    docker run --rm \
                      --init \
                      --ipc=host \
                      --volumes-from jenkins \
                      --workdir "$WORKSPACE" \
                      -e CI=true \
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
            echo 'Playwright tests failed. Check the console output and archived artifacts.'
        }

        cleanup {
            deleteDir()
        }
    }
}