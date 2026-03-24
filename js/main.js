/* =============================================
   PORTFÓLIO - RODRIGO OLIVEIRA
   Arquivo JavaScript principal

   Este arquivo controla todas as interações
   dinâmicas do portfólio:

   1. Navegação mobile (hamburger menu)
   2. Header com fundo ao rolar
   3. Efeito de digitação no hero
   4. Animações ao rolar (IntersectionObserver)
   5. Barras de progresso animadas
   6. Botão "voltar ao topo"
   7. Links de navegação suaves
   ============================================= */


// Espera o DOM carregar completamente antes de executar
document.addEventListener('DOMContentLoaded', () => {

  /* =============================================
     1. NAVEGAÇÃO MOBILE
     Abre e fecha o menu hamburger
     ============================================= */

  // Busca os elementos do menu
  const navToggle = document.getElementById('nav-toggle');   // Botão hamburger
  const navClose = document.getElementById('nav-close');     // Botão fechar (X)
  const navMenu = document.getElementById('nav-menu');       // Container do menu
  const navLinks = document.querySelectorAll('.nav__link');   // Todos os links do menu

  /**
   * Abre o menu mobile
   * Adiciona a classe que move o menu para dentro da tela
   */
  function abrirMenu() {
    navMenu.classList.add('nav__menu--open');
  }

  /**
   * Fecha o menu mobile
   * Remove a classe, fazendo o menu deslizar para fora
   */
  function fecharMenu() {
    navMenu.classList.remove('nav__menu--open');
  }

  // Evento: clicar no hamburger abre o menu
  navToggle.addEventListener('click', abrirMenu);

  // Evento: clicar no X fecha o menu
  navClose.addEventListener('click', fecharMenu);

  // Evento: clicar em qualquer link do menu também fecha
  // (importante para uma boa experiência mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', fecharMenu);
  });


  /* =============================================
     2. HEADER COM FUNDO AO ROLAR
     Adiciona fundo escuro quando o usuário rola
     a página para baixo
     ============================================= */

  const header = document.getElementById('header');

  /**
   * Verifica a posição do scroll e atualiza o header
   * Se rolou mais de 50px, adiciona o fundo
   */
  function atualizarHeader() {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  // Escuta o evento de scroll da página
  window.addEventListener('scroll', atualizarHeader);

  // Executa uma vez ao carregar (caso a página já esteja rolada)
  atualizarHeader();


  /* =============================================
     3. EFEITO DE DIGITAÇÃO (TYPING EFFECT)
     Simula alguém digitando e apagando textos
     ============================================= */

  // Lista de textos que serão "digitados"
  const textosParaDigitar = [
    'Técnico de Telecomunicações',
    'Desenvolvedor em Formação',
    'Equipe V - Atendimento VIP',
    'Estudante de ADS - Estácio',
    'Especialista em Fibra Óptica'
  ];

  const elementoDigitacao = document.getElementById('typing-text');

  let indiceTexto = 0;    // Qual texto da lista estamos digitando
  let indiceCaractere = 0; // Em qual caractere estamos
  let estaApagando = false; // Se está no modo de apagar

  // Velocidades da animação (em milissegundos)
  const velocidadeDigitar = 80;    // Tempo entre cada letra ao digitar
  const velocidadeApagar = 40;     // Tempo entre cada letra ao apagar
  const pausaEntreTextos = 2000;   // Pausa depois de terminar de digitar
  const pausaAntesDeDigitar = 500; // Pausa antes de começar a digitar o próximo

  /**
   * Função principal do efeito de digitação
   * Funciona em loop: digita -> pausa -> apaga -> próximo texto
   */
  function digitar() {
    // Pega o texto atual da lista
    const textoAtual = textosParaDigitar[indiceTexto];

    if (!estaApagando) {
      // MODO DIGITAÇÃO: adiciona uma letra por vez
      elementoDigitacao.textContent = textoAtual.substring(0, indiceCaractere + 1);
      indiceCaractere++;

      // Se terminou de digitar todo o texto
      if (indiceCaractere === textoAtual.length) {
        estaApagando = true;
        // Pausa antes de começar a apagar
        setTimeout(digitar, pausaEntreTextos);
        return;
      }

      // Agenda a próxima letra
      setTimeout(digitar, velocidadeDigitar);

    } else {
      // MODO APAGAR: remove uma letra por vez
      elementoDigitacao.textContent = textoAtual.substring(0, indiceCaractere - 1);
      indiceCaractere--;

      // Se apagou tudo
      if (indiceCaractere === 0) {
        estaApagando = false;
        // Avança para o próximo texto (volta ao início se chegou no final)
        indiceTexto = (indiceTexto + 1) % textosParaDigitar.length;
        // Pausa antes de digitar o próximo
        setTimeout(digitar, pausaAntesDeDigitar);
        return;
      }

      // Agenda a remoção da próxima letra
      setTimeout(digitar, velocidadeApagar);
    }
  }

  // Inicia o efeito de digitação após 1 segundo
  setTimeout(digitar, 1000);


  /* =============================================
     4. ANIMAÇÕES AO ROLAR (SCROLL REVEAL)
     Usa IntersectionObserver para detectar quando
     elementos entram na tela e anima-los
     ============================================= */

  // Seleciona todos os elementos com a classe 'reveal'
  const elementosReveal = document.querySelectorAll('.reveal');

  /**
   * IntersectionObserver: API moderna do navegador que
   * observa quando elementos entram ou saem da viewport
   * (a área visível da tela)
   *
   * É muito mais eficiente que usar scroll events!
   */
  const observerReveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Se o elemento está visível na tela
      if (entry.isIntersecting) {
        // Adiciona a classe que ativa a animação
        entry.target.classList.add('reveal--active');
        // Para de observar (a animação só acontece uma vez)
        observerReveal.unobserve(entry.target);
      }
    });
  }, {
    // Configurações do observer
    threshold: 0.1,   // Ativa quando 10% do elemento está visível
    rootMargin: '0px 0px -50px 0px'  // Margem inferior de -50px (ativa um pouco antes)
  });

  // Registra cada elemento para ser observado
  elementosReveal.forEach(elemento => {
    observerReveal.observe(elemento);
  });


  /* =============================================
     5. BARRAS DE PROGRESSO ANIMADAS
     Anima as barras de habilidades quando entram
     na tela
     ============================================= */

  // Seleciona todas as barras de progresso
  const barrasProgresso = document.querySelectorAll('.skill-card__progress');

  /**
   * Observer separado para as barras de progresso
   * Quando a barra entra na viewport, define sua largura
   * baseada no atributo data-width
   */
  const observerBarras = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Pega o valor de data-width do HTML (ex: data-width="75")
        const largura = entry.target.getAttribute('data-width');
        // Define a largura via CSS (a transição no CSS faz a animação)
        entry.target.style.width = largura + '%';
        // Para de observar
        observerBarras.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5  // Ativa quando 50% da barra está visível
  });

  // Registra cada barra para ser observada
  barrasProgresso.forEach(barra => {
    observerBarras.observe(barra);
  });


  /* =============================================
     6. BOTÃO "VOLTAR AO TOPO"
     Aparece quando o usuário rola para baixo
     e volta ao topo ao clicar
     ============================================= */

  const botaoTopo = document.getElementById('scroll-top');

  /**
   * Mostra ou esconde o botão baseado na posição do scroll
   */
  function atualizarBotaoTopo() {
    if (window.scrollY > 500) {
      botaoTopo.classList.add('scroll-top--visible');
    } else {
      botaoTopo.classList.remove('scroll-top--visible');
    }
  }

  // Escuta o scroll para atualizar o botão
  window.addEventListener('scroll', atualizarBotaoTopo);

  // Evento de clique: volta ao topo suavemente
  botaoTopo.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  /* =============================================
     7. NAVEGAÇÃO SUAVE E LINK ATIVO
     Destaca o link do menu correspondente à
     seção visível na tela
     ============================================= */

  // Todas as seções que correspondem aos links do menu
  const secoes = document.querySelectorAll('section[id]');

  /**
   * Observer para detectar qual seção está visível
   * e destacar o link correspondente no menu
   */
  const observerSecoes = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Pega o ID da seção visível
        const idSecao = entry.target.getAttribute('id');

        // Remove destaque de todos os links
        navLinks.forEach(link => {
          link.style.color = '';
        });

        // Adiciona destaque ao link da seção visível
        const linkAtivo = document.querySelector(`.nav__link[href="#${idSecao}"]`);
        if (linkAtivo) {
          linkAtivo.style.color = 'var(--cor-accent)';
        }
      }
    });
  }, {
    threshold: 0.3,  // A seção precisa ter 30% visível
    rootMargin: '-20% 0px -50% 0px'  // Foco na parte central da tela
  });

  // Registra cada seção para ser observada
  secoes.forEach(secao => {
    observerSecoes.observe(secao);
  });


  /* =============================================
     LOG DE BOAS-VINDAS NO CONSOLE
     Um toque de personalidade para quem inspecionar
     o código
     ============================================= */
  console.log(
    '%c Olá, dev curioso! 👋 ',
    'background: #00d4ff; color: #0a0a0a; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
  );
  console.log(
    '%c Este portfólio foi construído com 💙 por Rodrigo Oliveira ',
    'color: #888; font-size: 12px;'
  );
  console.log(
    '%c github.com/RodrigolsilvaO ',
    'color: #00d4ff; font-size: 12px;'
  );

}); // Fim do DOMContentLoaded
