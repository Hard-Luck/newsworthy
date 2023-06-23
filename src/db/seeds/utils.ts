import type { Comment } from "../data/development-data";

interface IDLookup {
  [key: string]: number;
}

export const convertTimestampToDate = ({
  created_at,
  ...otherProperties
}: any) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

export const createRef = (arr: any[], key: string, value: string) => {
  return arr.reduce((ref: IDLookup, element: any) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

export const formatComments = (comments: Comment[], idLookup: IDLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to as string];
    return {
      article_id,
      author: created_by,
      ...convertTimestampToDate(restOfComment),
    };
  });
};
