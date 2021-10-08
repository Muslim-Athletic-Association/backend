node maaNode.js > ./testOutput.txt &
maadmin=$!
npm test
kill $maadmin
