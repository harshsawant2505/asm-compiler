const express = require("express");
const { exec } = require("child_process");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/compile", (req, res) => {
    const code = req.body.code;
    require("fs").writeFileSync("program.asm", code);

    exec("nasm -f elf64 program.asm -o program.o && ld -o program program.o && ./program", (error, stdout, stderr) => {
        if (error) {
            console.error("Execution error: ", error); // Log the error to console
            return res.status(400).json({ error: error.message });
        }
        if (stderr) {
            console.error("stderr: ", stderr); // Log stderr if there is any
            return res.status(400).json({ error: stderr });
        }
        console.log("stdout: ", stdout); // Log stdout (successful output)
        res.json({ output: stdout });
    });
});

app.listen(5000, () => console.log("Server running on port 5000"));
