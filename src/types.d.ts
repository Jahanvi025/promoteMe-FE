declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

interface ApiError {
  data: {
    message?: string;
  };
}

interface ValidationError {
  message: string;
  data: {
    data: {
      errors: {
        msg: string;
      }[];
    }
  }
}

interface LoginResponse {
  data: {
    id: string;
    email: string;
    active: boolean;
    blocked: boolean;
    role: string;
    username: string;
    accessToken: string;
    refreshToken: string;
    stripeAccountId: string;
  };
  success: boolean;
}

interface User {
  _id: string;
  [key: string]: string;
}

type LogoProps = {
  type: string;
};

type AvatarProps = {
  type: string;
  image: string;
};

interface IMenuItem {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
}

type SignupFormInputs = {
  name: string;
  username: string;
  email: string;
  mobile_number: string;
  password: string;
  displayName?: string;
  lastActiveRole?: string;
  isCreator?: boolean;
  isFan?: boolean;
};

type LoginFormInputs = {
  email: string;
  password: string;
};

type ForgotPasswordFormInputs = {
  email: string;
};

interface otpData {
  otp: string;
  email: string;
}

type ResetPassowrdFormInputs = {
  password: string;
  confirmPassword: string;
};


type SelectedImage = -1 | 0 | 1 | 2;

type ScopeType = 0 | 1 | 2;

type PostContentType = "IMAGE" | "AUDIO" | "TEXT" | "VIDEO";

type UploaderType = "IMAGE" | "VIDEO" | "AUDIO";

type Deliverystatus = "Shipped" | "Processing" | "Delivered" | "Refunded" | "Cancelled";

interface GetPostsResponse {
  data: {
    page: number;
    limit: number;
    count: number;
    posts: Post[];
  };
  success: boolean;
}

interface Post {
  _id: string;
  description: string;
  username: string;
  user_id: {
    _id: string;
    displayName: string;
    profile_picture: string;
  };
  type: PostContentType;
  access_identifier?: string;
  likes?: number;
  comments?: number;
  pollanswers?: any[];
  images: string[];
  video_url: string;
  audio_url?: string;
  thumbnail_url: string;
  teaser_url: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean;
  isSubscribed?: boolean;
  isPurchased?: boolean;
  access_identifier: string;
  tip?: number;
  setShareModal?: (value: boolean) => void;
  setCommentModal?: (value: boolean) => void;
  isPreview: boolean;
  isEditingPost?: boolean;
  isPurchased?: boolean;
  price?: string;
}

interface UpdatePostResponse {
  data: {
    post: {
      _id: string;
      type: PostContentType;
      access_identifier: string;
      likes: number;
      comments: number;
      description: string;
      tip: number;
      pollanswers: string[];
      images: string[];
      username: string;
      user_id: {
        _id: string;
        displayName: string;
        profile_picture: string;
      };
      video_url: string,
      thumbnail_url: string,
      teaser_url: string,
      isPreview: boolean,
      createdAt: string,
      updatedAt: string,
    };
  };
}

type UploadedVideo = string | ArrayBuffer | null | undefined;

type IMessage = { from: 0 | 1; message: string };

type IMessageBox = IMessage[];

type EarningType = "Yearly Sub" | "Monthly Sub" | "Post" | "Product" | "Gallery";

type paymentStatus = "Cancelled" | "Done" | "Pending";

interface MessageItem {
  index: number;
  name: string;
  lastMessage: string;
  unseen: number;
}

interface FeedTableRow {
  postType: PostType;
  audio?: string | Blob;
  media?: (string | File)[];
  description: string;
  status: 0 | 1;
  updatedOn: Date;
}

interface ProductTableRow {
  media: (string | File)[];
  Name: string;
  Price: number;
  Stock: number;
  Type: string;
  Status: 0 | 1;
  updatedOn: Date;
}


interface OrderTableRow {
  _id: string;
  product_id: {
    _id: string;
    name: string;
    description: string;
    price: number;
  }[];
  address_id: {
    _id: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  order_date: string;
  status: string;
  setIsViewingOrder: (value: boolean) => void;
}

interface EarningHistoryTableRow {
  User: string;
  Type: EarningType;
  Gross: string;
  Commission: string;
  NET: string;
  Date: Date;
}

interface PayoutRequestRow {
  ID: string;
  Amount: string | number;
  PaymentGateway: string;
  Status: paymentStatus;
  RequestedOn: Date;
}

interface Loginuser {
  email: string;
  password: string;
}

interface VerifyOtpResponse {
  success: boolean;
  data: {
    passwordResetToken: string;
  };
  message?: string;
}

interface resetPasswordData {
  passwordResetToken: string;
  newPassword: string;
}

interface socialAuthResponse {
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    accessToken: string;
    image: string;
    stripeAccountId: string;
  };
  success: boolean;
}

interface socialAuthData {
  access_token: string;
}

interface GetPostsParams {
  page?: number;
  limit?: number;
  type?: string;
  fromDate?: Date;
  toDate?: Date;
  status?: string;
  searchString?: string;
  filter?: string;
  creatorId?: string;
  role?: string;
}

interface GetCommentsResponse {
  data: {
    count: number,
    page: number,
    pages: number,
    comments: []
  },
  success: boolean;
}

interface GetRepliesResponse {
  data: {
    count: number,
    page: number,
    pages: number,
    replies: []
  },
  success: boolean;
}

interface ChangePasswordFormInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UpdateUserFormInput {
  displayName: string;
  username: string;
  mobile_number: string;
  category_id?: string;
  date_of_birth?: string;
  gender: string;
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  email?: string;
  bio?: string;
  yearly_Price?: number;
  monthly_Price?: number;
}

interface UpdateFanFormInput {
  displayName: string;
  mobile_number: string;
  username: string;
  gender: string;
  email?: string;
}

interface GetUserResponse {
  data: {
    user: {
      total_subscribers: number;
      monthly_Price: number;
      yearly_Price: number;
      _id: string;
      email: string;
      role: string;
      username: string;
      date_of_birth: string;
      displayName: string;
      profile_picture: string;
      gender: string;
      mobile_number: string;
      cover_image: string;
      createdAt: string;
      facebook_url: string;
      linkedin_url: string;
      instagram_url: string;
      updatedAt: string;
      bio: string;
      isSubscribed: boolean;
      postCount?: number
      isFan?: boolean;
      isCreator?: boolean;
      category_id?: {
        _id: string;
        name: string;
      };
    };
  };
}

interface BlockListData {
  data: {
    blockedUsers: {
      _id: string;
      user_id: {
        _id: string;
        displayName: string;
        username: string;
        profile_picture: string;
      };
      createdAt: string;
      updatedAt: string;
    }[];
  };
}

interface NewPost {
  user_id?: string | undefined;
  type?: PostContentType;
  description?: string;
  images?: string[];
  video_url?: string;
  audio_url?: string;
  access_identifier?: string;
  thumbnail_url?: string;
  teaser_url?: string;
  status?: string;
  price?: number;
}

interface conversationsResponse {
  data: {
    users: {
      _id: string;
      user: {
        _id: string;
        profile_picture: string;
        displayName: string;
      };
      latestMessage: string;
      unseenCount: number;
    }[];
  };
}


interface Message {
  _id?: string;
  from?: string | undefined;
  message: string;
  to: string;
  status: string;
  images?: string[];
  conversation_id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MessageResponse {
  data: {
    messages: Message[];
    count: number;
  };
}

interface blockUserInputs {
  user_id: string;
  blocked_by: string | undefined;
}

interface Comment {
  _id: string;
  comment?: string;
  replies: Comment[];
  likedBy?: string[];
  createdAt: string;
  updatedAt: string;
  parent_id: string | null;
  post_id: string;
  user_id: {
    _id: string;
    username: string;
    profile_picture: string;
  };
}

interface TableDataInputs {
  id?: string;
  page?: number;
  limit?: number;
  fromDate?: Date;
  toDate?: Date;
  searchString?: string;
  type?: string;
  starting_after?: string;
  status?: string;
}

interface OrderHistoryResponse {
  data: {
    page: number;
    limit: number;
    count: number;
    orderHistory: OrderHistoryItem[];
  }
}

interface OrderHistoryItem {
  _id: string;
  name: string;
  unit_price: number;
  total_price: number;
  stock: number;
  status: string;
  address_id: {
    _id: string;
    address: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    contactNumber: string
  }
  quantity: number;
  product_id: [
    {
      _id: string;
      name: string;
      total_price: number;
      images: string[];
      description: string;
      type: string;
    }
  ];
  updatedAt: string;
  ordered_by: {
    _id: string;
    displayName: string;
    email: string;
    profile_picture: string;
  }
}

interface addProductInput {
  images?: string[];
  name: string;
  price: number;
  stock: number;
  description: string;
  status?: string
}

interface updateProductInput {
  images?: string[];
  name?: string;
  price?: number;
  stock?: number;
  description?: string;
  status?: string
}

interface Product {
  _id: string;
  user_id?: string;
  images: string[];
  name: string;
  price: number;
  stock: number;
  type: 'DIGITAL' | 'PHYSICAL';
  status: 'INACTIVE' | 'ACTIVE';
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

interface GetMyProductsResponse {
  data: {
    products: Product[];
    page: number;
    totalPages: number;
    totalProducts: number;
  };
  success: boolean;
}

interface GetProductResponse {
  data: {
    product: Product;
  };
  success: boolean;
}

interface Payout {
  id: string;
  amount: number;
  application_fee: number | null;
  application_fee_amount: number | null;
  arrival_date: number;
  automatic: boolean;
  balance_transaction: string;
  created: number;
  currency: string;
  description: string;
  destination: string;
  metadata: Record<string, unknown>;
  status: string;
  type: string;
  note?: string;
}

interface PayoutsResponse {
  data: {
    payouts: {
      object: string;
      data: Payout[];
      has_more: boolean;
      url: string;
    };
  };
  success: boolean;
}

interface BankDetailsForm {
  firstName: string;
  lastName: string;
  bankName: string;
  accountNumber: string;
  country?: string;
  state: string;
  city: string;
  address: string;
  bankRouting: string;
  bankSwiftCode: string;
  currency?: string;
}

interface SearchedUser {
  _id: string;
  username: string;
  displayName: string;
  cover_image: string;
  profile_picture: string;
}

interface GetSearchedUserResponse {
  data: {
    users: SearchedUser[];
    count: number;
    page: number;
    pages: number;
  };
}

interface AddressInput {
  firstName: string;
  lastName: string;
  address: string;
  contactNumber: number;
  zipCode: number;
  state: string;
}

interface Address {
  _id: string;
  user_id: string;
  firstName: string;
  lastName: string;
  state: string;
  address: string;
  zipCode: number;
  contactNumber: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AddressResponse {
  data: {
    message: string;
    addresses: Address[];
  };
  success: boolean;
}
interface chatUser {
  _id: string;
  username: string;
  displayName: string;
  profile_picture: string;
}

interface searchConversationResponse {
  data: {
    user: chatUser[];
    unseenCount: number;
    count: number;
    page: number;
    pages: number;
  };
  success: boolean;
}

interface Subscription {
  _id: string;
  user_id: string;
  type: 'MONTHLY' | 'YEARLY';
  subscribedTo: string;
  startDate: string;
  expiryDate: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    _id: string;
    displayName: string;
    profile_picture: string;
  }
  status: string;
}

interface SubscriptionResponse {
  data: {
    page: number;
    limit: number;
    count: number;
    subscriptions: Subscription[];
  };
}

interface PaymentInput {
  amount: number;
  currency: string;
  paymentType: string;
  ownerId: string
  redirectEndPoint: string;
  quantity?: number;
  postId?: string;
  subscriptionType?: string;
}

interface MakePaymentResponse {
  data: {
    id: string;
  }
}

interface connectAccountResponse {
  data: {
    url: string;
  }
}

interface Order {
  product_id: string[];
  quantity: number;
  unit_price: number;
  total_price: number;
  address_id: string;
}

interface Transaction {
  _id: string;
  user_id: string;
  wallet_id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  paidTo: {
    _id: string,
    displayName: string,
    profile_picture: string
  }
}

interface GetTransactionsResponse {
  success: boolean;
  data: {
    transactions: Transaction[];
    page: number;
    totalPages: number;
    totalTransactions: number;
  }
}

interface Payment {
  _id: string;
  user_id: string;
  amount: string;
  status: 'DONE' | 'PENDING' | 'FAILED';
  paidTo: string;
  type: 'MONTHLY Subscription' | 'Product Purchase' | 'Service Payment' | string;
  paymentMethod: 'Stripe' | 'PayPal' | 'Credit Card' | string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PaymentHistoryResponse {
  data: {
    payments: Payment[];
    page: number;
    totalPages: number;
    totalPayments: number;
  };
  success: boolean;
}

interface AddCardFormInput {
  name: string;
  number: number;
  expiryDate: string;
  CVV: number;
  isDefault?: boolean;
}

interface ICard {
  _id: string;
  user_id: string;
  name: string;
  number: string;
  expiryDate: string;
  CVV: number;
  type: string;
  isDefault: boolean;
}

interface GetCardResponse {
  data: {
    cards: ICard[];
  }
}

interface TrendingUser {
  _id: string;
  username?: string;
  displayName?: string;
  profile_picture?: string;
  cover_image?: string;
}

interface SuggestionResponse {
  data: {
    users: User[];
  };
  success: boolean;
}

interface FeeDetail {
  amount: number;
  application: string;
  currency: string;
  description: string;
  type: string;
}

interface BalanceTransaction {
  id: string;
  object: string;
  amount: number;
  available_on: number;
  created: number;
  currency: string;
  description: string | null;
  exchange_rate: number | null;
  fee: number;
  fee_details: FeeDetail[];
  net: number;
  reporting_category: string;
  source: string;
  status: string;
  type: string;
}

interface EarningsHistoryResponse {
  data: {
    object: string;
    data: BalanceTransaction[];
    has_more: boolean;
    url: string;
  };
  success: boolean;
}

interface PostResponse {
  data: {
    post: Post;
  }
}

interface UpdatedUser {
  _id: string;
  email: string;
  isCreator: boolean;
  isFan: boolean;
  lastActiveRole: string;
  username: string;
  displayName: string;
  total_subscribers: number;
  monthly_Price: number;
  yearly_Price: number;
  bio: string;
  category_id: string;
  date_of_birth: string;
  facebook_url: string;
  gender: string;
  instagram_url: string;
  linkedin_url: string;
  cover_image: string;
  profile_picture: string;
}


interface UpdateUserResponse {
  status: number;
  data: UpdatedUser;
  success: boolean;
}

interface BalanceResponse {
  success: boolean;
  balance: Array<{
    amount: number;
    currency: string;
    source_types: {
      card: number;
    };
  }>;
}

interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryResponse {
  data: {
    categories: Category[];
  };
  success: boolean;
}