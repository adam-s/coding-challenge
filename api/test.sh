pid=$(lsof -i:5000 -t); kill -TERM $pid || kill -KILL $pid
yarn jest