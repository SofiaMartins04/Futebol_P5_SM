let bola;
let imgBola;
let mic;

let bolaBaseX;
let bolaBaseY;
let jogoAtivo = false;

let podeRematar = true;
let golos = 0;
let goloMarcado = false;

function preload() {
    imgBola = loadImage("img/bola.png");
}

function setup() {
    createCanvas(900, 500);

    // frente da baliza
    let yLinhaGrandeArea = 40;
    let yTopoBaliza = yLinhaGrandeArea - 25;
    let yFrenteBaliza = yTopoBaliza + 80;

    bolaBaseX = width / 2;
    bolaBaseY = yFrenteBaliza + 280 + 65;

    bola = new Bola(bolaBaseX, bolaBaseY, 20);

}

function draw() {
    background(60, 170, 60);

    desenharCampo();
    desenharBaliza();
    desenharRedeBaliza();

    // atualizar primeiro
    bola.atualizar();

    if (bola.emMovimento) {
        verificarGolo();
    }

    // desenhar depois
    bola.desenhar();

    if (jogoAtivo && mic && !bola.emMovimento) {
        let nivelSom = mic.getLevel();

        if (nivelSom > 0.070) {
            let forca = map(nivelSom, 0.070, 0.20, 5, 10);
            forca = constrain(forca, 5, 10);

            bola.rematar(forca, mouseX, mouseY);
            podeRematar = false;
        }
    }
    // desbloqueia quando a bola parar
    if (!bola.emMovimento) {
        podeRematar = true;
    }
    
    fill(20);
    textSize(30);
    text("som: " + nf(mic ? mic.getLevel() : 0, 1, 3), 20, 30);

    fill(20);
    textSize(30);
    text("Golos: " + golos, 20, 70);

}


// Campo
function desenharCampo() {
    background(60, 170, 60); // relva

    stroke(255);
    strokeWeight(3);
    noFill();

    // linhas exteriores
    rect(0, 95, width , height);
}

// Baliza
function desenharBaliza() {
    stroke(255);
    strokeWeight(3);
    noFill();

    let centroX = width / 2;

    let yLinhaGrandeArea = 40;
    let yTopoBaliza = yLinhaGrandeArea - 25;
    let yFrenteBaliza = yTopoBaliza + 80;

    // Grande área começa exatamente na frente da baliza
    rect(
        centroX - 630 / 2,
        yFrenteBaliza,
        630,
        280
    );
}


function desenharRedeBaliza() {
    let centroX = width / 2;

    let xEsq = centroX - 360 / 2;
    let xDir = centroX + 360 / 2;

    let yLinhaGrandeArea = 40;
    let yTopo = yLinhaGrandeArea - 25;
    let yFundo = yTopo + 80;

    push();

    // limitar desenho à área da baliza
    clip(() => {
        rect(xEsq, yTopo, 360, 80);
    });

    stroke(255, 180);
    strokeWeight(1);

    let espacamento = 18;

    // diagonais ↘
    for (let x = xEsq - 100; x < xDir + 100; x += espacamento) {
        line(x, yTopo, x + 120, yFundo);
    }

    // diagonais ↗
    for (let x = xEsq - 100; x < xDir + 100; x += espacamento) {
        line(x, yFundo, x + 120, yTopo);
    }

    pop();

    // postes e barra (à frente da rede)
    stroke(255);
    strokeWeight(3);
    noFill();

    line(xEsq, yTopo, xDir, yTopo);     // barra
    line(xEsq, yTopo, xEsq, yFundo);    // poste esquerdo
    line(xDir, yTopo, xDir, yFundo);    // poste direito

}

function verificarGolo() {
    let centroX = width / 2;
    let xEsq = centroX - 360 / 2;
    let xDir = centroX + 360 / 2;

    let yLinhaGrandeArea = 40;
    let yTopo = yLinhaGrandeArea - 25;

    if (
        !goloMarcado &&
        bola.x - bola.raio > xEsq &&
        bola.x + bola.raio < xDir &&
        bola.y - bola.raio <= yTopo
    ) {
        golos++;
        goloMarcado = true;

        // fixa a bola NA LINHA
        bola.y = yTopo + bola.raio;
        bola.vel.set(0, 0);
        bola.emMovimento = false;
    }
}



function mousePressed() {
    if (!jogoAtivo) {
        userStartAudio();
        mic = new p5.AudioIn();
        mic.start();
        jogoAtivo = true;
    }
}




