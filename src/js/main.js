'use strict';
const API_BASE_URL = 'https://api.openligadb.de';
const LEAGUE_ID = 4849;
const TEAM_ID = 641; // Eisbären Berlin
const LEAGUE_SHORT = 'del';
const SEASON = '2025'; 
const proxy = 'https://api.allorigins.win/raw';

async function loadNextGame() {
    try {
        const response = await fetch(`${API_BASE_URL}/getnextmatchbyleagueteam/${LEAGUE_ID}/${TEAM_ID}`);
        
        if (!response.ok) {
            throw new Error('Fehler beim Laden der Daten');
        }
        
        const game = await response.json();
        console.log('Nächstes Spiel:', game);
        
        if (game) {
            displayNextGame(game);
        } else {
            document.getElementById('next-game').innerHTML = '<p>Kein anstehendes Spiel gefunden.</p>';
        }
        
    } catch (error) {
        console.error('Fehler:', error);
        document.getElementById('next-game').innerHTML = '<p>Daten konnten nicht geladen werden.</p>';
    }
}

function displayNextGame(game) {
    const date = new Date(game.matchDateTime);
    const formattedDate = date.toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    document.getElementById('next-game').innerHTML = `
        <div class="game">
            <div class="game__date">
                <p><strong>${formattedDate}</strong></p>
                <p>${formattedTime} Uhr</p>
            </div>
            <div class="game__teams">
                <div class="game__team">
                    <img src="${game.team1.teamIconUrl}" alt="${game.team1.teamName}" class="game__logo">
                    <p><strong>${game.team1.teamName}</strong></p>
                </div>
                <span class="game__vs">vs</span>
                <div class="game__team">
                    <img src="${game.team2.teamIconUrl}" alt="${game.team2.teamName}" class="game__logo">
                    <p><strong>${game.team2.teamName}</strong></p>
                </div>
            </div>
        </div>
    `;
}

async function loadTable() {
    try {
        const response = await fetch(`${API_BASE_URL}/getbltable/${LEAGUE_SHORT}/${SEASON}`);
        
        if (!response.ok) {
            throw new Error('Fehler beim Laden der Daten');
        }
        
        const table = await response.json();
        console.log('Tabelle:', table);
        
        if (table) {
            displayTable(table);
        } else {
            document.getElementById('standings').innerHTML = '<p>Keine Tabelle gefunden</p>';
        }
        
    } catch (error) {
        console.error('Fehler:', error);
        document.getElementById('standings').innerHTML = '<p>Daten konnten nicht geladen werden.</p>';
    }
}

function displayTable(table) {
    let tableRows = '';
    
    for (let i = 0; i < table.length; i++) {
        const team = table[i];
        const position = i + 1;
        const isEisbaeren = team.teamInfoId === TEAM_ID;
        
        tableRows += `
            <tr class="${isEisbaeren ? 'highlight' : ''}">
                <td>${position}</td>
                <td class="team-name">
                    <img src="${team.teamIconUrl}" alt="${team.teamName}" class="team-icon">
                    ${team.teamName}
                </td>
                <td>${team.matches}</td>
                <td>${team.won}</td>
                <td>${team.lost}</td>
                <td>${team.goals}:${team.opponentGoals}</td>
                <td>${team.goalDiff > 0 ? '+' : ''}${team.goalDiff}</td>
                <td><strong>${team.points}</strong></td>
            </tr>
        `;
    }
    
    const tableHTML = `
        <table class="standings-table">
            <thead>
                <tr>
                    <th>Pos</th>
                    <th>Team</th>
                    <th>Sp</th>
                    <th>S</th>
                    <th>N</th>
                    <th>Tore</th>
                    <th>Diff</th>
                    <th>Pkt</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;
    
    document.getElementById('standings').innerHTML = tableHTML;
}



function main() {
    loadNextGame();
    loadTable();
}
main();