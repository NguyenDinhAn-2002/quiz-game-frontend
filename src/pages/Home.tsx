import { useEffect, useState } from 'react';
import { fetchQuizzes } from '../services/quiz';

const Home = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);

  useEffect(() => {
    fetchQuizzes()
      .then(data => setQuizzes(data))
      .catch(err => console.error('Failed to fetch quizzes', err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách Quiz</h1>
      <ul className="space-y-2">
        {quizzes.map((quiz, index) => (
          <li key={index} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{quiz.title}</h2>
            <p className="text-gray-600">Tags: {quiz.tags.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
