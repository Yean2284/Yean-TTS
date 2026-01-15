
export type Language = 'es' | 'en' | 'pt';

export const translations = {
  es: {
    nav: {
      selection: 'Selección de Voz',
      audios: 'Audios',
      pricing: 'Precios',
      features: 'Características',
      tutorials: 'Tutoriales',
      faq: 'Preguntas Frecuentes',
      upgrade: 'MEJORAR',
      login: 'Iniciar Sesión',
      logout: 'Cerrar Sesión',
      profile: 'Mi Perfil'
    },
    auth: {
      title: 'Bienvenido de nuevo',
      subtitle: 'Accede a tus audios y funciones Pro desde cualquier dispositivo.',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      signIn: 'Entrar',
      signUp: 'Crear Cuenta',
      google: 'Continuar con Google',
      noAccount: '¿No tienes cuenta?',
      hasAccount: '¿Ya tienes cuenta?',
      success: '¡Sesión iniciada!'
    },
    hero: {
      banner: 'YeanTexttoSpeechGen Pro - TTS con Licencia Comercial',
      download: 'Descargar App',
      inputPlaceholder: 'Escribe o pega tu contenido aquí... (Límite de {limit} caracteres)',
      generate: 'Generar Audio',
      generating: 'Convirtiendo {progress}%...',
      effects: 'Efectos de Voz',
      selectedVoice: 'Voz Seleccionada',
      premium: 'PREMIUM',
      captcha: 'Ingresa el código',
      videoTutorials: 'Video Tutoriales',
      license: 'Licencia Comercial'
    },
    checkout: {
      title: 'Finalizar Compra',
      secure: 'Pago Seguro Encriptado',
      plan: 'Plan Seleccionado',
      total: 'Total a Pagar',
      card: 'Información de Tarjeta',
      pay: 'Pagar Ahora',
      processing: 'Procesando Pago...',
      success: '¡Suscripción Activada!',
      cancel: 'Cancelar'
    },
    features: {
      title: 'Plataforma TTS Premium con Licencia Comercial',
      subtitle: 'Experimenta la conversión de texto a voz de calidad profesional con completa libertad comercial.',
      items: [
        { title: 'Sin Registro', desc: 'Comienza de inmediato sin cuentas ni inicios de sesión.' },
        { title: 'Licencia Comercial', desc: 'Usa tus audios en cualquier lugar con derechos comerciales incluidos.' },
        { title: '580+ Voces Premium', desc: 'Colección extensa de voces AI naturales en 75+ idiomas.' },
        { title: 'Uso Ilimitado', desc: 'Conversiones diarias generosas que se sienten ilimitadas.' },
        { title: '75+ Idiomas', desc: 'Soporte multilingüe con acentos regionales auténticos.' },
        { title: 'Personalización', desc: 'Ajusta el tono, la velocidad y añade pausas personalizadas.' }
      ]
    },
    howTo: {
      title: 'Cómo usar YeanTexttoSpeechGen',
      steps: [
        { step: '1', title: 'Introduce tu texto', desc: 'Escribe o pega tu texto en el campo de entrada.' },
        { step: '2', title: 'Elige una voz', desc: 'Selecciona de nuestra biblioteca de voces premium.' },
        { step: '3', title: 'Genera y Descarga', desc: 'Haz clic en generar y descarga tu archivo al instante.' }
      ]
    },
    pricing: {
      title: 'Elige tu Plan',
      subtitle: 'Escala tu creación de contenido con voces premium y mayores límites.',
      plans: {
        Free: { price: '$0', period: 'siempre', button: 'Plan Actual' },
        Pro: { price: '$19', period: 'por mes', button: 'Mejorar a Pro' },
        Business: { price: '$49', period: 'por mes', button: 'Obtener Business' }
      },
      alert: 'Iniciando pasarela de pago segura...'
    },
    faq: {
      title: 'Preguntas Frecuentes',
      questions: [
        { q: '¿Puedo usar el audio para fines comerciales?', a: 'Sí, todos los audios generados con YeanTexttoSpeechGen incluyen una licencia comercial completa.' },
        { q: '¿Es realmente gratuito?', a: '¡Absolutamente! Ofrecemos un plan gratuito generoso de hasta 5,000 caracteres.' },
        { q: '¿Necesito crear una cuenta?', a: 'No es necesario, pero registrarte te permite guardar tu historial en la nube.' },
        { q: '¿Cuál es el límite?', a: '5,000 para gratuitos y 20,000 para usuarios Pro.' }
      ]
    },
    footer: {
      desc: 'Transforma texto en habla profesional con tecnología AI avanzada de Yean & Truncar.',
      links: 'Enlaces Rápidos',
      legal: 'Legal',
      connect: 'Conéctate',
      rights: '© 2025 YeanTexttoSpeechGen Pro. PARTE DE LA SUITE TRUNCAR APP.'
    }
  },
  en: {
    nav: {
      selection: 'Voice Selection',
      audios: 'Audios',
      pricing: 'Pricing',
      features: 'Features',
      tutorials: 'Tutorials',
      faq: 'FAQ',
      upgrade: 'UPGRADE',
      login: 'Sign In',
      logout: 'Sign Out',
      profile: 'My Profile'
    },
    auth: {
      title: 'Welcome Back',
      subtitle: 'Access your audios and Pro features from any device.',
      email: 'Email Address',
      password: 'Password',
      signIn: 'Sign In',
      signUp: 'Create Account',
      google: 'Continue with Google',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      success: 'Logged in successfully!'
    },
    hero: {
      banner: 'YeanTexttoSpeechGen Pro - TTS with Commercial License',
      download: 'Download App',
      inputPlaceholder: 'Type or paste your content here... ({limit} char limit)',
      generate: 'Generate Audio',
      generating: 'Converting {progress}%...',
      effects: 'Voice Effects',
      selectedVoice: 'Selected Voice',
      premium: 'PREMIUM',
      captcha: 'Enter Code',
      videoTutorials: 'Video Tutorials',
      license: 'Commercial License'
    },
    checkout: {
      title: 'Checkout',
      secure: 'Secure Encrypted Payment',
      plan: 'Selected Plan',
      total: 'Total to Pay',
      card: 'Card Information',
      pay: 'Pay Now',
      processing: 'Processing Payment...',
      success: 'Subscription Activated!',
      cancel: 'Cancel'
    },
    features: {
      title: 'Premium TTS Platform with Commercial License',
      subtitle: 'Experience professional-grade text-to-speech with complete commercial freedom.',
      items: [
        { title: 'No Registration', desc: 'Start immediately without accounts or logins.' },
        { title: 'Commercial License', desc: 'Use your generated audios anywhere with rights included.' },
        { title: '580+ Premium Voices', desc: 'Extensive collection of natural AI voices in 75+ languages.' },
        { title: 'Unlimited Usage', desc: 'Generous daily conversions that feel unlimited.' },
        { title: '75+ Languages', desc: 'Multilingual support with authentic regional accents.' },
        { title: 'Personalization', desc: 'Adjust pitch, speed, and add custom pauses.' }
      ]
    },
    howTo: {
      title: 'How to use YeanTexttoSpeechGen',
      steps: [
        { step: '1', title: 'Input your text', desc: 'Write or paste your text in the input field.' },
        { step: '2', title: 'Choose a voice', desc: 'Select from our massive library of premium voices.' },
        { step: '3', title: 'Generate & Download', desc: 'Click generate and download your file instantly.' }
      ]
    },
    pricing: {
      title: 'Choose Your Plan',
      subtitle: 'Scale your content creation with premium voices and higher limits.',
      plans: {
        Free: { price: '$0', period: 'forever', button: 'Current Plan' },
        Pro: { price: '$19', period: 'per month', button: 'Upgrade to Pro' },
        Business: { price: '$49', period: 'per month', button: 'Get Business' }
      },
      alert: 'Initiating secure payment gateway...'
    },
    faq: {
      title: 'Frequently Asked Questions',
      questions: [
        { q: 'Can I use audio for commercial purposes?', a: 'Yes, all generated audios include a full commercial license.' },
        { q: 'Is it really free?', a: 'Absolutely! We offer a generous free tier of 5,000 characters.' },
        { q: 'Do I need an account?', a: 'No, but signing up lets you sync your history to the cloud.' },
        { q: 'What is the limit?', a: '5,000 for free and 20,000 for Pro users.' }
      ]
    },
    footer: {
      desc: 'Transform text into professional speech with advanced AI technology by Yean & Truncar.',
      links: 'Quick Links',
      legal: 'Legal',
      connect: 'Stay Connected',
      rights: '© 2025 YeanTexttoSpeechGen Pro. PART OF THE TRUNCAR APP SUITE.'
    }
  },
  pt: {
    nav: {
      selection: 'Seleção de Voz',
      audios: 'Áudios',
      pricing: 'Preços',
      features: 'Características',
      tutorials: 'Tutoriais',
      faq: 'Perguntas Frequentes',
      upgrade: 'MELHORAR',
      login: 'Entrar',
      logout: 'Sair',
      profile: 'Meu Perfil'
    },
    auth: {
      title: 'Bem-vindo de volta',
      subtitle: 'Acesse seus áudios e recursos Pro de qualquer dispositivo.',
      email: 'E-mail',
      password: 'Senha',
      signIn: 'Entrar',
      signUp: 'Criar Conta',
      google: 'Continuar com Google',
      noAccount: 'Não tem uma conta?',
      hasAccount: 'Já tem uma conta?',
      success: 'Sessão iniciada!'
    },
    hero: {
      banner: 'YeanTexttoSpeechGen Pro - TTS com Licença Comercial',
      download: 'Baixar App',
      inputPlaceholder: 'Digite ou cole seu conteúdo aqui... (Limite de {limit} caracteres)',
      generate: 'Gerar Áudio',
      generating: 'Convertendo {progress}%...',
      effects: 'Efeitos de Voz',
      selectedVoice: 'Voz Selecionada',
      premium: 'PREMIUM',
      captcha: 'Digite o código',
      videoTutorials: 'Tutoriais em Vídeo',
      license: 'Licença Comercial'
    },
    checkout: {
      title: 'Finalizar Compra',
      secure: 'Pagamento Seguro Criptografado',
      plan: 'Plano Selecionado',
      total: 'Total a Pagar',
      card: 'Informações do Cartão',
      pay: 'Pagar Agora',
      processing: 'Processando Pagamento...',
      success: 'Assinatura Ativada!',
      cancel: 'Cancelar'
    },
    features: {
      title: 'Plataforma TTS Premium com Licença Comercial',
      subtitle: 'Experimente a conversão de texto em fala de qualidade profissional com total liberdade comercial.',
      items: [
        { title: 'Sem Registro', desc: 'Comece imediatamente sem contas ou logins.' },
        { title: 'Licença Comercial', desc: 'Use seus áudios em qualquer lugar con direitos comerciais.' },
        { title: '580+ Vozes Premium', desc: 'Coleção de vozes naturais.' },
        { title: 'Uso Ilimitado', desc: 'Gerações diárias generosas.' },
        { title: '75+ Idiomas', desc: 'Suporte multilíngue.' },
        { title: 'Personalização', desc: 'Ajuste tom e velocidade.' }
      ]
    },
    howTo: {
      title: 'Como usar YeanTexttoSpeechGen',
      steps: [
        { step: '1', title: 'Insira seu texto', desc: 'Escreva ou cole.' },
        { step: '2', title: 'Escolha uma voz', desc: 'Selecione na biblioteca.' },
        { step: '3', title: 'Gere e Baixe', desc: 'Baixe instantaneamente.' }
      ]
    },
    pricing: {
      title: 'Escolha seu Plano',
      subtitle: 'Escala sua criação de conteúdo.',
      plans: {
        Free: { price: '$0', period: 'para sempre', button: 'Plano Atual' },
        Pro: { price: '$19', period: 'por mês', button: 'Melhorar para Pro' },
        Business: { price: '$49', period: 'por mês', button: 'Obter Business' }
      },
      alert: 'Redirecionando...'
    },
    faq: {
      title: 'Perguntas Frequentes',
      questions: [
        { q: 'Posso usar comercialmente?', a: 'Sim.' },
        { q: 'É gratuito?', a: 'Sim, plano gratuito até 5.000 caracteres.' },
        { q: 'Preciso de conta?', a: 'Não, mas ajuda a salvar o histórico.' }
      ]
    },
    footer: {
      desc: 'Transforme texto em fala profissional.',
      links: 'Links Rápidos',
      legal: 'Legal',
      connect: 'Conecte-se',
      rights: '© 2025 YeanTexttoSpeechGen Pro.'
    }
  }
};
