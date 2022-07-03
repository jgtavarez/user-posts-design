import { createContext, useState, useContext, useEffect } from 'react';
import { Post } from '../../interfaces/posts';
import http from '../../api/http';
import { AuthContext } from '../auth/AuthContext';
import { User } from '../../interfaces/users';

type PostsContextProps = {
    posts: Post[];
    getPosts: () => Promise<void>;
    getPostById: (id: string) => Promise<Post>;
}

export const PostsContext = createContext({} as PostsContextProps);

export const PostsProvider = ({ children }: any) => {

    const [posts, setPosts] = useState<Post[]>([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        getPosts();
    }, [])

    const getPosts = async () => {
        const { id } = user as User;

        const resp = await http.get<Post[]>(`/users/${id}/posts`, {
            headers: {
                Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`
            }
        })

        setPosts([...resp.data]);
    }

    const getPostById = async (id: string) => {
        const resp = await http.get<Post>(`/posts/${id}`, {
            headers: {
                Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`
            }
        });

        return resp.data;
    };

    return (
        <PostsContext.Provider value={{
            posts,
            getPosts,
            getPostById
        }}>
            {children}
        </PostsContext.Provider>
    )
}