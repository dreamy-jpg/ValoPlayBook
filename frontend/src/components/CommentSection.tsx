import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchComments, postComment } from '../api/defaults';
import { useAuth } from '../context/AuthContext';
import type { CommentDto, CreateCommentDto } from '../types';
import toast from 'react-hot-toast';

interface CommentSectionProps {
  defaultId: number;
}

export default function CommentSection({ defaultId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadComments = async () => {
    try {
      const data = await fetchComments(defaultId);
      setComments(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [defaultId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      // Если пользователь авторизован, используем его имя, иначе не должно быть возможности отправить
      const authorName = isAnonymous ? 'Аноним' : user?.username || 'Аноним';
      const newComment: CreateCommentDto = {
        authorName: authorName,
        authorEmail: user?.email || null, // Можно оставить email для зарегистрированных
        content: content.trim(),
      };
      const added = await postComment(defaultId, newComment);
      setComments(prev => [added, ...prev]);
      setContent('');
      setIsAnonymous(false);
      toast.success('Комментарий добавлен');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка отправки');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-gray-400">Загрузка комментариев...</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-white">Комментарии ({comments.length})</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded border border-gray-700 mb-6">
          <textarea
            placeholder="Ваш комментарий *"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 bg-gray-900 border border-gray-600 rounded mb-3 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500"
            rows={3}
            required
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="mr-2 rounded border-gray-600 bg-gray-800 text-teal-500 focus:ring-teal-500"
              />
              Анонимный комментарий
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:opacity-50 transition"
            >
              {submitting ? 'Отправка...' : 'Отправить'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-800 p-4 rounded border border-gray-700 mb-6 text-center text-gray-400">
          <Link to="/login" className="text-teal-400 hover:text-teal-300 underline">
            Войдите
          </Link>
          , чтобы оставить комментарий
        </div>
      )}

      {error && <div className="text-red-400 mb-4">{error}</div>}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-400">Пока нет комментариев. Будьте первым!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="border border-gray-700 rounded p-4 bg-gray-800">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-white">{comment.authorName}</span>
                <span className="text-sm text-gray-400">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-300">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}