export interface BirthdayConfig {
  recipient: {
    name: string;
    nickname: string;
    birthdayDate: string;
    birthdayAge: number | null;
  };
  site: {
    title: string;
    language: string;
    heartTapsRequired: number;
    ambientMusicEnabled: boolean;
  };
  assets: {
    heroPhoto: string;
    closingPhoto: string;
    voiceMessage: string;
    music: string;
    videos: Array<{
      id: number;
      title: string;
      description: string;
      webPath: string;
      fallbackPath: string;
      originalFilename: string;
    }>;
  };
  gift: {
    title: string;
    type: string;
    description: string;
    detail: string;
    dateSelectionEnabled: boolean;
    timezone: string;
    recipientWhatsApp: string;
    blockedDates: string[];
    confirmationMethod: "whatsapp" | "clipboard";
  };
  interactiveQuiz: {
    enabled: boolean;
    questions: Array<{
      id: number;
      question: string;
      options: string[];
      correctIndex: number;
      sweetReaction: string;
    }>;
  };
}

export const birthdayConfig: BirthdayConfig = {
  recipient: {
    name: "Vale",
    nickname: "Amorcito mío",
    birthdayDate: "12 de Octubre",
    birthdayAge: null,
  },

  site: {
    title: "Vale — Qué bonito coincidir contigo",
    language: "es-CO",
    heartTapsRequired: 5,
    ambientMusicEnabled: false,
  },

  assets: {
    heroPhoto: "/media/photos/hero-vale.webp",
    closingPhoto: "/media/photos/foto-28.webp",
    voiceMessage: "/media/audio/voice-message.mp3",
    music: "/media/audio/ambient-music.mp3",
    videos: [
      {
        id: 1,
        title: "Un momento divertido",
        description:
          "Por esas pequeñas locuras que me hacen sonreír y por lo divertido que es compartir la vida contigo.",
        webPath: "/media/videos/video-01.mp4",
        fallbackPath: "/media/videos/8307056ad70e48c98d275dbb7158d215.mov",
        originalFilename: "8307056ad70e48c98d275dbb7158d215.mov",
      },
      {
        id: 2,
        title: "Alegría junto al mar",
        description:
          "Que nunca pierdas esas ganas de jugar, de reír y de disfrutar cada instante.",
        webPath: "/media/videos/video-02.mp4",
        fallbackPath: "/media/videos/IMG_7547.MOV",
        originalFilename: "IMG_7547.MOV",
      },
      {
        id: 3,
        title: "Aventuras en la nieve",
        description:
          "Que todos los caminos te lleven a experiencias maravillosas, incluso a las más inesperadas.",
        webPath: "/media/videos/video-03.mp4",
        fallbackPath: "/media/videos/IMG_0198.MOV",
        originalFilename: "IMG_0198.MOV",
      },
      {
        id: 4,
        title: "Una sonrisa frente al mar",
        description:
          "Por todos los lugares que todavía te esperan y por las miles de sonrisas que te quedan por regalar.",
        webPath: "/media/videos/video-04.mp4",
        fallbackPath: "/media/videos/IMG_3437.MOV",
        originalFilename: "IMG_3437.MOV",
      },
    ],
  },

  gift: {
    title: "¡Tenemos una cita de cumpleaños, Vale!",
    type: "Desayuno / brunch sorpresa",
    description: "Te invito a un desayuno / brunch sorpresa.",
    detail:
      "Un momento para consentirte, celebrar tu vida y disfrutar de algo delicioso juntos.",
    dateSelectionEnabled: true,
    timezone: "America/Bogota",
    recipientWhatsApp: "", // Configura aquí tu número con indicativo internacional (ej: "573001234567")
    blockedDates: [],
    confirmationMethod: "whatsapp",
  },

  interactiveQuiz: {
    enabled: false,
    questions: [],
  },
};
