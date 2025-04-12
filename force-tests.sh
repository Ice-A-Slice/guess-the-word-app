#!/bin/bash

# Stop any running Node processes that might be hanging
echo "Stopping any hanging Node processes..."
pkill -f "node.*jest" || true

# Clean up webpack cache directory completely
echo "Cleaning webpack cache and .next directory..."
rm -rf app/.next

# Run the tests with a strict timeout
echo "Running tests with strict timeout..."
cd app && npx jest --forceExit --detectOpenHandles --testTimeout=10000

echo "Tests completed."