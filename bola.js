class Bola {
    constructor(x, y, raio) {
        this.x = x;
        this.y = y;
        this.raio = raio;

         this.resultado = null; // "golo" | "falha" | null

        // vetor de velocidade
        this.vel = createVector(0, 0);
        this.emMovimento = false;
        this.emRede = false;

        this.presa = false;
    }

    // bola denovo no sitio inicial
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.vel.set(0, 0);
        this.emMovimento = false;
    }

    // Aplica força e direção ao remate
    rematar(forca, alvoX, alvoY) {
        if (alvoY > this.y) {
            alvoY = this.y - 10;
        }
        
        //cria vetor de direção
        let direcao = createVector(
            alvoX - this.x,
            alvoY - this.y
        );

        direcao.normalize();      // só direção
        direcao.mult(forca);      // aplicar força

        this.vel = direcao;
        this.emMovimento = true;
    }

    atualizar(guardaRedes) {
        if (this.presa && guardaRedes) {
            // bola colada ao guarda-redes
            this.x = guardaRedes.x;
            this.y = guardaRedes.y+30; 
            return;
        }
        
        if (this.emMovimento) {
            this.x += this.vel.x;
            this.y += this.vel.y;

            // Verifica se a bola saiu completamente das margens do canvas
            if (this.x < -this.raio || this.x > width + this.raio|| this.y < - this.raio || this.y > height + this.raio) {
                if (this.resultado === null) {
                this.resultado = "falha";
                remates.push("falha");
                remateAtual++;
                botaoProximo.show();

                this.emMovimento = false; 
                this.vel.set(0, 0);
            }
        }
        
        }
    }

    //desenha bola
    desenhar() {
        imageMode(CENTER);
        image(imgBola, this.x, this.y, this.raio * 2, this.raio * 2);
    }
}
