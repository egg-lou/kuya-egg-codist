import os
import requests
import json
import base64

def lambda_handler(event, context):
    print("DEBUG: Lambda invoked with event:", event)

    # Self-hosted Judge0 configuration
    JUDGE0_API_URL = os.environ.get("JUDGE0_API_URL", "http://localhost:2358")
    JUDGE0_AUTH_TOKEN = os.environ.get("JUDGE0_AUTH_TOKEN")

    if not JUDGE0_AUTH_TOKEN:
        raise Exception("Missing JUDGE0_AUTH_TOKEN in environment variables")

    headers = {
        "Content-Type": "application/json",
        "td-auth-token": JUDGE0_AUTH_TOKEN,
    }

    # Parse event body
    body = event.get("body")
    if body and isinstance(body, str):
        try:
            body = json.loads(body)
        except json.JSONDecodeError:
            body = {}
    else:
        body = {}

    # Get code submission details from event
    source_code = body.get("source_code", "print('Hello, World!')")
    language_id = body.get("language_id", 71)
    stdin = body.get("stdin", "")

    # Check if stdin is empty and handle accordingly
    if stdin == "":
        stdin = None  # Ensure we don't send empty stdin, as some languages fail with empty input.

    submission_data = {
        "language_id": language_id,
        "source_code": source_code,
        "stdin": stdin
    }

    print("DEBUG: Submitting code to Judge0:", submission_data)

    # Submit code to Judge0 API with wait=true (Judge0 handles polling internally)
    # This is simpler and more efficient for production
    submit_response = requests.post(
        f"{JUDGE0_API_URL}/submissions?base64_encoded=true&wait=true",
        headers=headers,
        json=submission_data,
        timeout=30,  # 30 second timeout for the entire execution
    )

    print("DEBUG: Submission response:", submit_response.status_code, submit_response.text)

    if submit_response.status_code != 201:
        return {
            "statusCode": submit_response.status_code,
            "body": json.dumps({"error": submit_response.text})
        }

    result = submit_response.json()
    print("DEBUG: Execution finished with result:", result)

    # Decode the base64-encoded stderr and compile_output for logging
    stderr = result.get("stderr", "")
    compile_output = result.get("compile_output", "")

    if stderr:
        decoded_stderr = base64.b64decode(stderr).decode('utf-8')
        print("DEBUG: stderr decoded:", decoded_stderr)
    if compile_output:
        decoded_compile_output = base64.b64decode(compile_output).decode('utf-8')
        print("DEBUG: compile_output decoded:", decoded_compile_output)

    return {
        "statusCode": 200,
        "body": json.dumps(result)
    }