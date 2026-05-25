const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let stars;
let platforms;
let score = 0;
let scoreText;

// Global audio utilities (WebAudio generated music/effects)
let audioStarted = false;
const audioState = { ctx: null, bgmInterval: null };

function startBgm() {
    if (audioStarted) return;
    audioStarted = true;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    audioState.ctx = ctx;

    const gain = ctx.createGain();
    gain.gain.value = 0.08;
    gain.connect(ctx.destination);

    const melody = [440, 494, 523, 587, 659, 587, 523, 494];
    let idx = 0;

    function playNote(freq, dur = 300) {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = freq;
        g.gain.value = 0.0001;
        o.connect(g);
        g.connect(gain);
        const now = ctx.currentTime;
        g.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
        o.start(now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + dur / 1000);
        o.stop(now + dur / 1000 + 0.02);
    }

    // Loop melody
    playNote(melody[idx]);
    audioState.bgmInterval = setInterval(() => {
        idx = (idx + 1) % melody.length;
        playNote(melody[idx]);
    }, 400);
}

function playBeep() {
    if (!audioStarted) return;
    const ctx = audioState.ctx;
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'square';
    o.frequency.value = 880;
    g.gain.value = 0.0001;
    o.connect(g);
    g.connect(ctx.destination);
    const now = ctx.currentTime;
    g.gain.exponentialRampToValueAtTime(0.12, now + 0.001);
    o.start(now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    o.stop(now + 0.13);
}

function preload() {
    this.load.image('sky', 'assets/sky.svg');
    this.load.image('ground', 'assets/platform.svg');
    this.load.image('star', 'assets/star.svg');
    this.load.image('player', 'assets/player.png');
}

function create() {
    // Background
    this.add.image(400, 300, 'sky');
    
    // Platforms
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
    
    // Player (single image, no spritesheet)
    player = this.physics.add.sprite(100, 450, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    

    // Prompt user to start audio (most browsers require user gesture)
    const playText = this.add.text(400, 30, 'Klik layar untuk memulai musik', { fontSize: '18px', fill: '#000' }).setOrigin(0.5);
    this.input.once('pointerdown', () => {
        startBgm();
        playText.setVisible(false);
    });
    
    // Stars
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    
    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    
    // Score
    scoreText = this.add.text(16, 16, 'Score: 0', 
        { fontSize: '32px', fill: '#000' }
    );
    
    // Colliders
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
}

function update() {
    const cursors = this.input.keyboard.createCursorKeys();
    
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);
    }
    else {
        player.setVelocityX(0);
    }
    
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
    try { playBeep(); } catch (e) { }
    
    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });
    }
}