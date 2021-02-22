#!/bin/bash

echo $1
export WP_REACT_GITHUB_SECRET=$1
php wp-content/plugins/wp-react-plugin-boilerplate/bin/install-deps/main.php
