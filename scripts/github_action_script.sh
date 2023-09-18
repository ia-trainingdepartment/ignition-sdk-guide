#!/bin/bash

echo "Deploy app $aws_app_id branch $branch_name"

# Debugging statement
echo "Output from start-job command:"
aws amplify start-job --app-id $aws_app_id --branch-name $branch_name --job-type RELEASE --query 'jobSummary.jobId' --output text

JOB_ID=$(aws amplify start-job --app-id $aws_app_id --branch-name $branch_name --job-type RELEASE --query 'jobSummary.jobId' --output text)

echo "Release started"
echo "Job ID is $JOB_ID"

# Debugging statement
echo "Output from get-job command:"
aws amplify get-job --app-id $aws_app_id --branch-name $branch_name --job-id $JOB_ID --query 'job.summary.status' --output text

while [[ "$(aws amplify get-job --app-id $aws_app_id --branch-name $branch_name --job-id $JOB_ID --query 'job.summary.status' --output text)" =~ ^(PENDING|RUNNING)$ ]]; do sleep 1; done

# Debugging statement
echo "Output from get-job command after loop:"
aws amplify get-job --app-id $aws_app_id --branch-name $branch_name --job-id $JOB_ID --query 'job.summary.status' --output text

JOB_STATUS="$(aws amplify get-job --app-id $aws_app_id --branch-name $branch_name --job-id $JOB_ID --query 'job.summary.status' --output text)"
echo "Job finished"
echo "Job status is $JOB_STATUS"
With these debugging statements added, you'll be able to see the exact output produced by the AWS CLI commands in the GitHub Actions logs. This will help pinpoint the issue and determine why the JOB_ID variable is not getting the expected value. Please run the workflow again and share the updated output so that we can further troubleshoot if necessary.





