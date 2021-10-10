node maaNode.js > ./testOutput.txt 2>> ./testOutput.txt &
maadmin=$!
npm test
kill $maadmin
