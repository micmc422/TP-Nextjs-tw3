"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group";
import { Label } from "@workspace/ui/components/label";

// Quiz data embedded in the page component - TO BE EXTRACTED
const quizData = {
  title: "Quiz JavaScript",
  description: "Testez vos connaissances en JavaScript",
  questions: [
    {
      id: 1,
      question: "Quelle est la sortie de: console.log(typeof null)?",
      options: [
        { id: "a", text: "null" },
        { id: "b", text: "undefined" },
        { id: "c", text: "object" },
        { id: "d", text: "number" }
      ],
      correctAnswer: "c"
    },
    {
      id: 2,
      question: "Quelle méthode ajoute un élément à la fin d'un tableau?",
      options: [
        { id: "a", text: "unshift()" },
        { id: "b", text: "push()" },
        { id: "c", text: "pop()" },
        { id: "d", text: "shift()" }
      ],
      correctAnswer: "b"
    },
    {
      id: 3,
      question: "Que signifie 'use strict' en JavaScript?",
      options: [
        { id: "a", text: "Active le mode strict" },
        { id: "b", text: "Désactive les erreurs" },
        { id: "c", text: "Accélère le code" },
        { id: "d", text: "Compile le code" }
      ],
      correctAnswer: "a"
    }
  ]
};

export default function JavaScriptQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (questionId: number, answerId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quizData.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / quizData.questions.length) * 100;

    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Résultats du Quiz</CardTitle>
            <CardDescription>{quizData.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">{score} / {quizData.questions.length}</p>
              <p className="text-xl text-muted-foreground">
                Score: {percentage.toFixed(0)}%
              </p>
            </div>
            <div className="space-y-4 mt-6">
              {quizData.questions.map(q => (
                <div key={q.id} className="border-l-4 border-l-primary pl-4 py-2">
                  <p className="font-medium mb-2">{q.question}</p>
                  <p className={selectedAnswers[q.id] === q.correctAnswer ? "text-green-600" : "text-red-600"}>
                    Votre réponse: {q.options.find(o => o.id === selectedAnswers[q.id])?.text || "Non répondu"}
                  </p>
                  {selectedAnswers[q.id] !== q.correctAnswer && (
                    <p className="text-green-600">
                      Bonne réponse: {q.options.find(o => o.id === q.correctAnswer)?.text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={resetQuiz} className="w-full">Recommencer le quiz</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const question = quizData.questions[currentQuestion];

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{quizData.title}</CardTitle>
          <CardDescription>
            {quizData.description} - Question {currentQuestion + 1} sur {quizData.questions.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">{question.question}</h3>
            <RadioGroup
              value={selectedAnswers[question.id]}
              onValueChange={(value) => handleAnswerSelect(question.id, value)}
            >
              {question.options.map(option => (
                <div key={option.id} className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value={option.id} id={`q${question.id}-${option.id}`} />
                  <Label htmlFor={`q${question.id}-${option.id}`} className="cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
          >
            Précédent
          </Button>
          <Button
            onClick={handleNext}
            disabled={!selectedAnswers[question.id]}
          >
            {currentQuestion === quizData.questions.length - 1 ? "Voir les résultats" : "Suivant"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
