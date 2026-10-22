# RomaGleice Design — demonstração por LR Tech

Site institucional independente, feito exclusivamente com **HTML5, CSS3 e JavaScript puro**. Sem frameworks, dependências, compilação, fontes carregadas de serviços externos ou envio de dados por formulários.

## Links

- Repositório: https://github.com/lucasreginatotech/romagleice-design-demo
- Demonstração: https://lucasreginatotech.github.io/romagleice-design-demo/
- Site oficial, que não foi alterado: https://romagleice.com.br/

## Como abrir e aprender

Abra `index.html` no navegador. Para testes com as mesmas condições de hospedagem, sirva esta pasta com qualquer servidor HTTP estático e abra a URL local.

- `index.html`: estrutura semântica, conteúdo, SEO e links de WhatsApp.
- `style.css`: tokens de cor em `:root`, componentes e media queries de responsividade.
- `script.js`: menu mobile, filtros e ampliação de fotografias com `<dialog>`.
- `assets/`: fotografias WebP otimizadas e favicon SVG original.
- `fontes.html`: créditos públicos e esclarecimentos sobre a demonstração.
- `RESEARCH.md`: dados verificados e divergências nas fontes.
- `TESTS.md` e `tests/`: verificação e testes reproduzíveis.

Para mudar a paleta, edite as variáveis de `:root`. Para incluir uma referência de ambiente, adicione um `article` com `data-category` e o botão correspondente com `data-filter`. Os comentários explicam os pontos de comportamento no JavaScript.

## Conteúdo e fotografias

WhatsApp confirmado no site oficial: **+55 11 95428-1006**. Os CTAs usam `wa.me` com mensagem preenchida; o visitante precisa enviar a mensagem. Não existe envio automático.

Fotografias do Unsplash sob [Unsplash License](https://unsplash.com/license), identificadas como **ilustrativas** junto às imagens e na galeria. Não são projetos da empresa. Consulte `fontes.html` para os arquivos originais. Fotos oficiais não foram copiadas por falta de autorização expressa de reutilização.

A assinatura tipográfica e o favicon são propostas visuais, não reproduções do logotipo oficial. Não foram inventados avaliações, depoimentos, garantias, preços, anos de mercado ou condições comerciais.

## SEO e privacidade

Título, descrição, Open Graph, canonical, favicon, sitemap XML e HTML semântico configurados. **A demonstração usa `noindex, nofollow` intencionalmente** para não concorrer com a empresa no Google. Em eventual migração autorizada, atualizar as URLs absolutas, as fotos oficiais e a política de indexação. Não há analytics, pixels, formulários, cookies próprios ou banco de dados.

## Publicação

Projeto estático, sem etapa de build. GitHub Pages usa a branch `main`, pasta raiz e `.nojekyll`. `vercel.json` permite uma publicação independente na Vercel com framework `Other`, sem install/build e diretório de saída `.`. A configuração acrescenta headers de segurança e noindex na Vercel. GitHub Pages não lê `vercel.json`; nessa hospedagem o noindex é aplicado pelo HTML.

A integração Vercel retornou 403 para criar um projeto no time conectado. Não houve alteração em projetos existentes. Nunca configurar o domínio `romagleice.com.br` nesta demonstração.

Nenhum `.env`, token, perfil de navegador ou artefato de autenticação deve ser versionado. Os scripts de GitHub usam apenas o Git Credential Manager já configurado e mantêm a credencial exclusivamente em memória.

## Refinamento para mobile

A versão revisada utiliza Cormorant Garamond e DM Sans em WOFF2 local (licenças SIL OFL em assets/fonts), abertura editorial com fotografia independente do texto, marca tipográfica sem monograma, navegação aderente ao topo, áreas de toque de 44–56 px e WhatsApp flutuante que se recolhe quando os contatos principais estão visíveis. As quatro fotografias foram substituídas por uma seleção de tons naturais, com créditos atualizados.

## Movimento e navegação

Entradas progressivas com Web Animations API e IntersectionObserver, transições na galeria, abertura suave do menu e ampliação, FAQ animada, navegação com indicação da seção atual, indicador de leitura e separadores com ondulações orgânicas. O conteúdo permanece visível se a animação não puder executar. Ondas fora da tela são pausadas; mudanças em prefers-reduced-motion cancelam imediatamente as animações em andamento.
