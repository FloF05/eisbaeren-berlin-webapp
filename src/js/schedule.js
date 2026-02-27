/**
 * schedule.js - Spielplan-Seite Funktionalität
 * Zeigt alle Spiele der Eisbären Berlin mit Filter-Möglichkeit
 */

'use strict';

// Globale Variablen für Spielliste und aktuellen Filter
let allGames = [];
let currentFilter = 'all';

/**
 * Lädt alle Spiele der Eisbären Berlin für die Saison
 */async function loadSchedule() {
    try {
        const response = await fetch('https://api.openligadb.de/getmatchdata/del/2025/Eisbären Berlin');
        const data = await response.json();
        
        allGames = data;
        console.log(allGames);
        displayGames(allGames);
        setupFilters();
    } catch (error) {
        console.error('Fehler beim Laden des Spielplans:', error);
        document.getElementById('schedule-container').innerHTML = 
            '<p class="error-message">Spielplan konnte nicht geladen werden.</p>';
    }
}

/**
 * Zeigt die Spiele im DOM an
 * @param {Array} games - Array mit Spiel-Objekten
 */
function displayGames(games) {
    const container = document.getElementById('schedule-container');
    container.innerHTML = '';
    
    if (games.length === 0) {
        container.innerHTML = '<p>Keine Spiele gefunden.</p>';
        return;
    }
    
    for (let game of games) {
        const isHome = game.team1.teamName === 'Eisbären Berlin';
        const gameCard = document.createElement('article');
        gameCard.className = 'game-card';
        
        const gameDate = new Date(game.matchDateTime);
        const dateString = gameDate.toLocaleDateString('de-DE', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const timeString = gameDate.toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const isFinished = game.matchIsFinished;
        const score = isFinished ? 
            `${game.matchResults[game.matchResults.length - 1].pointsTeam1} : ${game.matchResults[game.matchResults.length - 1].pointsTeam2}` 
            : 'vs';
        
        // Location prüfen
        const locationHTML = game.location ? 
            `<div class="game-card__location">${game.location.locationCity} - ${game.location.locationStadium}</div>` 
            : '';
        
        gameCard.innerHTML = `
            <div class="game-card__date">
                <div>${dateString}</div>
                <div>${timeString}</div>
            </div>
            <div class="game-card__teams">
                <div class="team ${isHome ? 'home-team' : ''}">
                    <img src="${game.team1.teamIconUrl}" alt="${game.team1.teamName}">
                    <span>${game.team1.teamName}</span>
                </div>
                <div class="game-card__score">${score}</div>
                <div class="team ${!isHome ? 'home-team' : ''}">
                    <img src="${game.team2.teamIconUrl}" alt="${game.team2.teamName}">
                    <span>${game.team2.teamName}</span>
                </div>
            </div>
            ${locationHTML}
        `;
        
        container.appendChild(gameCard);
    }

}

/**
 * Richtet die Filter-Buttons ein (Alle/Heim/Auswärts)
 */
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    for (let btn of filterButtons) {
        btn.addEventListener('click', function() {
            // Alle Buttons deaktivieren
            for (let b of filterButtons) {
                b.classList.remove('active');
            }
            
            // Aktuellen Button aktivieren
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            currentFilter = filter;
            
            let filteredGames = allGames;
            
            if (filter === 'home') {
                filteredGames = allGames.filter(game => game.team1.teamName === 'Eisbären Berlin');
            } else if (filter === 'away') {
                filteredGames = allGames.filter(game => game.team2.teamName === 'Eisbären Berlin');
            }
            
            displayGames(filteredGames);
        });
    }
}

loadSchedule();