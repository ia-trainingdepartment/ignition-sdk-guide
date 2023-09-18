#!/bin/bash

echo "Deploy app $aws_app_id branch $branch_name"

JOB_ID=$(aws amplify start-job --app-id $aws_app_id --branch-name $branch_name --job-type RELEASE --query 'jobSummary.jobId' --output text)

echo "Release started"
echo "Job ID is $JOB_ID"

while [[ "$(aws amplify get-job --app-id $aws_app_id --branch-name $branch_name --job-id $JOB_ID --query 'job.summary.status' --output text)" =~ ^(PENDING|RUNNING)$ ]]; do sleep 1; done

# Debugging statement
echo "Output from get-job command after loop:"
aws amplify get-job --app-id $aws_app_id --branch-name $branch_name --job-id $JOB_ID --query 'job.summary.status' --output text

JOB_STATUS="$(aws amplify get-job --app-id $aws_app_id --branch-name $branch_name --job-id $JOB_ID --query 'job.summary.status' --output text)"
echo "Job finished"
echo "Job status is $JOB_STATUS"
