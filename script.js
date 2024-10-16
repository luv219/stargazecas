// script.js

const fadeDuration = 10;

// Set up the dimensions of the SVG canvas
const width = window.innerWidth;
const height = window.innerHeight;

const constellationSounds = {
    'Orion': 'audio/Orion.mp3',
    'Cassiopeia': 'audio/Cassiopeia.mp3',
    'Ursa Major': 'audio/ursamajor.mp3',
    'Scorpius': 'audio/scorpius.mp3',
    'Cygnus': 'audio/cygnus.mp3',
    'Taurus': 'audio/taurus.mp3',
    'Leo': 'audio/leo.mp3',
    'Andromeda': 'audio/andromeda.mp3',
    'Lyra': 'audio/lyra.mp3',
    'Pegasus': 'audio/pegasus.mp3',
    'Draco': 'audio/draco.mp3',
    'Aquarius': 'audio/aquarius.mp3',
    'Perseus': 'audio/perseus.mp3',
    'Pisces': 'audio/pisces.mp3',
    'Sagittarius': 'audio/sagittarius.mp3',
    'Cepheus': 'audio/cepheus.mp3',
    'Phoenix': 'audio/phoenix.mp3',
    'Hercules': 'audio/hercules.mp3',
    'Canis Major': 'audio/Canis Major.mp3',
    'Vela': 'audio/vela.mp3',
    'Crux': 'audio/crux.mp3',
    'Aquila': 'audio/aquila.mp3',
    'Cancer': 'audio/cancer.mp3',
    'Centaurus': 'audio/centaurus.mp3',
    'Corona Borealis': 'audio/cborealis.mp3',
    'Equuleus': 'audio/equuleus.mp3',
    'Indus': 'audio/indus.mp3',
    'Lupus': 'audio/lupus.mp3',
    'Ophiuchus': 'audio/ophiuchus.mp3',
    'Puppis': 'audio/puppis.mp3',
    'Sculptor': 'audio/sculptor.mp3',
    'Serpens': 'audio/serpens.mp3',
    'Aries': 'audio/aries.mp3',
    'Canis minor': 'audio/canisminor.mp3',
    'Lynx': 'audio/lynx.mp3',
    'Hydra': 'audio/hydra.mp3',
    'Lacerta': 'audio/lacerta.mp3',
    'Pavo': 'audio/pavo.mp3',
    'Triangulum': 'audio/triangulum.mp3',
};
// Create an SVG element and append it to the #star-map div
const svg = d3.select('#star-map')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('position', 'absolute')  // Absolute position to cover the window
    .style('top', 0)
    .style('left', 0);

// Projection function remains the same
function projection(ra, dec) {
    let x = (ra / 360) * width;
    let y = height - ((dec + 90) / 180) * height;
    return [x, y];
}

// Randomly generate additional stars to fill the background
function generateRandomStars(count) {
    const randomStarsGroup = svg.append('g').attr('class', 'random-stars');
    
    for (let i = 0; i < count; i++) {
        const randomX = Math.random() * width;
        const randomY = Math.random() * height;
        const randomRadius = Math.random() * 2 + 1; // Radius between 1 and 3

        randomStarsGroup.append('circle')
            .attr('cx', randomX)
            .attr('cy', randomY)
            .attr('r', randomRadius)
            .attr('fill', '#fff')  // White color for the stars
            .attr('opacity', 0.7);  // Slightly transparent
    }
}

// Call the function after the constellations have been drawn
generateRandomStars(300); // Adjust the number as needed


// Load the constellation data (unchanged)
d3.json('data/constellations.json').then(data => {
    data.forEach(constellation => {
        const group = svg.append('g')
            .attr('class', 'constellation')
            .attr('id', constellation.name)
            .on('click', () => {
                crossfadeToNextSound(constellation.name);
            });

        // Draw lines and stars (unchanged)
        group.selectAll('.line')
            .data(constellation.lines)
            .enter()
            .append('line')
            .attr('x1', d => projection(constellation.stars.find(s => s.name === d.from).ra, constellation.stars.find(s => s.name === d.from).dec)[0])
            .attr('y1', d => projection(constellation.stars.find(s => s.name === d.from).ra, constellation.stars.find(s => s.name === d.from).dec)[1])
            .attr('x2', d => projection(constellation.stars.find(s => s.name === d.to).ra, constellation.stars.find(s => s.name === d.to).dec)[0])
            .attr('y2', d => projection(constellation.stars.find(s => s.name === d.to).ra, constellation.stars.find(s => s.name === d.to).dec)[1])
            .attr('stroke', '#fff')
            .attr('stroke-width', 1)
            .attr('opacity', 0.6);

        group.selectAll('.star')
            .data(constellation.stars)
            .enter()
            .append('circle')
            .attr('class', 'star')
            .attr('cx', d => projection(d.ra, d.dec)[0])
            .attr('cy', d => projection(d.ra, d.dec)[1])
            .attr('r', 3)
            .attr('fill', '#fff');
    });
}).catch(error => {
    console.error('Error loading data:', error);
});

// Function to fade out current sound and fade in the next one
function crossfadeToNextSound(nextConstellationName) {
    const audioPlayer = document.getElementById('audio-player');
    const audioSrc = constellationSounds[nextConstellationName];

    if (!audioSrc) {
        console.error('No audio file found for', nextConstellationName);
        return;
    }

    // Show the audio player when a constellation is clicked
    audioPlayer.style.display = 'block';

    // Fade out the current audio
    const fadeOutInterval = setInterval(() => {
        if (audioPlayer.volume > 0.05) {
            audioPlayer.volume -= 0.05;
        } else {
            clearInterval(fadeOutInterval);
            audioPlayer.pause();  // Stop the audio completely when volume reaches 0
            audioPlayer.volume = 0;  // Set volume to 0 to prepare for fade in

            // Play the next constellation
            playAndFadeInSound(nextConstellationName, audioSrc);
        }
    }, fadeDuration * 100 / 20);  // Decrease volume every 100 ms over the fadeDuration
}


// Function to play the sound and fade in
function playAndFadeInSound(constellationName, audioSrc) {
    const audioPlayer = document.getElementById('audio-player');
    
    // Try to resume AudioContext (required for iOS)
    if (audioPlayer.context && audioPlayer.context.state === 'suspended') {
        audioPlayer.context.resume();
    }

    audioPlayer.src = audioSrc;
    
    // Highlight the next constellation
    d3.selectAll('.constellation').selectAll('.star').attr('fill', '#fff');
    d3.select(`#${constellationName}`).selectAll('.star').attr('fill', 'pink');

    // Update the info bar
    document.getElementById('info-bar').textContent = `Playing: ${constellationName}`;

    // Play the audio and fade in
    audioPlayer.play().catch(error => {
        console.error('Error playing audio:', error);
    });

    // Fade in the audio
    const fadeInInterval = setInterval(() => {
        if (audioPlayer.volume < 0.95) {
            audioPlayer.volume += 0.05;
        } else {
            clearInterval(fadeInInterval);
            audioPlayer.volume = 1;  // Set volume to max when fade-in is complete
        }
    }, fadeDuration * 100 / 20);  // Increase volume every 100 ms over the fadeDuration
}

// Function to play a random constellation
function playRandomConstellation() {
    const constellations = Object.keys(constellationSounds);
    const randomIndex = Math.floor(Math.random() * constellations.length);
    const randomConstellation = constellations[randomIndex];
    crossfadeToNextSound(randomConstellation);
}

// Add event listener to the audio player to detect when the sound ends
const audioPlayer = document.getElementById('audio-player');
audioPlayer.addEventListener('ended', playRandomConstellation);