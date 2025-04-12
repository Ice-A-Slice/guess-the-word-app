#!/bin/bash

# Clean up webpack cache directory to prevent the ENOENT error
echo "Cleaning webpack cache..."
rm -rf app/.next/cache/webpack

# Run the tests with increased timeout
echo "Running tests..."
cd app && npm test

echo "Tests completed."