const storyData = {
    start: {
        guide: "Nice morning. You've got eighty years if you're lucky. Don't spend them all blinking.",
        title: "The Kitchen Table", year: "2024",
        text: "Your younger brother, Leo, is tugging at your sleeve with a drawing of a 'space-cat.' You have a massive project due in two hours.",
        choices: [
            { text: "Ask Leo about the cat's three tails.", log: "You stopped for Leo's art.", correct: true, next: "morning_commute" },
            { text: "Tell him 'Not now.' Work is priority.", log: "You ignored your brother for work.", correct: false, next: "morning_commute" }
        ]
    },
    morning_commute: {
        guide: "The world is full of people you'll never see twice. Most of them are just as real as you are.",
        title: "The Main Street Bus", year: "2024",
        text: "The bus is crowded. An elderly neighbor is struggling with heavy grocery bags while everyone else stares at their phones.",
        choices: [
            { text: "Offer your seat and help with the bags.", log: "You noticed a neighbor in need.", correct: true, next: "park" },
            { text: "Keep your head down and focus on your notes.", log: "You chose your project over a person.", correct: false, next: "office" }
        ]
    },
    park: {
        guide: "Music is just organized noise, unless you actually hear it. Then it's a bridge to the past.",
        title: "The Scenic Route", year: "2032",
        text: "A street musician is playing your grandmother's favorite song. You're late for a define-your-career lunch date.",
        choices: [
            { text: "Stop and listen for a full three minutes.", log: "You let the music slow time down.", correct: true, next: "soda_shop" },
            { text: "Keep walking. Success waits for no one.", log: "You walked past the music.", correct: false, next: "office" }
        ]
    },
    soda_shop: {
        guide: "Act II. Love. It’s the most creative thing humans do, and usually the most awkward.",
        title: "The Corner Drugstore", year: "2035",
        text: "You're sharing a soda with someone special. They ask if you're planning to stay in Oakhaven or move away for a big promotion.",
        choices: [
            { text: "Be honest: 'I'd rather stay here, near the people I know.'", log: "You chose community over ambition.", correct: true, next: "proposal" },
            { text: "Talk about your five-year career plan.", log: "You talked shop during a date.", correct: false, next: "office" }
        ]
    },
    office: {
        guide: "Efficiency is just a fast-forward button for your life. You're skipping the good parts.",
        title: "The High-Rise Grind", year: "2040",
        text: "You're at the top of your field, but you realize you haven't called your parents in months. There's a crisis at the firm this weekend.",
        choices: [
            { text: "Delegate the work and go visit home.", log: "You put family before the firm.", correct: true, next: "proposal" },
            { text: "Stay and fix the crisis yourself.", log: "You stayed 'busy' instead of calling.", correct: false, next: "regret" }
        ]
    },
    proposal: {
        guide: "Careful. If you keep noticing things, you might accidentally enjoy yourself.",
        title: "The Rainy Porch", year: "2055",
        text: "It's pouring rain. Someone you love is talking about their fears of getting older. The smell of wet pavement is everywhere.",
        choices: [
            { text: "Put the phone away and just hold their hand.", log: "You were present in the rain.", correct: true, next: "the_end" },
            { text: "Tell them not to worry and check the news.", log: "You chose data over emotion.", correct: false, next: "regret" }
        ]
    },
    regret: {
        guide: "The funny thing about 'later' is that eventually, you run out of it. Welcome to the hilltop.",
        title: "The Quiet Room", year: "2070",
        text: "The house is silent. You're looking at Leo's old space-cat drawing, trying to remember the color of the sky that day.",
        choices: [
            { text: "Find beauty in the steam of your tea.", log: "You tried to wake up at the end.", correct: true, next: "the_end" },
            { text: "Sigh and wait for the sun to go down.", log: "You let the light fade out.", correct: false, next: "game_over" }
        ]
    }
};

let vitality = 3;
let currentKey = "start";
let lifeLog = [];
let playerName = "";

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
    
    if (playerName && screenId === 'menu-screen') {
        document.getElementById('switch-btn').classList.remove('hidden');
        document.getElementById('username').classList.add('hidden');
        document.getElementById('welcome-msg').innerText = `Welcome back, ${playerName}.`;
    }
}

function startGame() {
    if (!playerName) {
        const input = document.getElementById("username").value.trim();
        if (!input) return alert("Please enter your name.");
        playerName = input;
    }
    vitality = 3; currentKey = "start"; lifeLog = [];
    document.getElementById('current-user-display').innerText = playerName;
    showScreen('main-game');
    updateGame();
}

function logout() {
    playerName = "";
    document.getElementById("username").value = "";
    document.getElementById("username").classList.remove('hidden');
    document.getElementById('welcome-msg').innerText = "Welcome, Traveler.";
    document.getElementById('switch-btn').classList.add('hidden');
    showScreen('menu-screen');
}

function updateGame() {
    const scene = storyData[currentKey];
    document.getElementById("guide-msg").innerText = `"${scene.guide}"`;
    document.getElementById("title").innerText = scene.title;
    document.getElementById("description").innerText = scene.text;
    document.getElementById("year").innerText = scene.year;
    
    updateHearts();
    const container = document.getElementById("actions");
    container.innerHTML = "";
    
    scene.choices.forEach(c => {
        const b = document.createElement("button");
        b.className = "choice-btn";
        b.innerText = c.text;
        b.onclick = () => transition(c);
        container.appendChild(b);
    });
}

function transition(choice) {
    const shell = document.getElementById("game-shell");
    shell.classList.add("time-jump");
    document.getElementById("stage").classList.add("fade-out");

    setTimeout(() => {
        lifeLog.push(choice.log);
        if (!choice.correct) vitality -= 0.5;
        
        if (vitality <= 0 || choice.next === "game_over") finish("lost");
        else if (choice.next === "the_end") finish("win");
        else {
            currentKey = choice.next;
            updateGame();
        }
        document.getElementById("stage").classList.remove("fade-out");
        shell.classList.remove("time-jump");
    }, 500);
}

function updateHearts() {
    let icons = "";
    for(let i=1; i<=3; i++) {
        if(i <= Math.floor(vitality)) icons += "❤️";
        else if(i - 0.5 === vitality) icons += "💔";
        else icons += "🖤";
    }
    document.getElementById("hearts").innerText = icons;
}

function finish(status) {
    const masterData = JSON.parse(localStorage.getItem('oakhaven_master_db') || "[]");
    masterData.push({
        name: playerName,
        date: new Date().toLocaleDateString(),
        status: status === "win" ? "WOKE UP" : "STAYED ASLEEP",
        log: lifeLog.join(" ➔ ")
    });
    localStorage.setItem('oakhaven_master_db', JSON.stringify(masterData));

    document.getElementById("guide-msg").innerText = status === "win" ? "You finally saw it." : "You missed the show.";
    document.getElementById("stage").innerHTML = `<h2>${status === "win" ? 'Victory' : 'Game Over'}</h2><p>Life summary saved to your history.</p>`;
    document.getElementById("actions").innerHTML = `<button class="choice-btn" onclick="showScreen('menu-screen')">MENU</button>`;
}

function showLeaderboard() {
    if (!playerName) playerName = document.getElementById("username").value.trim();
    if (!playerName) return alert("Enter your name first.");

    const masterData = JSON.parse(localStorage.getItem('oakhaven_master_db') || "[]");
    const list = document.getElementById("leaderboard-list");
    list.innerHTML = "";
    
    const myHistory = masterData.filter(e => e.name === playerName);
    if (!myHistory.length) list.innerHTML = "<p>No records found for " + playerName + ".</p>";
    
    myHistory.reverse().forEach(game => {
        const div = document.createElement("div");
        div.className = "player-group";
        const sClass = game.status === "WOKE UP" ? "status-woke" : "status-asleep";
        div.innerHTML = `<span class="status-tag ${sClass}">${game.status}</span><strong>${game.date}</strong><br><small>${game.log}</small>`;
        list.appendChild(div);
    });
    showScreen('leaderboard-screen');
}
