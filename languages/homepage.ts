import { BarChart2, Edit3, Scissors } from "lucide-react";

export const homepageTranslations = {
  en: {
    title: "Shorten your link at ease",
    pasteLink: "Paste your link here...",
    shorten: "Shorten",
    shortening: "Shortening",
    yourLink: "Your shortened link is ready!",
    signin: "Sign in to access QR codes and analytics",
    whyChooseLinx: "Why",
    whyLinxDescription: "Powerful link management solution designed to enhance your online presence and marketing capabilities.",
    features: [
      {
        title: "Shorten your links",
        description: "Transform long, complex URLs into concise, shareable links with just a single click. Perfect for social media, emails, and messaging.",
        icon: Scissors,
        loginRequired: false,
      },
      {
        title: "Customizable links",
        description: "Create memorable, branded short links by choosing your own custom slug. Make your links more recognizable and increase click-through rates.",
        icon: Edit3,
        loginRequired: true,
      },
      {
        title: "Advanced analytics",
        description: "Track clicks, monitor geographic data, and analyze user behavior with comprehensive analytics. Make data-driven decisions for your marketing campaigns.",
        icon: BarChart2,
        loginRequired: true,
      }
    ],
    loginRequired: "Login Required",
  },
  tr: {
    title: "Bağlantınızı kolayca kısaltın",
    pasteLink: "Bağlantınızı buraya yapıştırın...",
    shorten: "Kısalt",
    shortening: "Kısaltılıyor",
    yourLink: "Kısaltılmış bağlantınız hazır!",
    signin: "QR kodlarına ve analizlere erişmek için giriş yapın",
    whyChooseLinx: "Neden",
    whyLinxDescription: "Çevrimiçi varlığınızı ve pazarlama yeteneklerinizi geliştirmek için tasarlanmış güçlü bağlantı yönetim çözümü.",
    features: [
      {
        title: "Bağlantılarınızı kısaltın",
        description: "Uzun ve karmaşık URL'leri tek tıkla kısa ve paylaşılabilir bağlantılara dönüştürün. Sosyal medya, e-posta ve mesajlaşma için mükemmel.",
        icon: Scissors,
        loginRequired: false,
      },
      {
        title: "Özelleştirilebilir bağlantılar",
        description: "Kendi özel takma adınızı seçerek akılda kalıcı, markalı kısa bağlantılar oluşturun. Bağlantılarınızı daha tanınabilir hale getirin ve tıklama oranlarını artırın.",
        icon: Edit3,
        loginRequired: true,
      },
      {
        title: "Gelişmiş analizler",
        description: "Tıklamaları takip edin, coğrafi verileri izleyin ve kullanıcı davranışlarını analiz edin. Pazarlama kampanyalarınız için veri odaklı kararlar alın.",
        icon: BarChart2,
        loginRequired: true,
      }
    ],
    loginRequired: "Giriş Gerekli",
  }
} as const;