class Regras {
    constructor() {
    }

    //Verificação do remate
    verificarGolo(bola, xEsq, xDir, yBarra, yFundo, somGolo, somFalha, botaoProximo) {
        // Se o remate já tem resultado, não faz mais nada
        if (bola.resultado !== null) return null;

        // Verifica se o centro da bola passou a linha de fundo entre os postes
        if (bola.y <= yFundo - 55) {
            if (bola.x > xEsq && bola.x < xDir) {
                bola.vel.set(0, 0);
                bola.emMovimento = false;
                bola.resultado = "golo";
                
                if (somGolo) somGolo.play();
                botaoProximo.show();
                return "golo"; 
            }
        }

        //bola sai pelas laterais
        if (bola.y < yBarra - 20 || bola.x < 0 || bola.x > width) {
            bola.emMovimento = false;
            bola.resultado = "falha";
            
            if (somFalha) somFalha.play();
            botaoProximo.show();
            return "falha";
        }

        //colisão com postes laterais rebate
        if (bola.x - bola.raio <= xEsq && bola.x > xEsq - 20 && bola.y < yFundo) {
            bola.vel.x *= -1; 
            bola.x = xEsq + bola.raio + 1;
        }
        if (bola.x + bola.raio >= xDir && bola.x < xDir + 20 && bola.y < yFundo) {
            bola.vel.x *= -1;
            bola.x = xDir - bola.raio - 1;
        }

        return null; 
    }

    // condição de ganahr ou perder
    verificarFimDoJogo(remates) {
        // filtra o array de resultados
        let golos = remates.filter(r => r === "golo").length;
        let falhas = remates.filter(r => r === "falha").length;

        //ganhou
        if (golos >= 3) return { terminado: true, vitoria: true, g: golos, f: falhas };
        //perdeu
        if (falhas >= 3) return { terminado: true, vitoria: false, g: golos, f: falhas };
        
        return { terminado: false };
    }

    //remate áudio e tempo
    processarRemate(mic, bola, tempoInicial, tempoLimite, somFalha, botaoProximo) {
        //Bloqueia remate se o jogo terminou ou a bola já estiver a andar
        if (!jogoAtivo || !mic || bola.emMovimento || !podeRematar || jogoTerminado) return;

        //temporizador
        let tempoPassado = (millis() - tempoInicial) / 1000;
        let contagemDecrescente = max(0, tempoLimite - tempoPassado);

        // Desenhar o cronómetro
        push();
        noStroke();
        textSize(25); 
        textStyle(BOLD);
        fill(contagemDecrescente < 2 ? "red" : 255);
        textAlign(LEFT);
        text("⏱ " + nf(contagemDecrescente, 1, 1) + "s", 20, 130);
        pop();

        //Se o tempo acabou
        if (contagemDecrescente <= 0) {
            bola.resultado = "falha";
            podeRematar = false;
            if (somFalha) somFalha.play();
            botaoProximo.show();
            return "tempo_esgotado";
        }

        //Deteta som para rematar
        let nivelSom = mic.getLevel();
        if (nivelSom > 0.070) {
            let forca = map(nivelSom, 0.070, 0.30, 5, 20);
            forca = constrain(forca, 5, 20);
            bola.rematar(forca, mouseX, mouseY);
            podeRematar = false;
            return "rematou";
        }

        return null;
    }

}