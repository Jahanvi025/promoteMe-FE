export function mungeEmailAddress(s: string) {
  var i = s.indexOf("@");
  var startIndex = (i * 0.2) | 0;
  var endIndex = (i * 0.9) | 0;
  return (
    s.slice(0, startIndex) +
    s.slice(startIndex, endIndex).replace(/./g, "*") +
    s.slice(endIndex)
  );
}

export const timer = (sec: number) =>
  new Promise((resolve) => setTimeout(resolve, sec));

export const chunkImages = (
  array: {
    images: string[];
    access_identifier: string;
    isPurchased: boolean;
    isSubscribed: boolean;
    price: string;
    user_id: {
      _id: string;
      displayName: string;
      profile_picture: string;
    };
    postId: string;
  }[],
  chunkSize: number
): {
  images: string[];
  access_identifier: string;
  isPurchased: boolean;
  isSubscribed: boolean;
  price: string;
  user_id: {
    _id: string;
    displayName: string;
    profile_picture: string;
  };
  postId: string
}[][] => {
  const chunks: {
    images: string[];
    access_identifier: string;
    isPurchased: boolean;
    isSubscribed: boolean;
    price: string;
    user_id: {
      _id: string;
      displayName: string;
      profile_picture: string;
    };
    postId: string;
  }[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

export function chunkAudios(
  arr: {
    audio_url: string;
    accessIdentifier: string;
    isPurchased: boolean;
    isSubscribed: boolean;
    postId: string;
    user_id: {
      _id: string;
      displayName: string;
      profile_picture: string;
    };
    price: string;
  }[],
  size: number
): {
  audio_url: string;
  accessIdentifier: string;
  isPurchased: boolean;
  isSubscribed: boolean;
  postId: string;
  user_id: {
    _id: string;
    displayName: string;
    profile_picture: string;
  };
  price: string;
}[][] {
  const chunkedArr: {
    audio_url: string;
    accessIdentifier: string;
    isPurchased: boolean;
    isSubscribed: boolean;
    postId: string;
    user_id: {
      _id: string;
      displayName: string;
      profile_picture: string;
    };
    price: string;
  }[][] = [];

  for (let i = 0; i < arr.length; i += size) {
    chunkedArr.push(arr.slice(i, i + size));
  }

  return chunkedArr;
}

export const chunkVideos = (
  array: {
    videoUrl: string;
    accessIdentifier: string;
    isPurchased: boolean;
    isSubscribed: boolean;
    price: string;
    postId: string;
    user_id: {
      _id: string;
      displayName: string;
      profile_picture: string;
    };
  }[],
  chunkSize: number
): {
  videoUrl: string;
  accessIdentifier: string;
  isPurchased: boolean;
  isSubscribed: boolean;
  price: string;
  postId: string;
  user_id: {
    _id: string;
    displayName: string;
    profile_picture: string;
  };
}[][] => {
  const chunks: {
    videoUrl: string;
    accessIdentifier: string;
    isPurchased: boolean;
    isSubscribed: boolean;
    price: string;
    postId: string;
    user_id: {
      _id: string;
      displayName: string;
      profile_picture: string;
    };
  }[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};


export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

  return `${formattedMinutes}:${formattedSeconds}`;
}

export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const resolveContentLink = (content: File | string | Blob) => {
  if (content) {
    if (typeof content === "string") return content;
    else {
      return URL.createObjectURL(content);
    }
  } else return "";
};

export const resolveOptionalContentLink = (content?: File | string) => {
  if (content) {
    if (typeof content === "string") return content;
    else return URL.createObjectURL(content);
  }
};

export const resolveThumbnail = (thumbnail?: (File | string)[]) => {
  if (thumbnail && thumbnail[0]) {
    if (typeof thumbnail[0] === "string") return thumbnail[0];
    else {
      return `${URL.createObjectURL(thumbnail[0])}`;
    }
  } else return "";
};

export function formatDateForRow(date: Date) {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" }); // Short month name
  const year = date.getFullYear();
  const hours = date.getHours() % 12 || 12; // 12-hour format
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Zero-padded minutes
  const ampm = date.getHours() >= 12 ? "pm" : "am";

  return `${day} ${month} ${year} : ${hours}:${minutes}${ampm}`;
}

export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (seconds < 60) return rtf.format(-seconds, "second");
  if (minutes < 60) return rtf.format(-minutes, "minute");
  if (hours < 24) return rtf.format(-hours, "hour");
  if (days < 7) return rtf.format(-days, "day");
  return rtf.format(-weeks, "week");
}

export function formatDate(dateString: string | undefined) {
  if (dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }
}

export function wrapEmojisInSpan(text: string): string {
  const emojiRegex = /([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}])/gu;
  return text.replace(emojiRegex, '<span class="emoji">$&</span>');
}
