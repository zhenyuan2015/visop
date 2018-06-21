#!/bin/bash
#count=$(netstat -anp|grep -c $1)
vpid=$(netstat -anp|grep 8050|awk '{print $NF}'|grep -o [0-9]*)
if [ "x$vpid" == "x" ];then
  echo "port $1 is free"
  exit 0
fi
echo "port $1 is used by $vpid"
kill -9 $vpid
