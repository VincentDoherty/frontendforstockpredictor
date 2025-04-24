// Feedback.tsx
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'

interface BasicFeedback {
  id: number;
  comment: string;
}

interface AdvancedFeedback {
  id: number;
  rating: number;
  ease_of_use: number;
  useful_features: string;
  missing_features: string;
  general_comments: string;
}

export default function Feedback() {
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(0)
  const [easeOfUse, setEaseOfUse] = useState(0)
  const [usefulFeatures, setUsefulFeatures] = useState('Portfolio tracking, predictions')
  const [missingFeatures, setMissingFeatures] = useState('Mobile version, alerts')
  const [generalComments, setGeneralComments] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [allFeedback, setAllFeedback] = useState<{ basic: BasicFeedback[]; advanced: AdvancedFeedback[] }>({ basic: [], advanced: [] })

  const submitBasic = async () => {
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment })
      })
      if (res.ok) {
        setComment('')
        setSuccess('Basic feedback submitted')
        return loadFeedback()
      } else {
        setError('Failed to submit basic feedback')
      }
    } catch (e) {
      console.error(e)
      setError('Something went wrong while submitting basic feedback')
    }
  }

  const submitAdvanced = async () => {
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/feedback/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          ease_of_use: easeOfUse,
          useful_features: usefulFeatures,
          missing_features: missingFeatures,
          general_comments: generalComments
        })
      })
      if (res.ok) {
        setRating(0)
        setEaseOfUse(0)
        setGeneralComments('')
        setUsefulFeatures('Portfolio tracking, predictions')
        setMissingFeatures('Mobile version, alerts')
        setSuccess('Advanced feedback submitted')
        return loadFeedback()
      } else {
        setError('Failed to submit advanced feedback')
      }
    } catch (e) {
      console.error(e)
      setError('Something went wrong while submitting advanced feedback')
    }
  }

  const loadFeedback = async () => {
    try {
      const res = await fetch('/api/feedback/all')
      if (res.ok) {
        const data = await res.json()
        setAllFeedback({ basic: data.basic_feedback, advanced: data.advanced_feedback })
      }
    } catch (e) {
      console.error('Failed to load feedback', e)
    }
  }

  useEffect(() => {
    loadFeedback()
  }, [])

  const renderStars = (value: number, setValue: (n: number) => void) => (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
            <Star
                key={n}
                className={`w-5 h-5 cursor-pointer ${n <= value ? 'text-yellow-400' : 'text-gray-400'}`}
                onClick={() => setValue(n)}
                fill={n <= value ? 'currentColor' : 'none'}
            />
        ))}
      </div>
  )

  return (
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Submit Feedback</h1>

        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}

        <Card>
          <CardContent className="p-4 space-y-3">
            <h2 className="font-semibold">Basic Feedback</h2>
            <Textarea
                placeholder="Leave a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <Button onClick={submitBasic}>Submit</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="font-semibold">Advanced Feedback</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              {renderStars(rating, setRating)}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ease of Use</label>
              {renderStars(easeOfUse, setEaseOfUse)}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Useful Features</label>
              <Textarea
                  placeholder="What features were helpful to you? (e.g., Portfolio tracking, predictions)"
                  value={usefulFeatures}
                  onChange={(e) => setUsefulFeatures(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Missing Features</label>
              <Textarea
                  placeholder="What features did you wish were available? (e.g., Mobile version, alerts)"
                  value={missingFeatures}
                  onChange={(e) => setMissingFeatures(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">General Comments</label>
              <Textarea
                  placeholder="Additional comments..."
                  value={generalComments}
                  onChange={(e) => setGeneralComments(e.target.value)}
              />
            </div>
            <Button onClick={submitAdvanced}>Submit Advanced</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="font-semibold">Submitted Feedback</h2>
            <div>
              <h3 className="font-medium">Basic Comments:</h3>
              {allFeedback.basic.length === 0 ? (
                  <p className="text-sm text-gray-500">No basic feedback yet.</p>
              ) : (
                  <div className="space-y-3">
                    {allFeedback.basic.map((fb) => (
                        <div key={fb.id} className="border rounded p-3 bg-white shadow-sm">
                          {fb.comment}
                        </div>
                    ))}
                  </div>
              )}
            </div>
            <div>
              <h3 className="font-medium mt-3">Advanced Feedback:</h3>
              {allFeedback.advanced.length === 0 ? (
                  <p className="text-sm text-gray-500">No advanced feedback yet.</p>
              ) : (
                  <div className="space-y-3">
                    {allFeedback.advanced.map((fb) => (
                        <div key={fb.id} className="border rounded p-3 bg-white shadow-sm">
                          <p><strong>Rating:</strong> {fb.rating}</p>
                          <p><strong>Ease of Use:</strong> {fb.ease_of_use}</p>
                          <p><strong>Features Used:</strong> {fb.useful_features}</p>
                          <p><strong>Missing:</strong> {fb.missing_features}</p>
                          <p><strong>Comments:</strong> {fb.general_comments}</p>
                        </div>
                    ))}
                  </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
  )
}