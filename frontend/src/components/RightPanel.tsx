import { useState } from 'react';
import AgentEditor from './AgentEditor';
import type { PositionDto, StepAbilityDto, AgentDto, AbilityDto } from '../types';

interface RightPanelProps {
  stepNumber?: number;
  comment?: string;
  showEditor: boolean;
  editingAgent: PositionDto | null;
  agents: AgentDto[];
  agentAbilities: Record<number, AbilityDto[]>;
  stepAbilities: StepAbilityDto[];
  selectedStepId: number;
  attackerAgentIds: number[];
  defenderAgentIds: number[];
  creatingSlot: { side: 'attack' | 'defense' } | null;
  editMode: boolean;
  isAdmin: boolean;
  defaultId: number;
  onClose: () => void;
  onPositionUpdated: (pos: PositionDto) => void;
  onAgentReplaced: (pos: PositionDto) => void;
  onAbilityAdded: (ability: StepAbilityDto) => void;
  onAbilityDeleted: (abilityId: number) => void;
  onAbilityUpdated: (ability: StepAbilityDto) => void;   // новый пропс
  onCreateAgent: (agentId: number) => void;
  onCommentUpdate: (stepId: number, comment: string) => void;
}

export default function RightPanel({
  stepNumber,
  comment,
  showEditor,
  editingAgent,
  agents,
  agentAbilities,
  stepAbilities,
  selectedStepId,
  attackerAgentIds,
  defenderAgentIds,
  creatingSlot,
  editMode,
  isAdmin,
  defaultId,
  onClose,
  onPositionUpdated,
  onAgentReplaced,
  onAbilityAdded,
  onAbilityDeleted,
  onAbilityUpdated,   // новый пропс
  onCreateAgent,
  onCommentUpdate,
}: RightPanelProps) {
  const [editingComment, setEditingComment] = useState(false);
  const [draftComment, setDraftComment] = useState(comment || '');
  const [savingComment, setSavingComment] = useState(false);

  const handleSaveComment = async () => {
    if (!selectedStepId) return;
    setSavingComment(true);
    try {
      onCommentUpdate(selectedStepId, draftComment);
      setEditingComment(false);
    } finally {
      setSavingComment(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 text-white">
        Комментарий к шагу {stepNumber}
      </h2>

      {isAdmin && editMode ? (
        <>
          <div className="bg-gray-800 p-4 rounded border border-gray-700">
            {editingComment ? (
              <div>
                <textarea
                  value={draftComment}
                  onChange={e => setDraftComment(e.target.value)}
                  className="w-full p-2 bg-gray-900 border border-gray-600 rounded text-white text-sm"
                  rows={3}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSaveComment}
                    disabled={savingComment}
                    className="px-3 py-1 bg-teal-600 text-white rounded text-sm hover:bg-teal-700 disabled:opacity-50"
                  >
                    {savingComment ? 'Сохранение...' : 'Сохранить'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingComment(false);
                      setDraftComment(comment || '');
                    }}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-500"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-300">{comment || 'Нет комментария'}</p>
            )}
          </div>
          {!editingComment && (
            <button
              onClick={() => {
                setDraftComment(comment || '');
                setEditingComment(true);
              }}
              className="mt-2 px-3 py-1 bg-teal-500 text-white rounded text-sm hover:bg-teal-600 transition"
            >
              ✎ Редактировать
            </button>
          )}
        </>
      ) : (
        <div className="bg-gray-800 p-4 rounded border border-gray-700">
          <p className="text-gray-300">{comment || 'Нет комментария'}</p>
        </div>
      )}

      {showEditor && (
        <AgentEditor
          position={editingAgent}
          allAgents={agents}
          agentAbilities={agentAbilities}
          stepAbilities={stepAbilities}
          selectedStepId={selectedStepId}
          attackerAgentIds={attackerAgentIds}
          defenderAgentIds={defenderAgentIds}
          creatingSlot={creatingSlot}
          onClose={onClose}
          onPositionUpdated={onPositionUpdated}
          onAgentReplaced={onAgentReplaced}
          onAbilityAdded={onAbilityAdded}
          onAbilityDeleted={onAbilityDeleted}
          onAbilityUpdated={onAbilityUpdated}   // передаём колбэк
          onCreateAgent={onCreateAgent}
        />
      )}
    </div>
  );
}