type Challenge = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  completedAt: Date | null;
  checkedAt: Date | null;
  checkerName: string | null;
  authorId: string;
  points: number;
  private: boolean;
};

export default Challenge;
