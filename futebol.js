let bola;
let guardaRedes;
let ecras_inicio_fim;
let regras;
let imgBola;
let mic;

//Bola
let bolaBaseX;
let bolaBaseY;

//Controlo estado do jogo
let jogoAtivo = false;
let podeRematar = true;
let golos = 0;
let goloMarcado = false;

//Baliza
let xEsqBaliza, xDirBaliza;
let yBarraBaliza, yFundoBaliza;
let larguraBaliza = 360;
let alturaBaliza = 80;
let distanciaRemate = 360;

//Pontuação
let totalRemates = 5;
let remates = [];
let remateAtual = 0;

let botaoJogar;
let botaoProximo;
let jogoTerminado = false;
let botaoReiniciar;

//tempo
let tempoInicial;
let tempoLimite = 5;
let vitoria = false;

let estadoJogo = "Menu";
let signatureImage;

let somGolo;
let somFalha;

function preload() {
    imgBola = loadImage("img/bola.png");
    somGolo = loadSound("audio/golo.mp3");
    somFalha = loadSound("audio/falhou.mp3");
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

    // Posição inicial bola
    bolaBaseX = centroX;
    bolaBaseY = yFundoBaliza + distanciaRemate;

    //inicia objetos
    bola = new Bola(bolaBaseX, bolaBaseY, 20);
    guardaRedes = new GuardaRedes();
    ecras_inicio_fim = new GestorEcras(); 
    regras = new Regras();

    tempoInicial = millis(); // Inicia o temporizador

    botaoProximo = createButton("Próximo remate");
    botaoProximo.position(width / 2 - 80, height / 2 + 50);
    botaoProximo.size(200, 60);
    
    botaoProximo.style("background-color", "#0d2694");
    botaoProximo.style("color", "white");
    botaoProximo.style("font-weight", "bold");
    botaoProximo.style("font-size", "20px");
    botaoProximo.style("border-radius", "10px");
    botaoProximo.style("border-color", "white");
    botaoProximo.style("cursor", "pointer");
    botaoProximo.hide();


    botaoProximo.mousePressed(() => {
        if (somGolo.isPlaying()) somGolo.stop();
        if (somFalha.isPlaying()) somFalha.stop();
        prepararNovoRemate();
        tempoInicial = millis(); // Reinicia o temporizador para o próximo remate
    });

    ecras_inicio_fim.botaoReiniciar.mousePressed(() => {
        reiniciarJogoTotal();
    });
    
    ecras_inicio_fim.botaoJogar.mousePressed(() => {
        iniciarJogo();
    });

    ecras_inicio_fim.botaoJogar.show();
}

function reiniciarJogoTotal() {
    somGolo.stop();
    somFalha.stop();
    
    golos = 0;
    remateAtual = 0;
    remates = [];
    jogoTerminado = false;
    vitoria = false;
    ecras_inicio_fim.botaoReiniciar.hide();
    prepararNovoRemate();
    loop();
}


function draw() {
    background(60, 170, 60);

    desenharCampo();
    desenharBaliza();
    desenharRedeBaliza();

    if(estadoJogo === "Menu") {
        ecras_inicio_fim.exibirMenu(); 
    }else if(estadoJogo === "Jogo") {
        executarJogo();
        drawSignature();
    }
}

// Campo
function desenharCampo() {
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

function desenharTabelaRemates() {
    let x = 20;
    let y = 45;
    let tamanho = 35;
    let espaco = 10;

    push();
    textSize(20);
    fill(255);
    noStroke();
    textStyle(BOLD);
    text("REMATES:", x, y - 12);

    for (let i = 0; i < totalRemates; i++) {
        stroke(255);
        strokeWeight(2);
        noFill();
        rect(x + i * (tamanho + espaco), y, tamanho, tamanho, 5); 

        //Se for GOLO
        if (remates[i] === "golo") {
            imageMode(CORNER);
            image(imgBola, x + i * (tamanho + espaco) + 4, y + 4, tamanho - 8, tamanho - 8);
        } 

        //Se for FALHA
        else if (remates[i] === "falha") {
            fill(255, 50, 50);
            noStroke();
            textSize(28);
            textAlign(CENTER, CENTER);
            text("✕", x + i * (tamanho + espaco) + tamanho/2, y + tamanho/2 + 2);
        }
    }
    pop(); 
}

//remates
function resetRemate() {
    bola.reset(bolaBaseX, bolaBaseY);
    bola.presa = false;

    guardaRedes.ativo = true;
    guardaRedes.x = width / 2;

    podeRematar = true;
    goloMarcado = false;
}

function prepararNovoRemate() {
    if (remateAtual >= totalRemates) return;

    bola.reset(bolaBaseX, bolaBaseY);
    bola.presa = false;
    bola.resultado = null;

    guardaRedes.ativo = true;
    guardaRedes.x = width / 2;

    podeRematar = true;
    botaoProximo.hide();

    tempoInicial = millis(); // Reinicia o temporizador para o próximo remate
}


function iniciarJogo() {
    estadoJogo = "Jogo";
    ecras_inicio_fim.botaoJogar.hide();
    tempoInicial = millis(); // O cronómetro só começa quando clicas em jogar
    
    // Ativa o áudio quando o utilizador clica no botão (exigência do browser)
    userStartAudio();
    mic = new p5.AudioIn();
    mic.start();
    jogoAtivo = true;
}

function executarJogo() {
    // Guarda-redes com dificuldade e aleatoriedade
    guardaRedes.atualizar(remateAtual);
    guardaRedes.desenhar();
    bola.atualizar(guardaRedes);

    //verifica colisões e golos
    if (bola.emMovimento) {
        guardaRedes.defende(bola);

        // Pede à classe Regras para verificar o que aconteceu
        let resultado = regras.verificarGolo(bola, xEsqBaliza, xDirBaliza, yBarraBaliza, yFundoBaliza, somGolo, somFalha, botaoProximo);

        if (resultado) {
            if (resultado === "golo") golos++;
            remates.push(resultado);
            remateAtual++;
        }
    }

    bola.desenhar();

    //entrada de áudio do mic
    let acaoRemate = regras.processarRemate(mic, bola, tempoInicial, tempoLimite, somFalha, botaoProximo);
    
    if (acaoRemate === "tempo_esgotado") {
        remates.push("falha");
        remateAtual++;
    }

    desenharTabelaRemates();

    // Lógica de Fim de Jogo
    let status = regras.verificarFimDoJogo(remates);
        if (status.terminado) {
            jogoTerminado = true;
            vitoria = status.vitoria;

            ecras_inicio_fim.exibirEcraFinal(vitoria, status.g, status.f);
            botaoProximo.hide();
            ecras_inicio_fim.botaoReiniciar.show();
            noLoop();
        }
}

function drawSignature() {

    push();

    fill(255);
    noStroke();
    textStyle(BOLD);
    textSize(18);
    textAlign(RIGHT, CENTER);
    text("Sofia Martins Nª28849 ECGM", width - 10 , 20);

    textAlign(LEFT, BOTTOM);
    noStroke();
    textSize(24);
    fill(255);
    text("Football - Shots", 20, height - 20);
    
    pop();
}

// ativar som
function mousePressed() {
    if (!jogoAtivo) {
        userStartAudio();
        mic = new p5.AudioIn();
        mic.start();
        jogoAtivo = true;
    }
    if (bola.presa) {
        resetRemate();
    }
}