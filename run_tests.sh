node maaNode.js > /dev/null &
maadmin=$!
npm test
kill $maadmin