# Troubleshooting Steps

If you run into an issue while working on the backend, use this checklist:

1. Read the terminal output carefully and note the first error in the stack trace.
2. Confirm dependencies are installed by running `npm install`.
3. Restart the backend with `npm run dev` or `node server.js`.
4. Verify that port `3000` is not already in use by another process.
5. If the error mentions missing files, confirm the expected paths exist in this repository.
6. Re-run the failing request after each change so you can isolate what fixed it.
