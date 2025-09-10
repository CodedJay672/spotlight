type TPosts = {
  id: string;
  content: string | null;
  likesCount: number | null;
  isLiked: {
    id: likes.id;
    postId: likes.postId;
    userId: likes.userId;
  };
  author: {
    id: string;
    firstName: string;
    lastname: string;
    bio: string | null;
    profileImg: string;
  };
  assets: {
    id: string;
    imgUrl: string;
  };
  createdAt: Date;
};

type TPostsResponse = {
  status: number;
  success: boolean;
  message: string;
  data: TPost[];
};

type TLikeResponse = {
  status: number;
  success: boolean;
  message: string;
  data: boolean;
};

type TCommentResponse = {
  id: string;
  userId: string;
  postId: string;
  caption: string;
  createdAt: string;
  updtedAt: string;
};

type TAddCommentResponse = {
  status: number;
  success: boolean;
  message: string;
  data: TCommentResponse;
};

type TCommentWithDetails = {
  id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: string;
  updtedAt: string;
  author: {
    id: string;
    username: string | null;
    imgUrl: string;
  };
};

type TGetComment = {
  success: true;
  message: string;
  data: TCommentWithDetails[];
};
