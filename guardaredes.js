class GuardaRedes {
    constructor() {
        this.largura = 60;
        this.altura = 20;

        this.x = 450;
        this.y = yBarraBaliza + 110;

        this.vel = 1.5;
        this.direcao = 1;

        this.ativo = true;

        this.larguraCorpo = 60;
        this.alturaCorpo = 28;
    }

    atualizar(numRemates) {
        if (!this.ativo) return;
        // Garante que numRemates é um número válido
        let n = (typeof numRemates === 'number' && !isNaN(numRemates)) ? numRemates : 0;        
        
        let velocidadeBase = 1.5 + (n * 0.5);

        // o guarda-redes para por um instante
        if (random(100) < 1) {
            this.vel = 0;
        }

        // Se ele estiver parado (vel == 0)
        else if (this.vel === 0 && random(100) < 10) {
            this.vel = velocidadeBase;
        } 
        //ele mantém a velocidade base normal
        else if (this.vel !== 0) {
            this.vel = velocidadeBase;
        }

        // Aplicar o movimento
        this.x += this.vel * this.direcao;

        // limites dentro da baliza
        if (this.x - this.largura / 2 <= xEsqBaliza) {
            this.direcao = 1;
            this.x = xEsqBaliza + this.largura / 2; 
        }

        if (this.x + this.largura / 2 >= xDirBaliza) {
            this.direcao = -1;
            this.x = xDirBaliza - this.largura / 2;
        }
    }

    desenhar() {
        push();
        translate(this.x, this.y);

        noStroke();

        // ombro esquerdo
        fill(20, 60, 200);
        ellipse(-22, 0, 50, 30);

        // ombro direito
        ellipse(22, 0, 50, 30);

        // corpo
        fill(170, 120, 80);
        ellipse(0, 0, 47, 47);

        pop();
    }


defende(bola) {
    if (
        bola.x + bola.raio > this.x - this.largura / 2 &&
        bola.x - bola.raio < this.x + this.largura / 2 &&
        bola.y + bola.raio > this.y - this.altura / 2 &&
        bola.y - bola.raio < this.y + this.altura / 2
    ) {
        if (bola.resultado === null) {
            //agarrou a bola
            bola.vel.set(0, 0);
            bola.emMovimento = false;
            bola.presa = true;
            //guarda redes para
            this.ativo = false;

            //Falhou o remate
            bola.resultado = "falha";
            remates.push("falha");
            remateAtual++;
            if (somFalha) somFalha.play();
            botaoProximo.show();
        }
    }
}

}
