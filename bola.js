class Bola {
    constructor(x, y, raio) {
        this.x = x;
        this.y = y;
        this.raio = raio;

        this.vel = createVector(0, 0);
        this.emMovimento = false;
        this.emRede = false;
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.vel.set(0, 0);
        this.emMovimento = false;
    }

    rematar(forca, alvoX, alvoY) {
        if (alvoY > this.y) {
            alvoY = this.y - 10;
        }
        
        let direcao = createVector(
            alvoX - this.x,
            alvoY - this.y
        );

        direcao.normalize();      // só direção
        direcao.mult(forca);      // aplicar força

        this.vel = direcao;
        this.emMovimento = true;
    }


    atualizar() {
        if (this.emMovimento) {
            this.x += this.vel.x;
            this.y += this.vel.y;
        }
    }

    desenhar() {
        imageMode(CENTER);
        image(imgBola, this.x, this.y, this.raio * 2, this.raio * 2);
    }
}
