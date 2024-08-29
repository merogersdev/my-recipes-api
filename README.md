# My Recipes - AWS

## Summary

Full-stack serverless application written in TypeScript to keep track of a user's recipes.

## Goal

Utilize AWS Cloud Development Kit and Typescript to build a fully-featured application

## Tech Stack

- [x] TypeScript
- [] React
- [] Redux Toolkit
- []
- [x] AWS CDK
- [x] DynamoDB
- [] Lambda
- [] S3
- [x] API Gateway
- [x] Usage Plan + API Key
- [x] Cognito

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template

## Notes

### DynamoDB

- Entity Relation Digram
- Identified Access Patterns - list eg. Get all recipes for given user

- PK: author
- SK: createdOn
- name
- category
- ingredients
- method
- cookTime
- prepTime
- yield
- servings
