let audioCtx;
let sourceNode;
let filterNode;
let isFilterOn = false;

document.getElementById("loadBtn").onclick = () => {
    const url = document.getElementById("ytInput").value;
    const videoId = extractVideoID(url);

    if (!videoId) {
        alert("رابط غير صالح");
        return;
    }

    document.getElementById("videoContainer").innerHTML = `
        <iframe id="ytPlayer" width="560" height="315"
        src="https://www.youtube.com/embed/${videoId}?enablejsapi=1"
        frameborder="0" allow="autoplay"></iframe>
    `;

    setTimeout(setupAudioFilter, 1500);
};

document.getElementById("toggleFilter").onclick = () => {
    isFilterOn = !isFilterOn;
    document.getElementById("toggleFilter").innerText =
        `عزل الموسيقى: ${isFilterOn ? "ON" : "OFF"}`;

    if (filterNode) {
        filterNode.gain.value = isFilterOn ? 0 : 1;
    }
};

function extractVideoID(url) {
    const match = url.match(/v=([^&]+)/);
    return match ? match[1] : null;
}

function setupAudioFilter() {
    const iframe = document.getElementById("ytPlayer");
    const video = iframe.contentWindow;

    const audio = new Audio(`https://www.youtube.com/embed/${extractVideoID(document.getElementById("ytInput").value)}`);

    audio.crossOrigin = "anonymous";

    audioCtx = new AudioContext();
    sourceNode = audioCtx.createMediaElementSource(audio);

    filterNode = audioCtx.createGain();
    filterNode.gain.value = 1;

    sourceNode.connect(filterNode).connect(audioCtx.destination);

    audio.play();
}
