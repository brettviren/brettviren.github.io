#!/bin/bash
#
# Batch publish

base="/home/bv/git/brettviren.github.com"
emacs --batch -l pub.el --eval '(org-publish-project "topics")'
