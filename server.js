const express = require('express');
let app = express();
const fs = require('fs/promises');

app.use(express.static('public'));

app.get('/api/read-file', async function (req, res) {
  let file = await fs.readFile('./static/00000Pe2Text04UTF.txt', 'utf8');
  let lines = file.split('\r\n').filter(Boolean);
  let audio = 'Khng3Se3KuaIunn5.mp3';
  let subtitle = lines.map((line, idx) => {
    let lenKha = Number(line.substr(0, 2));
    let kha = line.substr(2, lenKha).split('　');
    let lenRom = Number(line.substr(2 + lenKha + 1, 3));
    let rom = line
      .substr(2 + lenKha + 1 + 3, lenRom)
      .split(' ')
      .filter(Boolean);
    rom.push(kha[kha.length - 1]);
    let time = line.substr(2 + lenKha + 1 + 3 + lenRom + 4);
    let lineNum = Number(time.substr(0, 4));
    let jump = time
      .substr(5, time.length - 5 - 3)
      .split('*')
      .filter((j, idx) => {
        return idx % 2 === 0;
      })
      .map((j) => Number(j.substr(0, j.length - 1)));
    let start = jump[0];
    let end = jump[jump.length - 1];
    return { idx, line, lenKha: kha.length, kha, lenRom: rom.length, rom, time, lineNum, jump, start, end };
  });
  subtitle.map((line, idx) => {
    line.end = subtitle[idx + 1] ? subtitle[idx + 1].start : line.end + 100;
    return line;
  });
  res.json({ audio, subtitle });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
