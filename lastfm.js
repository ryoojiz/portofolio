async function fetchNowPlaying() {
    const username = "ryoojiz";
    const apiKey = "3a3fade16d6a20b47402106a50a50127";
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const tracks = data.recenttracks.track;

        if (tracks.length > 0) {
            const nowPlaying = tracks[0];
            const artist = nowPlaying.artist["#text"];
            const track = nowPlaying.name;
            const albumArt = nowPlaying.image[2]["#text"] || "https://via.placeholder.com/174";

            const searchQuery = encodeURIComponent(`${artist} - ${track}`);
            
            // Update search links
            document.getElementById("youtube-link").href = `https://www.youtube.com/results?search_query=${searchQuery}`;
            document.getElementById("spotify-link").href = `https://open.spotify.com/search/${searchQuery}`;
            document.getElementById("apple-music-link").href = `https://music.apple.com/search?term=${searchQuery}`;

            document.getElementById("songtitle").innerText = track;
            document.getElementById("songartist").innerText = artist;
            document.getElementById("coverart").src = albumArt;
            document.getElementById("coverart-bg").src = albumArt;

            // Reset and restart progress animation
            const progressCircle = document.getElementById('progress-circle');
            const animation = document.getElementById('progress-animation');
            progressCircle.setAttribute('stroke-dashoffset', '125.6');
            animation.beginElement();
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

fetchNowPlaying();
setInterval(fetchNowPlaying, 15000); // Refresh every 30 seconds