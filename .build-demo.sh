#!/bin/bash
cd frontend
NEXT_PUBLIC_DEMO_MODE=true yarn build-demo
cd out
npx serve
