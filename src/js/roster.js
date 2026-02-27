/**
 * roster.js - Kader-Seite Funktionalität
 * Lädt und zeigt die Spieler-Daten aus der lokalen JSON-Datei
 */

'use strict';

/**
 * Lädt die Kader-Daten aus der JSON-Datei
 */async function loadRoster() {
    try {
        const response = await fetch('../src/data/kader.json');
        const data = await response.json();

        displayPlayers('goalies', data.goalies, true);
        displayPlayers('defenders', data.defenders, false);
        displayPlayers('forwards', data.forwards, false);
    } catch (error) {
        console.error('Fehler beim Laden des Kaders:', error);
    }
}

/**
 * Zeigt die Spieler in Karten-Format an
 * @param {string} containerId - ID des Container-Elements
 * @param {Array} players - Array mit Spieler-Objekten
 * @param {boolean} isGoalie - Ob es sich um Torhüter handelt
 */
function displayPlayers(containerId, players, isGoalie = false) {
    const container = document.getElementById(containerId);
    
    for (let player of players) {
        const playerCard = document.createElement('article');
        playerCard.className = 'player-card';
        
        const handLabel = isGoalie ? 'Fanghand' : 'Schusshand';
        const handValue = isGoalie ? player.catch : player.shoots;
        
        playerCard.innerHTML = `
            <div class="player-card__number">${player.number}</div>
            <img src="../src/${player.image}" alt="${player.name}" class="player-card__image" onerror="this.src='../src/assets/pictures/placeholder-player.jpg'">
            <h3 class="player-card__name">${player.name}</h3>
            <div class="player-card__details">
                <p><strong>Nationalität:</strong> ${player.nationality}</p>
                <p><strong>Größe:</strong> ${player.height} cm</p>
                <p><strong>Gewicht:</strong> ${player.weight} kg</p>
                <p><strong>${handLabel}:</strong> ${handValue}</p>
            </div>
        `;
        
        container.appendChild(playerCard);
    }
}

// Initialisierung beim Laden der Seite
loadRoster();