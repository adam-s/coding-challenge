pid=$(lsof -i:3000 -t); kill -TERM $pid || kill -KILL $pid
yarn jest