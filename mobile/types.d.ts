type TPosts = {
  status: number;
  author: {
    id: string;
    firstname: string;
    lastname: string;
    imgUrl: string | null;
    username: string;
    bio: string;
  };
  imgUrl: string;
  liked: boolean;
  id: string;
  userId: string;
  caption: string | null;
  allowComments: boolean | null;
  likesCount: number | null;
  createdAt: Date;
  updatedAt: Date;
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
