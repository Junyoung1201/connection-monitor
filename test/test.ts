import { exec, spawn } from "child_process";

console.clear();

let proc = exec("chcp 65001 && tasklist | findstr 18168")

proc.stdout.on('data', (data: string) => {

    let [name, pid, sName, _, memory] = data.split(" ").filter(str => str.length > 0).map(str => str.trim());

    if(name && pid && sName && memory) {
        console.log(`이름: ${name}, PID: ${pid}, 세션 이름: ${sName}, 메모리 사용률: ${memory}`);
    }
})