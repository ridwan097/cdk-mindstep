# Steps to run

- `npm run install-all` after cloning
- Open Docker or an equivalent tool (e.g., Orbstack)
- `npm run local` run this with your Docker open

## Troubleshooting

- Run `brew install aws-sam-cli` if you get `sh: sam: command not found`

## Future changes

- Add nodemon
- Add more comprehensive tests
- Add Swagger documentation

## Note

- **CSV File Creation Issue:** In the current setup, only the POST endpoint works reliably. There is an issue with the creation and management of the CSV file when attempting to perform GET or PATCH operations. The problem seems to be related to how temporary files are handled in different environments, particularly in Docker or serverless environments where file system access is restricted or behaves differently.

- **Mock Entry for API (POST /invisibility):**

  - **Endpoint:** `POST /invisibility`
  - **Example Payload:**

    ```json
    {
      "superheroScore": 85.5
    }
    ```

  - **Expected Response:**

    ```json
    {
      "invisibilityID": "mocked-uuid",
      "superheroScore": 85.5,
      "invisibilityScore": 70,
      "status": "Transparent"
    }
    ```

  - **Notes:** The response will include a unique `invisibilityID` and an invisibility score based on the provided `superheroScore`. The status will vary depending on the score.

- **CSV File Management:** The application attempts to create and manage a CSV file to store invisibility scores. This works locally for POST requests but encounters issues with GET and PATCH requests due to the environment's file system restrictions. Future changes may involve switching to a more robust data storage solution, like a database, to overcome these limitations.

## Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile TypeScript to JavaScript
- `npm run watch` watch for changes and compile
- `npm run test` perform the Jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template

## Project generation

- Initialize the project `cdk init app --language typescript`
