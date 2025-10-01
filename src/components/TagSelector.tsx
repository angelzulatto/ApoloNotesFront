import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Tag } from '../types';

interface TagSelectorProps {
  tags: Tag[];
  selectedTagIds: number[];
  onChange: (tagIds: number[]) => void;
  error?: string;
}

export const TagSelector = ({ tags, selectedTagIds, onChange, error }: TagSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedTags = tags.filter(tag => selectedTagIds.includes(tag.id));
  const availableTags = tags.filter(tag => !selectedTagIds.includes(tag.id));

  const handleToggleTag = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter(id => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.tag-selector')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="tag-selector relative">
      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[50px] cursor-pointer hover:border-gray-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedTags.length === 0 ? (
          <span className="text-gray-400">Select tags...</span>
        ) : (
          selectedTags.map(tag => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tag.name}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleTag(tag.id);
                }}
                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))
        )}
      </div>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

      {isOpen && availableTags.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {availableTags.map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleToggleTag(tag.id)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
