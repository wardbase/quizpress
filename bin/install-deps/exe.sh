#!/bin/bash

echo $1
export WP_REACT_GITHUB_SECRET=$1
php wp-content/plugins/learndash-quiz-power-pack/bin/install-deps/main.php
