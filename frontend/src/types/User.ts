type User = {
  id: string;
  name: string;
  password: string;
  photo: string | null;
  points: number;
  createdAt: Date;
  updatedAt: Date;
};

export default User;
