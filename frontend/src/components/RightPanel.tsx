import { useState } from 'react';
import AgentEditor from './AgentEditor';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
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
  onAbilityUpdated: (ability: StepAbilityDto) => void;
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
  onAbilityUpdated,
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
          <Card className="p-4">
            {editingComment ? (
              <div>
                <textarea
                  value={draftComment}
                  onChange={e => setDraftComment(e.target.value)}
                  className="w-full p-2 bg-dark-300 border border-gray-600 rounded text-white text-sm"
                  rows={3}
                />
                <div className="flex gap-2 mt-2">
                  <Button variant="primary" size="sm" onClick={handleSaveComment} disabled={savingComment}>
                    {savingComment ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditingComment(false);
                      setDraftComment(comment || '');
                    }}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-300">{comment || 'Нет комментария'}</p>
            )}
          </Card>
          {!editingComment && (
            <Button
              variant="accent"
              size="sm"
              className="mt-2"
              onClick={() => {
                setDraftComment(comment || '');
                setEditingComment(true);
              }}
            >
              ✎ Редактировать
            </Button>
          )}
        </>
      ) : (
        <Card className="p-4">
          <p className="text-gray-300">{comment || 'Нет комментария'}</p>
        </Card>
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
          onAbilityUpdated={onAbilityUpdated}
          onCreateAgent={onCreateAgent}
        />
      )}
    </div>
  );
}