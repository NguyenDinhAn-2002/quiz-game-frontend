import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import {
  X,
  Plus,
  Trash2,
  Upload,
  Eye,
  Edit3,
  Save,
  ArrowLeft,
  ArrowRight,
  Image,
  Volume2,
  Video,
  FileText,
} from 'lucide-react';
import { quizManagementService } from '../services/quizManagement';
import { useToast } from '../hooks/use-toast';

type MediaType = 'text' | 'image' | 'audio' | 'video';
type QuestionType = 'single' | 'multiple' | 'order' | 'input';

interface QuestionForm {
  questionText: string;
  questionType: QuestionType;
  options: Array<{ text: string; isCorrect: boolean }>;
  timeLimit: number;
  media: {
    type: MediaType;
    url?: string;
    file?: File;
  };
}

interface QuizEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const QuizEditor: React.FC<QuizEditorProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    tagInput: '',
  });
  const [questions, setQuestions] = useState<QuestionForm[]>([
    {
      questionText: '',
      questionType: 'single',
      options: [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
      ],
      timeLimit: 30,
      media: { type: 'text' },
    },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const { toast } = useToast();

  if (!isOpen) return null;
  const currentQuestion = questions[currentQuestionIndex];

  const addQuestion = () => {
    const newQuestion: QuestionForm = {
      questionText: '',
      questionType: 'single',
      options: [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
      ],
      timeLimit: 30,
      media: { type: 'text' },
    };
    setQuestions(prev => [...prev, newQuestion]);
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) return;
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
    if (currentQuestionIndex >= updated.length) {
      setCurrentQuestionIndex(updated.length - 1);
    }
  };

  const updateCurrentQuestion = (field: keyof QuestionForm, value: any) => {
    setQuestions(prev => {
      const arr = [...prev];
      arr[currentQuestionIndex] = { ...arr[currentQuestionIndex], [field]: value };
      return arr;
    });
  };

  const updateOption = (
    optionIndex: number,
    field: 'text' | 'isCorrect',
    value: string | boolean
  ) => {
    setQuestions(prev => {
      const arr = [...prev];
      const q = arr[currentQuestionIndex];
      q.options[optionIndex] = {
        ...q.options[optionIndex],
        [field]: value,
      };
      if (field === 'isCorrect' && value === true && q.questionType === 'single') {
        q.options.forEach((opt, idx) => {
          if (idx !== optionIndex) opt.isCorrect = false;
        });
      }
      return arr;
    });
  };

  const addOption = () => {
    setQuestions(prev => {
      const arr = [...prev];
      arr[currentQuestionIndex].options.push({ text: '', isCorrect: false });
      return arr;
    });
  };

  const removeOption = (optionIndex: number) => {
    setQuestions(prev => {
      const arr = [...prev];
      const opts = arr[currentQuestionIndex].options;
      if (opts.length <= 2) return arr;
      arr[currentQuestionIndex].options = opts.filter((_, i) => i !== optionIndex);
      return arr;
    });
  };

  const addTag = () => {
    const t = formData.tagInput.trim();
    if (t && !formData.tags.includes(t)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, t],
        tagInput: '',
      }));
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleMediaUpload = (file: File) => {
    const mediaType: MediaType = file.type.startsWith('image/')
      ? 'image'
      : file.type.startsWith('video/')
      ? 'video'
      : file.type.startsWith('audio/')
      ? 'audio'
      : 'text';

    updateCurrentQuestion('media', {
      type: mediaType,
      url: URL.createObjectURL(file),
      file,
    });
  };

  const getMediaIcon = (type: MediaType) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Volume2 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const renderQuestionTypeOptions = () => {
    switch (currentQuestion.questionType) {
      case 'input':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">Câu trả lời mẫu</label>
            <Input
              value={currentQuestion.options[0]?.text || ''}
              onChange={e => updateOption(0, 'text', e.target.value)}
              placeholder="Nhập câu trả lời đúng"
            />
          </div>
        );

      case 'order':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Các lựa chọn (theo thứ tự đúng)
            </label>
            {currentQuestion.options.map((opt, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="text-sm font-medium w-8">{idx + 1}.</span>
                <Input
                  value={opt.text}
                  onChange={e => updateOption(idx, 'text', e.target.value)}
                  placeholder={`Lựa chọn ${idx + 1}`}
                  className="flex-1"
                />
                {currentQuestion.options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeOption(idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addOption}>
              <Plus className="h-4 w-4 mr-2" /> Thêm lựa chọn
            </Button>
          </div>
        );

      default: // single, multiple
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">Đáp án</label>
            {currentQuestion.options.map((opt, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input
                  type={
                    currentQuestion.questionType === 'single'
                      ? 'radio'
                      : 'checkbox'
                  }
                  name={`question-${currentQuestionIndex}-correct`}
                  checked={opt.isCorrect}
                  onChange={e =>
                    updateOption(idx, 'isCorrect', e.target.checked)
                  }
                />
                <Input
                  value={opt.text}
                  onChange={e => updateOption(idx, 'text', e.target.value)}
                  placeholder={`Đáp án ${idx + 1}`}
                  className="flex-1"
                />
                {currentQuestion.options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeOption(idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addOption}>
              <Plus className="h-4 w-4 mr-2" /> Thêm đáp án
            </Button>
          </div>
        );
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập tiêu đề quiz',
        variant: 'destructive',
      });
      return;
    }

    const validQuestions = questions.filter(
      q =>
        q.questionText.trim() &&
        (q.questionType === 'input' || q.options.some(o => o.isCorrect)) &&
        q.options.some(o => o.text.trim())
    );

    if (validQuestions.length === 0) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng thêm ít nhất một câu hỏi hợp lệ',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Build FormData so that question media files match backend expectation:
      //  - JSON part uses `mediaType` field per question
      //  - file uploads must be under keys `questionMedia_<index>`
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      formData.tags.forEach(tag => payload.append('tags[]', tag));
      if (thumbnail) {
        payload.append('thumbnail', thumbnail);
      }

      // Prepare questions JSON array including mediaType
      const questionsData = validQuestions.map((q, idx) => ({
        questionText: q.questionText,
        questionType: q.questionType,
        options:
          q.questionType === 'input'
            ? []
            : q.options.filter(o => o.text.trim()),
        timeLimit: q.timeLimit,
        mediaType: q.media.type, // backend will read `question.mediaType`
      }));
      payload.append('questions', JSON.stringify(questionsData));

      // Append each question's file under key `questionMedia_<index>`
      validQuestions.forEach((q, idx) => {
        if (q.media.file) {
          payload.append(`questionMedia_${idx}`, q.media.file);
        }
      });

      // Gọi service mới
      await quizManagementService.createQuizWithFormData(payload);

      toast({
        title: 'Thành công',
        description: 'Tạo quiz thành công!',
      });

      onSuccess();
      onClose();

      // Reset toàn bộ form
      setFormData({ title: '', description: '', tags: [], tagInput: '' });
      setThumbnail(null);
      setQuestions([
        {
          questionText: '',
          questionType: 'single',
          options: [
            { text: '', isCorrect: true },
            { text: '', isCorrect: false },
          ],
          timeLimit: 30,
          media: { type: 'text' },
        },
      ]);
      setCurrentQuestionIndex(0);
    } catch (err) {
      console.error('Error creating quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold">Quiz Editor</h2>
            <Badge variant="outline">{questions.length} câu hỏi</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={mode === 'edit' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('edit')}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
            <Button
              variant={mode === 'preview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('preview')}
            >
              <Eye className="h-4 w-4 mr-2" />
              Xem trước
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Question List */}
          <div className="w-64 bg-gray-50 border-r overflow-y-auto">
            <div className="p-4">
              <div className="space-y-2 mb-4">
                <Input
                  value={formData.title}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Tiêu đề quiz"
                  className="font-medium"
                />
                <Input
                  value={formData.description}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Mô tả"
                  className="text-sm"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const f = e.target.files?.[0] || null;
                    if (f) setThumbnail(f);
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Câu hỏi</span>
                  <Button size="sm" onClick={addQuestion}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {questions.map((q, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded cursor-pointer border ${
                      currentQuestionIndex === idx
                        ? 'bg-blue-100 border-blue-300'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setCurrentQuestionIndex(idx)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Câu {idx + 1}</span>
                      {questions.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={e => {
                            e.stopPropagation();
                            removeQuestion(idx);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {q.questionText || 'Chưa có nội dung'}
                    </p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {q.questionType}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={formData.tagInput}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, tagInput: e.target.value }))
                    }
                    placeholder="Nhập tag"
                    onKeyPress={e =>
                      e.key === 'Enter' && (e.preventDefault(), addTag())
                    }
                    className="flex-1"
                  />
                  <Button size="sm" onClick={addTag}>
                    +
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center space-x-1 text-xs"
                    >
                      <span>{tag}</span>
                      <button onClick={() => removeTag(index)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {mode === 'edit' ? (
              <div className="flex-1 overflow-y-auto p-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Câu hỏi {currentQuestionIndex + 1}</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentQuestionIndex === 0}
                          onClick={() =>
                            setCurrentQuestionIndex(idx => Math.max(0, idx - 1))
                          }
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentQuestionIndex === questions.length - 1}
                          onClick={() =>
                            setCurrentQuestionIndex(idx =>
                              Math.min(questions.length - 1, idx + 1)
                            )
                          }
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Question Text */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nội dung câu hỏi
                      </label>
                      <Input
                        value={currentQuestion.questionText}
                        onChange={e =>
                          updateCurrentQuestion('questionText', e.target.value)
                        }
                        placeholder="Nhập câu hỏi"
                        className="text-lg"
                      />
                    </div>

                    {/* Question Type & Time Limit */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Loại câu hỏi
                        </label>
                        <select
                          value={currentQuestion.questionType}
                          onChange={e =>
                            updateCurrentQuestion(
                              'questionType',
                              e.target.value as QuestionType
                            )
                          }
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="single">Một đáp án</option>
                          <option value="multiple">Nhiều đáp án</option>
                          <option value="order">Sắp xếp thứ tự</option>
                          <option value="input">Điền từ</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Thời gian (giây)
                        </label>
                        <Input
                          type="number"
                          value={currentQuestion.timeLimit}
                          onChange={e =>
                            updateCurrentQuestion(
                              'timeLimit',
                              parseInt(e.target.value)
                            )
                          }
                          min="5"
                          max="90"
                        />
                      </div>
                    </div>

                    {/* Media Upload */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Media (tùy chọn)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        {currentQuestion.media.url ? (
                          <div className="relative">
                            {currentQuestion.media.type === 'image' && (
                              <img
                                src={currentQuestion.media.url}
                                alt="Question media"
                                className="max-w-full h-auto max-h-64 mx-auto rounded"
                              />
                            )}
                            {currentQuestion.media.type === 'video' && (
                              <video
                                src={currentQuestion.media.url}
                                controls
                                className="max-w-full h-auto max-h-64 mx-auto rounded"
                              />
                            )}
                            {currentQuestion.media.type === 'audio' && (
                              <audio
                                src={currentQuestion.media.url}
                                controls
                                className="w-full"
                              />
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                updateCurrentQuestion('media', { type: 'text' })
                              }
                              className="absolute top-2 right-2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 mb-2">
                              Tải lên hình ảnh, video hoặc audio
                            </p>
                            <input
                              type="file"
                              accept="image/*,video/*,audio/*"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) handleMediaUpload(file);
                              }}
                              className="hidden"
                              id={`media-upload-${currentQuestionIndex}`}
                            />
                            <label
                              htmlFor={`media-upload-${currentQuestionIndex}`}
                            >
                              <Button variant="outline" asChild>
                                <span>Chọn file</span>
                              </Button>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Question Type Specific Options */}
                    {renderQuestionTypeOptions()}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="max-w-2xl mx-auto">
                  <Card className="p-8">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold mb-2">
                        {formData.title || 'Tiêu đề quiz'}
                      </h2>
                      <p className="text-gray-600">
                        {formData.description || 'Mô tả quiz'}
                      </p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          Câu {currentQuestionIndex + 1}
                        </h3>
                        <Badge>{currentQuestion.timeLimit}s</Badge>
                      </div>

                      <p className="text-xl mb-6">
                        {currentQuestion.questionText ||
                          'Nội dung câu hỏi...'}
                      </p>

                      <div className="space-y-3">
                        {currentQuestion.options.map((opt, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded border ${
                              opt.isCorrect
                                ? 'bg-green-100 border-green-300'
                                : 'bg-white border-gray-200'
                            }`}
                          >
                            {currentQuestion.questionType === 'order' ? (
                              <span>
                                {idx + 1}. {opt.text || `Lựa chọn ${idx + 1}`}
                              </span>
                            ) : (
                              <span>
                                {opt.text || `Đáp án ${idx + 1}`}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-center space-x-2 mt-6">
                      <Button
                        variant="outline"
                        disabled={currentQuestionIndex === 0}
                        onClick={() =>
                          setCurrentQuestionIndex(idx => Math.max(0, idx - 1))
                        }
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Trước
                      </Button>
                      <Button
                        variant="outline"
                        disabled={currentQuestionIndex === questions.length - 1}
                        onClick={() =>
                          setCurrentQuestionIndex(idx =>
                            Math.min(questions.length - 1, idx + 1)
                          )
                        }
                      >
                        Sau
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t p-4 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Input
                    value={formData.tagInput}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, tagInput: e.target.value }))
                    }
                    placeholder="Thêm tag"
                    className="w-32"
                    onKeyPress={e =>
                      e.key === 'Enter' && (e.preventDefault(), addTag())
                    }
                  />
                  <Button type="button" size="sm" onClick={addTag}>
                    Thêm
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1">
                  {formData.tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="flex items-center space-x-1"
                    >
                      <span>{tag}</span>
                      <button onClick={() => removeTag(idx)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" onClick={onClose}>
                    Hủy
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Đang lưu...</span>
                      </div>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Lưu Quiz
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
