export default defineNuxtConfig({
  ssr: true,
  future: {},
  css: ['~/assets/main.css'],
  plugins: ['~/plugins/auth.client.js'],
  runtimeConfig: {
    public: {
      supabaseUrl: '',
      supabaseAnonKey: '',
    }
  },
  app: {
    head: {
      htmlAttrs: { lang: 'hu' },
      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'description', content: 'Laguna Lovasklub – Versenylovak, eladó lovak, lovas sport.' },
        { property: 'og:title', content: 'Laguna Lovasklub' },
        { property: 'og:description', content: 'Laguna Lovasklub – Versenylovak, eladó lovak, lovas sport.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'hu_HU' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css' },
      ],
      script: [
        {
          innerHTML: `(function(){var t=localStorage.getItem('theme');if(t==='light')document.documentElement.classList.add('light');})();`,
          type: 'text/javascript'
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
          defer: true
        }
      ],
      title: 'Laguna Lovasklub'
    }
  },
  vite: {
    server: {
      allowedHosts: ['aboral-monocular-scarlett.ngrok-free.dev']
    }
  }
})
