import { Article, Comment, Topic, User } from "../../../types/api";
import articles from "./articles";
import comments from "./comments";
import topics from "./topics";
import users from "./users";



const articleData: Article[] = articles
const commentData: Comment[] = comments
const topicData: Topic[] = topics
const userData: User[] = users;
export default { articleData, commentData, topicData, userData };