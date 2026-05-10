// CommentSection.tsx (полный код)
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchComments, postComment, deleteComment, updateComment } from '../api/defaults';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
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

  // Редактирование
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

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

  const handleEditStart = (comment: CommentDto) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleEditSave = async (commentId: number) => {
    if (!editContent.trim()) return;
    setSavingEdit(true);
    try {
      await updateComment(defaultId, commentId, editContent.trim());
      setComments(prev =>
        prev.map(c => (c.id === commentId ? { ...c, content: editContent.trim() } : c))
      );
      setEditingCommentId(null);
      setEditContent('');
      toast.success('Комментарий обновлён');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setSavingEdit(false);
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
    return comment.userId != null && comment.userId === user.id;
  };

  const canEdit = (comment: CommentDto) => {
    if (!user) return false;
    if (user.role === 'Admin') return true;
    return comment.userId != null && comment.userId === user.id;
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-white">Комментарии ({comments.length})</h2>

      {user ? (
        <Card className="p-4 mb-6">
          <form onSubmit={handleSubmit}>
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
              <Button type="submit" variant="accent" disabled={submitting}>
                {submitting ? 'Отправка...' : 'Отправить'}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card className="p-4 mb-6 text-center text-gray-400">
          <Link to="/login" className="text-teal-400 hover:text-teal-300 underline">
            Войдите
          </Link>
          , чтобы оставить комментарий
        </Card>
      )}

      {error && <div className="text-red-400 mb-4">{error}</div>}

      <div className="space-y-4">
        {!loading && comments.length === 0 && (
          <p className="text-gray-400">Пока нет комментариев. Будьте первым!</p>
        )}
        {comments.map(comment => {
          const isEditing = editingCommentId === comment.id;
          return (
            <Card key={comment.id} className="p-4 relative">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-white">{comment.authorName}</span>
              </div>
              {isEditing ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 bg-gray-900 border border-gray-600 rounded text-white text-sm mb-2"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => handleEditSave(comment.id)}
                      disabled={savingEdit}
                    >
                      {savingEdit ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={handleEditCancel}>
                      Отмена
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300">{comment.content}</p>
              )}
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-400">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
                <div className="flex gap-2">
                  {canEdit(comment) && !isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditStart(comment)}
                      title="Редактировать"
                    >
                      ✎
                    </Button>
                  )}
                  {canDelete(comment) && !isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(comment.id)}
                      title="Удалить"
                    >
                      🗑️
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {page < totalPages && (
        <div className="flex justify-center mt-4">
          <Button
            variant="secondary"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Загрузка...' : 'Загрузить ещё'}
          </Button>
        </div>
      )}
    </div>
  );
}