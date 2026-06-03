const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

async function run() {
    const videoFile = document.getElementById("video").files[0];
    const audioFile = document.getElementById("audio").files[0];

    if (!videoFile || !audioFile) {
        alert("ارفع فيديو وصوت");
        return;
    }

    document.getElementById("status").innerText = "جاري تحميل المحرك...";
    await ffmpeg.load();

    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));
    ffmpeg.FS('writeFile', 'audio.mp3', await fetchFile(audioFile));

    document.getElementById("status").innerText = "جاري تبديل الصوت...";

    await ffmpeg.run(
        '-i', 'input.mp4',
        '-i', 'audio.mp3',
        '-c:v', 'copy',
        '-map', '0:v:0',
        '-map', '1:a:0',
        '-shortest',
        'output.mp4'
    );

    const data = ffmpeg.FS('readFile', 'output.mp4');

    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

    document.getElementById("preview").src = url;

    const download = document.getElementById("download");
    download.href = url;
    download.style.display = "inline";

    document.getElementById("status").innerText = "تم الانتهاء ✅";
}
