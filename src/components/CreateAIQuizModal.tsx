import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { X, Sparkles, Plus } from 'lucide-react';
import { quizManagementService } from '../services/quizManagement';
import { useToast } from '../hooks/use-toast';

interface CreateAIQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateAIQuizModal: React.FC<CreateAIQuizModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    numberOfQuestions: 5,
    tags: [] as string[],
    tagInput: ''
  });
  const { toast } = useToast();

  if (!isOpen) return null;

  const addTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.tagInput.trim()],
        tagInput: ''
      });
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.topic.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập chủ đề quiz",
        variant: "destructive",
      });
      return;
    }

    if (formData.numberOfQuestions < 1 || formData.numberOfQuestions > 20) {
      toast({
        title: "Lỗi",
        description: "Số câu hỏi phải từ 1 đến 20",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await quizManagementService.createAIQuiz({
        topic: formData.topic,
        numberOfQuestions: formData.numberOfQuestions,
        tags: formData.tags
        
      });
      

      toast({
        title: "Thành công",
        description: "Tạo quiz bằng AI thành công!",
      });

      onSuccess();
      onClose();

      // Reset form
      setFormData({
        topic: '',
        numberOfQuestions: 5,
        tags: [],
        tagInput: ''
      });

    } catch (error: any) {
      console.error('Error creating AI quiz:', error);
      const message = error.response?.data?.message || 'Lỗi tạo quiz bằng AI';
      console.log({
  topic: formData.topic,
  numberOfQuestions: formData.numberOfQuestions,
  tags: formData.tags
});
      toast({
        title: "Lỗi",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span>Tạo Quiz bằng AI</span>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Chủ đề Quiz *</label>
              <Input
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="VD: Lịch sử Việt Nam, Toán học, Khoa học..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Mô tả chủ đề bạn muốn tạo quiz, AI sẽ tự động tạo câu hỏi phù hợp
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Số câu hỏi</label>
              <Input
                type="number"
                value={formData.numberOfQuestions}
                onChange={(e) => setFormData({ ...formData, numberOfQuestions: parseInt(e.target.value) || 5 })}
                min="1"
                max="20"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Từ 1 đến 20 câu hỏi
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags (tùy chọn)</label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={formData.tagInput}
                  onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                  placeholder="Nhập tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-sm flex items-center space-x-1">
                    <span>{tag}</span>
                    <button type="button" onClick={() => removeTag(index)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                <Sparkles className="h-4 w-4 inline mr-1" />
                AI sẽ tự động tạo câu hỏi trắc nghiệm với 4 đáp án dựa trên chủ đề bạn cung cấp.
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang tạo...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Tạo Quiz</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};