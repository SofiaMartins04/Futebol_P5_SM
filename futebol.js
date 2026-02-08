let bola;
let imgBola;
let mic;

// bola
let bolaBaseX;
let bolaBaseY;

//estado do jogo
let jogoAtivo = false;
let podeRematar = true;

// Contador de golos e controlo de golo por remate
let golos = 0;
let goloMarcado = false;

// Baliza
let xEsqBaliza, xDirBaliza;
let yBarraBaliza, yFundoBaliza;
let larguraBaliza = 360;
let alturaBaliza = 80;

let distanciaRemate = 360;

function preload() {
    imgBola = loadImage("img/bola.png");
}

function setup() {
    createCanvas(900, 500);

    // Posição da baliza 
    let centroX = width / 2;
    xEsqBaliza = centroX - larguraBaliza / 2;
    xDirBaliza = centroX + larguraBaliza / 2;

    let yLinhaGrandeArea = 40;
    yBarraBaliza = yLinhaGrandeArea - 25;
    yFundoBaliza = yBarraBaliza + alturaBaliza;

    // Posição inicial da bola
    bolaBaseX = centroX;
    bolaBaseY = yFundoBaliza + distanciaRemate;

    bola = new Bola(bolaBaseX, bolaBaseY, 20);
}

function draw() {
    background(60, 170, 60);

    desenharCampo();
    desenharBaliza();
    desenharRedeBaliza();

    // atualiza a posicao da bola
    bola.atualizar();

    if (bola.emMovimento) {
        verificarGolo();
    }

    bola.desenhar();

    // Remate com som
    if (jogoAtivo && mic && !bola.emMovimento) {
        let nivelSom = mic.getLevel();

        if (nivelSom > 0.070) {
            let forca = map(nivelSom, 0.070, 0.20, 5, 10);
            forca = constrain(forca, 5, 10);

            bola.rematar(forca, mouseX, mouseY);
            podeRematar = false;
        }
    }

    // reset para novo remate
    if (!bola.emMovimento) {
        podeRematar = true;
        goloMarcado = false;
    }

    fill(20);
    textSize(30);
    text("Som: " + nf(mic ? mic.getLevel() : 0, 1, 3), 20, 30);
    text("Golos: " + golos, 20, 70);
}

// Campo
function desenharCampo() {
    background(60, 170, 60); // relva

    stroke(255);
    strokeWeight(3);
    noFill();

    // linhas exteriores do campo
    rect(0, 95, width, height);

    // Grande area
    let centroX = width / 2;

    let yLinhaGrandeArea = 40;
    let yTopoBaliza = yLinhaGrandeArea - 25;
    let yFrenteBaliza = yTopoBaliza + 80;

    rect(
        centroX - 630 / 2,
        yFrenteBaliza,
        630,
        280
    );
}

// Baliza -- usa a geometria global
function desenharBaliza() {
    stroke(255);
    strokeWeight(3);
    noFill();

    // barra
    line(xEsqBaliza, yBarraBaliza, xDirBaliza, yBarraBaliza);

    // postes
    line(xEsqBaliza, yBarraBaliza, xEsqBaliza, yFundoBaliza);
    line(xDirBaliza, yBarraBaliza, xDirBaliza, yFundoBaliza);
}

function desenharRedeBaliza() {
    push();
    clip(() => rect(xEsqBaliza, yBarraBaliza, larguraBaliza, alturaBaliza));

    stroke(255, 180);
    strokeWeight(1);

    let espacamento = 18;
    for (let x = xEsqBaliza - 100; x < xDirBaliza + 100; x += espacamento) {
        line(x, yBarraBaliza, x + 120, yFundoBaliza);
        line(x, yFundoBaliza, x + 120, yBarraBaliza);
    }

    pop();
}

// Golo e colisões
function verificarGolo() {

    // Barra "prende" a bola sempre
    if (
        bola.x - bola.raio > xEsqBaliza &&
        bola.x + bola.raio < xDirBaliza &&
        bola.y - bola.raio <= yBarraBaliza
    ) {
        if (!goloMarcado) {
            golos++;
            goloMarcado = true;
        }

        // Interrompe o movimento da bola
        bola.y = yBarraBaliza + bola.raio;
        bola.vel.set(0, 0);
        bola.emMovimento = false;
        return;
    }

    // Poste esquerdo
    if (
        bola.y - bola.raio > yBarraBaliza &&
        bola.y + bola.raio < yFundoBaliza &&
        bola.x - bola.raio <= xEsqBaliza &&
        bola.x > xEsqBaliza
    ) {
        if (!goloMarcado) {
            golos++;
            goloMarcado = true;
        }

        //rebate bola
        bola.vel.x *= -1;
        bola.x = xEsqBaliza + bola.raio + 1;
    }

    // Poste direito
    if (
        bola.y - bola.raio > yBarraBaliza &&
        bola.y + bola.raio < yFundoBaliza &&
        bola.x + bola.raio >= xDirBaliza &&
        bola.x < xDirBaliza
    ) {
        if (!goloMarcado) {
            golos++;
            goloMarcado = true;
        }

        //rebate bola
        bola.vel.x *= -1;
        bola.x = xDirBaliza - bola.raio - 1;
    }
}

// som
function mousePressed() {
    if (!jogoAtivo) {
        userStartAudio();
        mic = new p5.AudioIn();
        mic.start();
        jogoAtivo = true;
    }
}
