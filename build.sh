#!/bin/bash
# Regenerates the minified script.js, publications.js, and style.css
# from the readable source files in src/.
#
# Run this ANY time you edit a file inside src/ — then commit and push
# both the src/ changes and the regenerated minified files together.
#
# Usage:
#   ./build.sh

set -e

echo "Minifying JS and CSS..."
npx terser src/script.js -o script.js -c -m --comments false
npx terser src/publications.js -o publications.js -c -m --comments false
npx cleancss -o style.css src/style.css

echo "Done. script.js, publications.js, and style.css are updated."
