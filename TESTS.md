# Verificação — 22/10/2026

## Resultado

**65 verificações automatizadas aprovadas no modo normal e 66 no modo de movimento reduzido**, executadas no Chrome headless local com perfil temporário exclusivo. Revisão visual de capturas em 390 × 844 e 1440 × 1100, incluindo abertura, galeria, serviços e contato no celular.

Cobertura:

- JavaScript inicializado sem falha de carregamento ou sintaxe que impeça os componentes.
- Um único h1 e idioma `pt-BR`.
- Todas as âncoras internas apontam para IDs existentes.
- Links em nova aba com `noopener noreferrer`.
- Todos os CTAs de WhatsApp usam o telefone oficial `5511954281006` e mensagem preenchida.
- Fotografias carregadas, alternativas descritivas e créditos de ilustração.
- HTTP 200 para página, CSS, JS, créditos, favicon, robots e sitemap locais.
- Ausência de overflow horizontal e título do hero dentro da tela em **320, 360, 375, 390, 430, 540, 768, 800, 801, 1024, 1440 e 1920 px**.
- Menu abre/fecha, estado ARIA, Escape, retorno de foco e fechamento ao selecionar link.
- Filtros cozinha, estar, quarto e todos, incluindo atualização de `aria-pressed`.
- Ampliação com imagem correta, fechamento e retorno de foco.
- FAQ abre e fecha.
- CSS com respeito a `prefers-reduced-motion`.
- Metadados e proteção `noindex` da demonstração.

## Reprodução

1. Sirva a raiz do projeto em `http://127.0.0.1:4173/` usando um servidor estático.
2. Abra `/tests/browser.html` para rodar as verificações no navegador. O resultado aparece em JSON no topo.
3. Para a coleta automatizada em Windows, abra Chrome headless com perfil temporário próprio e porta DevTools `9222`, então execute `powershell -NoProfile -File tests/run-browser.ps1`. O script usa o protocolo DevTools, gera o relatório e capturas em `test-results/`, que não é versionada.

Sem frameworks nem dependências: não existe etapa de build. A validação foi feita sobre os arquivos que serão servidos diretamente.

O parser local do Prettier 3.6.2 validou e formatou HTML e CSS. A ferramenta foi baixada apenas para uso temporário de desenvolvimento, em pasta ignorada pelo Git; não faz parte do site ou de suas dependências.

## Limites

- Não foi enviada mensagem real pelo WhatsApp nem e-mail de teste. A estrutura de todos os links e o número foram conferidos; não se atribui entrega de mensagem ou titularidade de uma sessão WhatsApp que não foi acessada.
- Mapa é uma busca textual. A divergência de endereço nas fontes está documentada, sem coordenadas inventadas.
- Redes externas podem exigir login e ter políticas próprias. Não se afirma monitoramento de disponibilidade contínua dessas páginas.
- Não houve teste em aparelho físico nem auditoria formal de conformidade WCAG ou Lighthouse. Responsividade foi verificada em viewports de navegador.
- A revisão automática bloqueou o envio do HTML não publicado ao W3C. Não foi contornado o bloqueio; foi mantida a validação local de estrutura, recursos e comportamento.
- Vercel: criação de projeto retornou 403 por falta de acesso da integração ao time. Não se alteraram projetos existentes nem o domínio oficial.

## Verificações adicionais do refinamento

Carregamento local de Cormorant Garamond e DM Sans, ausência do monograma anterior, marca dentro dos limites do cabeçalho, menu com alvo de 48 px, filtros com alvo mínimo de 44 px e tamanho mínimo de 14–15 px nos principais textos de leitura mobile. O atalho flutuante usa IntersectionObserver para ceder espaço aos contatos principais.

## Movimento e acessibilidade

O Chrome foi explicitamente configurado primeiro com prefers-reduced-motion: no-preference e depois com reduce. Foram repetidos os fluxos completos nos dois modos. Verificado que a galeria produz animações apenas no modo normal e que nenhuma animação permanece no modo reduzido. Validados separadores decorativos com aria-hidden, indicador de leitura e identificação comercial em destaque. Capturas aguardam somente animações finitas para não registrar blocos no meio da entrada.
