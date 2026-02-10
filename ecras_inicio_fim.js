class GestorEcras {
  constructor() {
    //jogar
    this.botaoJogar = createButton("JOGAR");
    this.botaoJogar.position(width / 2 - 100, height / 2 + 150);
    this.botaoJogar.size(200, 80);
    this.botaoJogar.style("background-color", "#07631b");
    this.botaoJogar.style("color", "white");
    this.botaoJogar.style("font-weight", "bold");
    this.botaoJogar.style("font-size", "20px");
    this.botaoJogar.style("border-radius", "15px");
    this.botaoJogar.style("border-color", "white");

    this.botaoJogar.hide();

    //reniciar
    this.botaoReiniciar = createButton("Voltar a Jogar!");
    this.botaoReiniciar.position(width / 2 - 100, height / 2 + 130);
    this.botaoReiniciar.size(200, 60);
    this.botaoReiniciar.style("background-color", "#1c7731");
    this.botaoReiniciar.style("color", "white");
    this.botaoReiniciar.style("font-weight", "bold");
    this.botaoReiniciar.style("border-radius", "15px");
    this.botaoReiniciar.style("font-size", "20px");
    this.botaoReiniciar.style("border-color", "white");
    this.botaoReiniciar.style("cursor", "pointer");
    this.botaoReiniciar.hide(); 
  }
    
  esconderBotoes() {
    this.botaoJogar.hide();
    this.botaoReiniciar.hide();
  }

  //Ecrã inicial
  exibirMenu() {
    push();
    noStroke();
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(75);
    textStyle(BOLD);
    text("PENALTY SHOW", width / 2, height / 2 - 50);

    fill(7, 60, 99);
    textSize(25);
    textStyle(BOLD);
    text("REGRAS:", width / 2, height / 2 + 25);  

    textSize(20);
    fill(255);
    textStyle(NORMAL);
    text("Marca 3 golos e ganha o desafio!", width / 2, height / 2 + 55);
    text("Usa a voz para disparar a bola e o rato para fazer pontaria.",width / 2, height / 2 + 80);
    text("Sê rápido: tens apenas 5 segundos para rematar em cada tentativa!",width / 2, height / 2 + 105);
    
    pop();
  }

  //Ecrã Final
  exibirEcraFinal(vitoria, golos, falhas) {
    push();
    background(0, 200);
    noStroke();
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    if (vitoria) {
      fill(0, 255, 0);
      textSize(70);
      text("GANHOU!", width / 2, height / 2 - 50);
    } else {
      fill(255, 0, 0);
      textSize(70);
      text("PERDEU!", width / 2, height / 2 - 50);
    }
      textSize(30);
      fill(255);
      text(golos + " Golos - " + falhas + " Falhas", width / 2, height / 2 + 45);
      pop();
  }
}