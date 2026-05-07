import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchComments, postComment, deleteComment } from '../api/defaults';
import { useAuth } from '../context/AuthContext';
import type { CommentDto, CreateCommentDto, PagedResult } from '../types';
import toast from 'react-hot-toast';

interface CommentSectionProps {
  defaultId: number;
}

export default function CommentSection({ defaultId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadPage = useCallback(async (pageNumber: number, append = false) => {
    try {
      const result: PagedResult<CommentDto> = await fetchComments(defaultId, pageNumber, 10);
      if (append) {
        setComments(prev => [...prev, ...result.items]);
      } else {
        setComments(result.items);
      }
      setTotalPages(result.totalPages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    }
  }, [defaultId]);

  useEffect(() => {
    setLoading(true);
    loadPage(1).finally(() => setLoading(false));
  }, [loadPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const authorName = isAnonymous ? 'Аноним' : user?.username || 'Аноним';
      const newComment: CreateCommentDto = {
        authorName: authorName,
        authorEmail: user?.email || null,
        content: content.trim(),
      };
      await postComment(defaultId, newComment);
      // После добавления перезагружаем первую страницу (можно добавить комментарий в начало, но для согласованности перезагрузим)
      await loadPage(1);
      setContent('');
      setIsAnonymous(false);
      toast.success('Комментарий добавлен');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка отправки');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm('Удалить комментарий?')) return;
    try {
      await deleteComment(defaultId, commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      toast.success('Комментарий удалён');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка удаления');
    }
  };

  const handleLoadMore = async () => {
    if (page >= totalPages || loadingMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      await loadPage(nextPage, true);
      setPage(nextPage);
    } catch (err) {
      toast.error('Не удалось загрузить ещё');
    } finally {
      setLoadingMore(false);
    }
  };

  const canDelete = (comment: CommentDto) => {
    if (!user) return false;
    if (user.role === 'Admin') return true;
    return comment.userId != null && comment.userId === user.id; // только зарегистрированный автор
  };

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
        {!loading && comments.length === 0 && (
          <p className="text-gray-400">Пока нет комментариев. Будьте первым!</p>
        )}
        {comments.map(comment => (
          <div key={comment.id} className="border border-gray-700 rounded p-4 bg-gray-800 relative">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-white">{comment.authorName}</span>
              <span className="text-sm text-gray-400">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-300">{comment.content}</p>
            {canDelete(comment) && (
              <button
                onClick={() => handleDelete(comment.id)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-300 text-sm"
                title="Удалить"
              >
                🗑️
              </button>
            )}
          </div>
        ))}
      </div>

      {page < totalPages && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50 transition"
          >
            {loadingMore ? 'Загрузка...' : 'Загрузить ещё'}
          </button>
        </div>
      )}
    </div>
  );
}