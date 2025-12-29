import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_APP_API_BASE_URL}`,
    prepareHeaders: (headers, { getState }) => {
      const accessToken = (getState() as RootState).auth.accessToken;
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }
  ),
  endpoints: (builder) => ({
    getUserById: builder.query<User, string>({
      query: (id) => `users/${id}`,
    }),
    registerUser: builder.mutation<LoginResponse, SignupFormInputs>({
      query: (body) => {
        return {
          url: "users/register",
          method: "POST",
          body,
        };
      },
    }),

    getUser: builder.query<GetUserResponse, { creatorId?: string }>({
      query: ({ creatorId } = {}) => {
        const url = creatorId ? `users/?creatorId=${creatorId}` : 'users/';
        return {
          url,
          method: 'GET',
        };
      },
    }),

    getSearchedUsers: builder.query<GetSearchedUserResponse, { searchString: string, category: string }>({
      query: (data) => {
        return {
          url: "users/getUsers",
          method: "GET",
          params: { searchString: data?.searchString, category: data?.category },
        };
      }
    }),

    getCategories: builder.query<CategoryResponse, void>({
      query: () => {
        return {
          url: "users/category",
          method: "GET",
        };
      }
    }),

    loginUser: builder.mutation<LoginResponse, Loginuser>({
      query: (body) => {
        return {
          url: "auth/login",
          method: "POST",
          body,
        };
      },
    }),

    forgotPasswordOtp: builder.mutation<void, ForgotPasswordFormInputs>({
      query: (body) => {
        return {
          url: "users/passwordreset-otp",
          method: "POST",
          body,
        };
      },
    }),

    verifyOtp: builder.mutation<VerifyOtpResponse, otpData>({
      query: (body) => {
        return {
          url: "users/verify-otp",
          method: "POST",
          body,
        };
      },
    }),

    resetPassword: builder.mutation<void, resetPasswordData>({
      query: (body) => {
        return {
          url: "users/reset-password",
          method: "PUT",
          body,
        };
      },
    }),

    googleLogin: builder.mutation<socialAuthResponse, socialAuthData>({
      query: (body) => {
        return {
          url: "auth/google",
          method: "POST",
          body,
        };
      },
    }),

    linkedinLogin: builder.mutation<socialAuthResponse, socialAuthData>({
      query: (body) => {
        return {
          url: "auth/linkedin",
          method: "POST",
          body,
        };
      },
    }),

    facebookLogin: builder.mutation<socialAuthResponse, socialAuthData>({
      query: (body) => {
        return {
          url: "auth/facebook",
          method: "POST",
          body,
        };
      },
    }),

    chnagePassword: builder.mutation<void, ChangePasswordFormInput>({
      query: (body) => {
        return {
          url: "users/updatePassword",
          method: "PUT",
          body,
        };
      },
    }),

    reportUser: builder.mutation<void, { userId: string, reason: string }>({
      query: (body) => {
        return {
          url: "users/report",
          method: "POST",
          body,
        };
      },
    }),

    getTrendingUsers: builder.query<SuggestionResponse, void>({
      query: () => {
        return {
          url: "users/trending",
          method: "GET",
        };
      },
    }),

    getSuggestions: builder.query<SuggestionResponse, void>({
      query: () => {
        return {
          url: "users/suggestions",
          method: "GET",
        };
      },
    }),

    updateUser: builder.mutation<UpdateUserResponse, { id: string, data: UpdateUserFormInput }>({
      query: ({ id, data }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    switchProfile: builder.mutation<any, void>({
      query: () => {
        return {
          url: "users/switchProfile",
          method: "POST",
        };
      },
    }),

    getBlockList: builder.query<BlockListData, void>({
      query: () => {
        return {
          url: "users/blocklist",
          method: "GET",
        };
      },
    }),

    unBlockUser: builder.mutation<void, string>({
      query: (id) => {
        return {
          url: `users/unblock/${id}`,
          method: "DELETE",
        };
      },
    }),

    blockUser: builder.mutation<void, blockUserInputs>({
      query: (body) => {
        return {
          url: `users/block/`,
          method: "POST",
          body,
        };
      },
    }),

    // post routes
    getPosts: builder.query<GetPostsResponse, GetPostsParams>({
      query: (params) => {
        return {
          url: "/posts/",
          method: "GET",
          params
        };
      },
    }),

    getPostById: builder.query<PostResponse, { id: string }>({
      query: (data) => {
        return {
          url: `/posts/${data.id}/post/`,
          method: "GET",
        };
      },
    }),

    getBookmarks: builder.query<GetPostsResponse, GetPostsParams>({
      query: (params) => {
        return {
          url: "/posts/bookmarks",
          method: "GET",
          params
        };
      },
    }),

    uploadMedia: builder.mutation<{ data: string[] }, FormData>({
      query: (formData) => {
        return {
          url: '/posts/upload',
          method: 'POST',
          body: formData,
        };
      },
    }),

    createPost: builder.mutation<void, NewPost>({
      query: (formData) => {
        return {
          url: '/posts/',
          method: 'POST',
          body: formData,
        };
      },
    }),

    updatePost: builder.mutation<UpdatePostResponse, { id: string, body: NewPost }>({
      query: ({ id, body }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        body,
      }),
    }),

    likePost: builder.mutation<void, { _id: string }>({
      query: (params) => ({
        url: `/posts/${params._id}/like`,
        method: 'POST',
      }),
    }),

    bookmarkPost: builder.mutation<void, { type: string, _id: string }>({
      query: (params) => ({
        url: `/posts/${params._id}/${params.type}/bookmark`,
        method: 'POST',
      }),
    }),

    deletePost: builder.mutation<void, string>({
      query: (postId) => {
        return {
          url: `/posts/${postId}`,
          method: "DELETE",
        };
      },
    }),

    purchasePost: builder.mutation<void, { id: string, paymentMethod: string }>({
      query: (data) => ({
        url: `/posts/${data.id}/purchase`,
        method: 'POST',
        body: { paymentMethod: data.paymentMethod },
      }),
    }),

    sendTip: builder.mutation<void, { id: string, tipAmount: number }>({
      query: (data) => ({
        url: `/posts/send-tip`,
        method: 'POST',
        body: { postId: data.id, tipAmount: data.tipAmount },
      }),
    }),


    getComments: builder.query<GetCommentsResponse, { postId: string; page: number; limit: number }>({
      query: ({ postId, page, limit }) => ({
        url: `/posts/${postId}/comments`,
        method: "GET",
        params: {
          page,
          limit,
        },
      }),
    }),

    addComment: builder.mutation<void, { postId: string; comment: string }>({
      query: ({ postId, comment }) => ({
        url: `/comments/${postId}/`,
        method: 'POST',
        body: { comment },
      }),
    }),

    deleteComment: builder.mutation<void, string>({
      query: (id) => {
        return {
          url: `/comments/${id}`,
          method: "DELETE",
        };
      },
    }),

    getReplies: builder.query<GetRepliesResponse, { commentId: string; page: number; limit: number }>({
      query: ({ commentId, page, limit }) => ({
        url: `/comments/${commentId}/replies`,
        method: "GET",
        params: {
          page,
          limit,
        },
      }),
    }),

    addReply: builder.mutation<void, { id: string; comment: string }>({
      query: ({ id, comment }) => ({
        url: `/comments/${id}/reply`,
        method: 'POST',
        body: { comment },
      }),
    }),

    markNotInterested: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/posts/${id}/not-interested`,
        method: 'POST',
      }),
    }),

    // chat apis
    getUnseenCount: builder.query<{ data: { unseenCount: number } }, void>({
      query: () => ({
        url: `/conversations/unseen-count`,
        method: "GET",
      }),
    }),

    getConversations: builder.query<conversationsResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: `/conversations/`,
        method: "GET",
        params: {
          page,
          limit,
        },
      }),
    }),

    getMessages: builder.query<MessageResponse, { id: string, page: number; limit: number }>({
      query: ({ id, page, limit }) => ({
        url: `/conversations/${id}/messages`,
        method: "GET",
        params: {
          page,
          limit,
        },
      }),
    }),

    sendMessage: builder.mutation<MessageResponse, { to: string; message: string }>({
      query: ({ to, message }) => ({
        url: `/conversations/`,
        method: "POST",
        body: {
          to,
          message,
        },
      }),
    }),

    deleteConversation: builder.mutation<void, string>({
      query: (id) => {
        return {
          url: `/conversations/${id}`,
          method: "DELETE",
        };
      },
    }),

    searchUser: builder.query<searchConversationResponse, { searchString: string }>({
      query: ({ searchString }) => `conversations/search?searchString=${encodeURIComponent(searchString)}`,
    }),

    //orders apis
    getOrderHistory: builder.query<OrderHistoryResponse, TableDataInputs>({
      query: (TableDataInputs) => ({
        url: `/orders/`,
        method: "GET",
        params: TableDataInputs
      }),
    }),

    updateOrderStatus: builder.mutation<void, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: "PUT",
        body: { status: status }
      }),
    }),

    placeOrder: builder.mutation<void, Order>({
      query: (body) => ({
        url: `/orders/`,
        method: "POST",
        body
      }),
    }),

    // product apis
    getProductById: builder.query<GetProductResponse, { id: string }>({
      query: (params) => ({
        url: `/products/${params.id}`,
        method: "GET",
      }),
    }),

    getProducts: builder.query<GetMyProductsResponse, TableDataInputs>({
      query: (TableDataInputs) => ({
        url: `/products/`,
        method: "GET",
        params: TableDataInputs
      }),
    }),

    addProduct: builder.mutation<void, addProductInput>({
      query: (Product) => ({
        url: `/products/`,
        method: 'POST',
        body: Product,
      }),
    }),

    updateProduct: builder.mutation<void, { id: string, body: updateProductInput }>({
      query: ({ id, body }) => ({
        url: `/products/${id}/`,
        method: "PUT",
        body
      }),
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => {
        return {
          url: `/products/${id}`,
          method: "DELETE",
        };
      },
    }),

    // payment apis
    getEarning: builder.query<EarningsHistoryResponse, TableDataInputs>({
      query: (TableDataInputs) => ({
        url: `/payments/earning`,
        method: "GET",
        params: TableDataInputs
      }),
    }),

    getBalance: builder.query<BalanceResponse, void>({
      query: () => ({
        url: `/payments/balance`,
        method: "GET",
      }),
    }),

    getPayouts: builder.query<PayoutsResponse, TableDataInputs>({
      query: (TableDataInputs) => ({
        url: `/payments/payout-history`,
        method: "GET",
        params: TableDataInputs
      }),
    }),

    requestPayout: builder.mutation<void, { amount: string | number, currency: string }>({
      query: ({ amount, currency }) => ({
        url: `/payments/create-payout`,
        method: 'POST',
        body: { amount: amount, currency: currency },
      }),
    }),

    saveBankDetail: builder.mutation<void, BankDetailsForm>({
      query: (body) => ({
        url: `/payments/bank-account`,
        method: 'POST',
        body,
      }),
    }),

    makePayment: builder.mutation<MakePaymentResponse, PaymentInput>({
      query: (body) => ({
        url: `/payments/create-payment`,
        method: 'POST',
        body,
      }),
    }),

    connectAccount: builder.mutation<connectAccountResponse, void>({
      query: () => ({
        url: `/payments/connect-account`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    addConnectAccount: builder.mutation<void, { stripeAccountId: string }>({
      query: (body) => ({
        url: `/payments/add-account`,
        method: 'POST',
        body
      }),
    }),

    paymentHistory: builder.query<PaymentHistoryResponse, TableDataInputs>({
      query: (TableDataInputs) => ({
        url: `/payments/history`,
        method: "GET",
        params: TableDataInputs
      }),
    }),

    addCard: builder.mutation<void, AddCardFormInput>({
      query: (body) => ({
        url: `/payments/add-card`,
        method: 'POST',
        body
      }),
    }),

    getCards: builder.query<GetCardResponse, void>({
      query: () => ({
        url: `/payments/cards`,
        method: "GET",
      }),
    }),

    deleteCard: builder.mutation<void, string>({
      query: (id) => {
        return {
          url: `/payments/${id}/card`,
          method: "DELETE",
        };
      },
    }),

    // address routes
    addAddress: builder.mutation<void, AddressInput>({
      query: (body) => ({
        url: `/users/address`,
        method: 'POST',
        body,
      }),
    }),

    getAddress: builder.query<AddressResponse, void>({
      query: () => ({
        url: `/users/address`,
        method: 'GET',
      }),
    }),

    updateAddress: builder.mutation<void, { id: string, body: AddressInput }>({
      query: ({ id, body }) => ({
        url: `/users/address/${id}/`,
        method: "PUT",
        body
      }),
    }),
    getSubscriptions: builder.query<SubscriptionResponse, TableDataInputs>({
      query: (params) => ({
        url: `/subscription/`,
        method: 'GET',
        params
      }),
    }),

    cancelSubscription: builder.mutation<void, { id: string }>({
      query: (data) => {
        return {
          url: `/subscription/${data.id}/cancel`,
          method: "DELETE",
        };
      },
    }),

    // walletRoutes

    depositBalance: builder.mutation<{ data: { id: string } }, { amount: number }>({
      query: (body) => ({
        url: `/wallet/deposit`,
        method: 'POST',
        body,
      }),
    }),

    getWalletBalance: builder.query<{ data: { balance: number } }, void>({
      query: () => ({
        url: `/wallet/balance`,
        method: 'GET',
      }),
    }),

    payFromWallet: builder.mutation<void, { amount: number, creatorId: string, description: string }>({
      query: (body) => ({
        url: `/wallet/pay`,
        method: 'POST',
        body,
      }),
    }),

    getTransactions: builder.query<GetTransactionsResponse, TableDataInputs>({
      query: (params) => ({
        url: `/wallet/transactions`,
        method: 'GET',
        params
      }),
    }),

  }),
});


export const {
  useGetUserByIdQuery,
  useLoginUserMutation,
  useRegisterUserMutation,
  useForgotPasswordOtpMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useGoogleLoginMutation,
  useLinkedinLoginMutation,
  useFacebookLoginMutation,
  useGetPostsQuery,
  useDeletePostMutation,
  useGetCommentsQuery,
  useChnagePasswordMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useGetBlockListQuery,
  useUploadMediaMutation,
  useCreatePostMutation,
  useDeleteCommentMutation,
  useGetConversationsQuery,
  useUnBlockUserMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useDeleteConversationMutation,
  useBlockUserMutation,
  useGetRepliesQuery,
  useAddReplyMutation,
  useGetOrderHistoryQuery,
  useUpdateOrderStatusMutation,
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetEarningQuery,
  useUpdatePostMutation,
  useGetPayoutsQuery,
  useRequestPayoutMutation,
  useSaveBankDetailMutation,
  useGetSearchedUsersQuery,
  useAddAddressMutation,
  useGetAddressQuery,
  useUpdateAddressMutation,
  useGetProductByIdQuery,
  useLazySearchUserQuery,
  useLikePostMutation,
  useAddCommentMutation,
  useBookmarkPostMutation,
  useGetBookmarksQuery,
  useGetSubscriptionsQuery,
  useMakePaymentMutation,
  useConnectAccountMutation,
  useAddConnectAccountMutation,
  usePlaceOrderMutation,
  useDepositBalanceMutation,
  useGetWalletBalanceQuery,
  usePayFromWalletMutation,
  useGetTransactionsQuery,
  usePaymentHistoryQuery,
  useAddCardMutation,
  useGetCardsQuery,
  useDeleteCardMutation,
  useGetSuggestionsQuery,
  useGetTrendingUsersQuery,
  usePurchasePostMutation,
  useGetUnseenCountQuery,
  useReportUserMutation,
  useMarkNotInterestedMutation,
  useSendTipMutation,
  useGetPostByIdQuery,
  useGetBalanceQuery,
  useCancelSubscriptionMutation,
  useSwitchProfileMutation,
  useGetCategoriesQuery
} = api;
