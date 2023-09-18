#!/bin/bash

echo "Deploy app $aws_app_id branch $branch_name"
jq --version
aws amplify start-job --app-id $aws_app_id --branch-name $branch_name --job-type RELEASE
JOB_ID=$(aws amplify start-job --app-id $aws_app_id --branch-name $branch_name --job-type RELEASE | jq -r '.jobSummary.jobId')
echo "Release started"
echo "Job ID is $JOB_ID"
while [[ "$(aws amplify get-job --app-id $aws_app_id --branch-name $branch_name --job-id $JOB_ID | jq -r '.job.summary.status')" =~ ^(PENDING|RUNNING)$ ]]; do sleep 1; done
JOB_STATUS="$(aws amplify get-job --app-id $aws_app_id --branch-name $branch_name --job-id $JOB_ID | jq -r '.job.summary.status')"
echo "Job finished"
echo "Job status is $JOB_STATUS"
